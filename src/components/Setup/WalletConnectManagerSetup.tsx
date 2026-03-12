import { WalletKitHelper as BSWalletKitHelper } from '@cityofzion/bs-multichain'
import { useNavigation } from '@react-navigation/native'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import type { PendingRequestTypes } from '@walletconnect/types'
import { useTranslation } from 'react-i18next'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import { useAccountMapSelector } from '@/hooks/useAccountSelector'
import { useMount } from '@/hooks/useMount'

export const WalletConnectManagerSetup = () => {
  const { accountsMapRef } = useAccountMapSelector()
  const navigation = useNavigation()

  const { t } = useTranslation('components', { keyPrefix: 'setup.walletConnectManagerSetup' })
  const { t: commonT } = useTranslation('common')

  useMount(() => {
    async function handleRequest(request: PendingRequestTypes.Struct) {
      const sessions = WalletKitHelper.kit.getActiveSessions()

      const session = sessions[request.topic]
      if (!session) return

      const sessionDetails = BSWalletKitHelper.getSessionDetails({
        session,
        services: BlockchainServiceHelper.bsAggregator.blockchainServices,
      })
      const sessionAccount = accountsMapRef.current.get(AccountHelper.buildAccountKey(sessionDetails))

      async function handleReject(reason?: ErrorResponse) {
        await WalletKitHelper.kit
          .respondSessionRequest({
            topic: request.topic,
            response: BSWalletKitHelper.formatRequestError(
              request,
              reason ?? BSWalletKitHelper.getError('USER_REJECTED')
            ),
          })
          .catch(error => LoggerHelper.error(error, { where: 'WalletConnectManagerSetup', operation: 'handleReject' }))
      }

      async function handleAccept() {
        try {
          const key = await SecureStoreHelper.getKey(sessionAccount!)
          if (!key) throw new AppError(commonT('errors.noKey'))

          const serviceAccount = await BlockchainServiceHelper.getServiceAccount({ account: sessionAccount!, key })

          const response = await BSWalletKitHelper.processRequest({
            account: serviceAccount,
            request,
            sessionDetails,
          })

          await WalletKitHelper.kit.respondSessionRequest({
            topic: request.topic,
            response: BSWalletKitHelper.formatRequestResult(request, response),
          })

          return response
        } catch (error) {
          LoggerHelper.error(error, { where: 'WalletConnectManagerSetup', operation: 'handleAccept' })

          await WalletKitHelper.kit.respondSessionRequest({
            topic: request.topic,
            response: BSWalletKitHelper.formatRequestError(request, {
              message: AppError.wrap(error, null).message,
              code: -32000,
            }),
          })

          throw error
        }
      }

      if (!sessionAccount || sessionAccount.type === 'watch') {
        handleReject(BSWalletKitHelper.getError('UNSUPPORTED_NAMESPACE_KEY'))
        return
      }

      const method = request.params.request.method

      if (sessionDetails.service.walletConnectService.autoApproveMethods.includes(method)) {
        ToastHelper.loading({
          message: t('autoAcceptProcessingMessage'),
          id: 'auto-approve-walletconnect-request',
        })

        handleAccept()
          .then(() => {
            ToastHelper.dismiss('auto-approve-walletconnect-request')
            ToastHelper.success({ message: t('autoAcceptSuccessMessage') })
          })
          .catch(error => {
            ToastHelper.dismiss('auto-approve-walletconnect-request')
            ToastHelper.error({ message: AppError.wrap(error, t('autoAcceptErrorMessage')).message })
          })
        return
      }

      await UtilsHelper.sleep(1000)
      navigation.navigate(
        'DappPermissionModal',
        {
          request,
          session,
          sessionDetails,
          sessionAccount,
          onAccept: handleAccept,
          onReject: handleReject,
        },
        { pop: true }
      )
    }

    const callbackId = requestIdleCallback(
      () => {
        const pendingRequests = WalletKitHelper.kit.getPendingSessionRequests()
        const startPendingRequest = pendingRequests[0]
        if (startPendingRequest) {
          handleRequest(startPendingRequest)
        }
      },
      { timeout: 1000 }
    )

    WalletKitHelper.kit.on('session_request', handleRequest)

    return () => {
      cancelIdleCallback(callbackId)
      WalletKitHelper.kit.off('session_request', handleRequest)
    }
  })

  return null
}
