import { type JSX, useEffect } from 'react'

import type { TWalletKitHelperSessionDetails } from '@cityofzion/bs-multichain'
import { BSNeoXConstants } from '@cityofzion/bs-neox'
import type { WalletKitTypes } from '@reown/walletkit'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import type { PendingRequestTypes, SessionTypes } from '@walletconnect/types'
import { useTranslation } from 'react-i18next'

import { WalletConnectError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useModalErase } from '@/hooks/useModalErase'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import { DappPermissionErrorContent } from './DappPermissionErrorContent'
import { DappPermissionGenericContent } from './DappPermissionGenericContent'
import { DappPermissionInvokeNeo3Content } from './DappPermissionInvokeNeo3Content'
import { DappPermissionSuccessContent } from './DappPermissionSuccessContent'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TAccount } from '@/types/store'

export type TDappPermissionProps = {
  request: PendingRequestTypes.Struct
  session: SessionTypes.Struct
  sessionDetails: TWalletKitHelperSessionDetails<TBlockchainServiceKey>
  sessionAccount: TAccount
  onAccept: () => void
  onReject: (reason?: ErrorResponse, toastMessage?: string) => void
  isAccepting: boolean
  isRejecting: boolean
}

const CUSTOM_CONTENT_BY_REQUEST: Partial<
  Record<TBlockchainServiceKey, Record<string, (props: TDappPermissionProps) => JSX.Element>>
> = {
  neo3: {
    invokeFunction: DappPermissionInvokeNeo3Content,
    signTransaction: DappPermissionInvokeNeo3Content,
  },
}

export const DappPermissionModal = ({ navigation, route }: TRootStackScreenProps<'DappPermissionModal'>) => {
  const { session, request, onAccept, onReject, sessionAccount, sessionDetails } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'dappPermissionModal' })
  const { handleErase } = useModalErase()
  const { authenticate } = useAuthentication()

  const blockchain = sessionAccount.blockchain || sessionDetails.blockchain

  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)

  const [isAccepting, startAccept] = usePressOnce(async () => {
    try {
      await authenticate(sessionAccount)

      const response = await onAccept()

      navigation.replace('SuccessModal', {
        title: t('successContent.title'),
        content: <DappPermissionSuccessContent response={response} />,
        buttonLabel: t('successContent.doneButtonLabel'),
      })
    } catch (error: any) {
      LoggerHelper.error(error, { where: 'DappPermissionModal', operation: 'startAccept' })
      const walletConnectError = WalletConnectError.wrap(error)

      if (walletConnectError.fromAppError) {
        ToastHelper.error({ message: walletConnectError.message, id: 'dapp-permission-error' })
        return
      }

      const hasNonce = !!request.params.request.params?.[0]?.nonce

      const isNeoxAntiMev =
        blockchain === 'neox' &&
        BSNeoXConstants.ANTI_MEV_RPC_LIST_BY_NETWORK_ID[selectedNetwork.id].some(url => url === selectedNetwork.url)

      // It's expected to receive a transaction cached error on first Anti-MEV transaction
      if (isNeoxAntiMev && hasNonce && error.message?.includes('transaction cached')) {
        navigation.replace('SuccessModal', {
          title: t('successContent.title'),
          // Don't translate the response, because this property isn't translated, it comes from RPC
          content: <DappPermissionSuccessContent response="Transaction cached" />,
          buttonLabel: t('successContent.doneButtonLabel'),
        })

        return
      }

      navigation.replace('ErrorModal', {
        title: t('errorContent.title'),
        content: <DappPermissionErrorContent error={error} />,
        buttonLabel: t('errorContent.doneButtonLabel'),
      })
    }
  })
  const [isRejecting, startReject] = usePressOnce(async (reason?: ErrorResponse, toastMessage?: string) => {
    await onReject(reason)
    handleErase()
    ToastHelper.error({ message: toastMessage || t('errors.cancelled'), id: 'dapp-permission-cancel' })
  })

  useEffect(() => {
    const handle = ({ id }: WalletKitTypes.SessionRequestExpire) => {
      if (id !== request.id) return
      ToastHelper.error({ message: t('errors.expired'), id: 'dapp-permission-expired' })
      handleErase()
    }

    WalletKitHelper.kit.on('session_request_expire', handle)

    return () => {
      WalletKitHelper.kit.off('session_request_expire', handle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.id, t])

  const Content = CUSTOM_CONTENT_BY_REQUEST[blockchain]?.[request.params.request.method] || DappPermissionGenericContent

  return (
    <TwModalLayout
      title={t('title')}
      rightElement={<TwModalLayoutCloseIconButton onPress={() => startReject()} />}
      onRequestClose={() => startReject()}
    >
      <Content
        request={request}
        session={session}
        sessionDetails={sessionDetails}
        sessionAccount={sessionAccount}
        onAccept={startAccept}
        onReject={startReject}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
      />
    </TwModalLayout>
  )
}
