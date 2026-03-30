import { Fragment, useState } from 'react'

import { type TWalletKitHelperProposalDetails, WalletKitHelper as BSWalletKitHelper } from '@cityofzion/bs-multichain'
import type { ErrorResponse } from '@walletconnect/jsonrpc-utils'
import { Trans, useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { DappDetailsCard } from '@/components/DappDetailsCard'
import { ScreenLoader } from '@/components/ScreenLoader'
import { TwButton } from '@/components/TwButton'
import { TwDappHeader } from '@/components/TwDappHeader'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { WalletConnectError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import { useMount } from '@/hooks/useMount'
import { usePressOnce } from '@/hooks/usePressOnce'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TRootStackScreenProps } from '@/types/stacks'

export const DappConnectionRequestModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'DappConnectionRequestModal'>) => {
  const { account, proposal, fromDeeplink } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'dappConnectionRequestModal' })
  const { t: commonT } = useTranslation('common')

  const [proposalDetails, setProposalDetails] = useState<TWalletKitHelperProposalDetails>()

  const [isApproving, startApprove] = usePressOnce(async () => {
    try {
      await WalletKitHelper.kit.approveSession({ id: proposal.id, namespaces: proposalDetails!.approvedNamespaces })
      ToastHelper.success({ message: t('messages.connected', { dappName: proposal.proposer.metadata.name }) })
    } catch (error) {
      LoggerHelper.error(error, { where: 'DappConnectionRequestModal', operation: 'approveSession' })
      ToastHelper.error({ message: WalletConnectError.wrap(error).message })
    } finally {
      await WalletKitHelper.redirect({
        metadata: proposal.proposer.metadata,
        navigation,
        fromDeeplink,
      })
    }
  })

  const [isRejecting, startReject] = usePressOnce(async (reason?: ErrorResponse) => {
    await WalletKitHelper.kit
      .rejectSession({ id: proposal.id, reason: reason || BSWalletKitHelper.getError('USER_REJECTED') })
      .catch(error => LoggerHelper.error(error, { where: 'DappConnectionRequestModal', operation: 'rejectSession' }))

    await WalletKitHelper.redirect({
      metadata: proposal.proposer.metadata,
      navigation,
      fromDeeplink,
    })
  })

  const { isMounting } = useMount(
    () => {
      try {
        setProposalDetails(
          BSWalletKitHelper.getProposalDetails({
            proposal,
            address: account.address,
            service: BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain],
          })
        )
      } catch (error) {
        LoggerHelper.error(error, { where: 'DappConnectionRequestModal', operation: 'getProposalDetails' })
        ToastHelper.error({
          message: WalletConnectError.wrap(error).message,
          id: 'dapp-connection-details-proposal-error',
        })

        startReject(BSWalletKitHelper.getError('UNSUPPORTED_NAMESPACE_KEY'))
      }
    },
    [],
    1000
  )

  return (
    <TwModalLayout
      rightElement={<TwModalLayoutCloseIconButton onPress={() => startReject()} />}
      title={t('title')}
      onRequestClose={() => startReject()}
      contentContainerClassName="justify-between"
    >
      {isMounting || !proposalDetails ? (
        <ScreenLoader />
      ) : (
        <Fragment>
          <View className="gap-5">
            <TwDappHeader
              title={
                <Trans t={t} i18nKey="subtitle" values={{ dAppName: proposal.proposer.metadata.name }}>
                  <Text className="font-sans-bold">start</Text>
                  end
                </Trans>
              }
              uri={proposal.proposer.metadata.icons[0]}
            />

            <DappDetailsCard
              chain={proposalDetails.service.walletConnectService.chain}
              methods={proposalDetails.methods}
            />
          </View>

          <View className="mt-8 gap-4">
            <TwButton
              variant="contained-light"
              label={commonT('general.accept')}
              onPress={() => startApprove()}
              isLoading={isApproving}
            />

            <TwButton
              variant="outline"
              label={commonT('general.decline')}
              onPress={() => startReject()}
              isLoading={isRejecting}
            />
          </View>
        </Fragment>
      )}
    </TwModalLayout>
  )
}
