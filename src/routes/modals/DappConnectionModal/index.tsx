import { useEffect } from 'react'

import { WalletKitHelper as BSWalletKitHelper } from '@cityofzion/bs-multichain'
import type { ProposalTypes, SignClientTypes } from '@walletconnect/types'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import { useActions } from '@/hooks/useActions'
import { useIsConnectedSelector } from '@/hooks/useUtilitySelector'
import { useOwnWalletsSelector } from '@/hooks/useWalletSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { TAccount, TWallet } from '@/types/store'

type TActionData = {
  uri: string
}

export const DappConnectionModal = ({ navigation, route }: TRootStackScreenProps<'DappConnectionModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappConnectionModal' })
  const { isNotConnected } = useIsConnectedSelector()
  const { walletsRef } = useOwnWalletsSelector()

  const { actionData, actionDataRef, actionState, setData, setError, reset, handleAct } = useActions<TActionData>({
    uri: '',
  })

  const handlePair = (uri: string) => {
    return new Promise<ProposalTypes.Struct>(async (resolve, reject) => {
      try {
        const timeout = setTimeout(() => {
          WalletKitHelper.kit.off('session_proposal', listener)
          reject(new AppError(t('errors.timeout')))
        }, 6000)

        const listener = (proposal: Omit<SignClientTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'>) => {
          resolve(proposal.params)
          clearTimeout(timeout)
          WalletKitHelper.kit.off('session_proposal', listener)
        }

        WalletKitHelper.kit.once('session_proposal', listener)

        await WalletKitHelper.kit.pair({ uri })
      } catch (error) {
        reject(error)
      }
    })
  }

  const handleSubmit = async () => {
    const proposal = await handlePair(actionDataRef.current.uri)

    const handleClose = async () => {
      reset()
      WalletKitHelper.kit
        .rejectSession({ id: proposal.id, reason: BSWalletKitHelper.getError('USER_REJECTED') })
        .catch(error =>
          LoggerHelper.error(error, { where: 'DappConnectionModal', operation: 'rejectSession/handleClose' })
        )

      await WalletKitHelper.redirect({
        metadata: proposal.proposer.metadata,
        navigation,
        fromDeeplink: route.params?.fromDeeplink,
      })
    }

    const services = BSWalletKitHelper.getProposalServices({
      proposal,
      services: BlockchainServiceHelper.bsAggregator.blockchainServices,
    })
    if (services.length === 0) {
      ToastHelper.error({
        message: t('errors.unsupportedNamespaceKey'),
        id: 'dapp-connection-details-proposal-error',
      })
      handleClose()
      return
    }

    const blockchains = services.map(service => service.name)

    const handleSelectAccount = async (account: TAccount) => {
      navigation.navigate('DappConnectionRequestModal', {
        account,
        proposal,
        fromDeeplink: route.params?.fromDeeplink,
      })
    }

    if (route.params?.account) {
      handleSelectAccount(route.params.account)
      return
    }

    if (walletsRef.current.length === 1) {
      navigation.navigate('AccountStackListSelectionModal', {
        title: t('accountSelection.title'),
        description: t('accountSelection.description'),
        onSelect: handleSelectAccount,
        wallet: walletsRef.current[0],
        onRequestClose: handleClose,
        blockchains,
      })
      return
    }

    navigation.navigate('WalletSelectionModal', {
      title: t('walletSelection.title'),
      description: t('walletSelection.description'),
      onRequestClose: handleClose,
      blockchains,
      onSelect: (wallet: TWallet) => {
        navigation.navigate('AccountStackListSelectionModal', {
          wallet,
          title: t('accountSelection.title'),
          description: t('accountSelection.description'),
          onSelect: handleSelectAccount,
          onRequestClose: handleClose,
          blockchains,
        })
      },
    })
  }

  const handleChangeText = (text: string) => {
    setData({ uri: text })

    if (!BSWalletKitHelper.isValidURI(text)) {
      setError('uri', t('errors.invalidUrl'))
    }
  }

  const handleScan = async (data: string) => {
    handleChangeText(data)
    handleAct(handleSubmit)()
  }

  useEffect(() => {
    if (!route.params?.uri) return

    handleChangeText(route.params.uri)
    handleAct(handleSubmit)()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.uri])

  return (
    <TwModalLayout
      rightElement={<TwModalLayoutCloseIconButton />}
      title={t('title')}
      contentContainerClassName="justify-between"
    >
      <View className="mt-5">
        <Text className="text-center font-sans-regular text-lg text-white">{t('subtitle')}</Text>

        <TwInput
          containerProps={{
            className: 'mt-16',
          }}
          label={t('url')}
          value={actionData.uri}
          placeholder={t('placeholder')}
          pastable
          scannable
          onChangeText={handleChangeText}
          error={actionState.errors.uri}
          onScan={handleScan}
        />
      </View>

      <TwButton
        variant="contained-light"
        label={t('connectLabel')}
        disabled={!actionState.isValid || isNotConnected}
        onPress={handleAct(handleSubmit)}
        isLoading={actionState.isActing}
      />
    </TwModalLayout>
  )
}
