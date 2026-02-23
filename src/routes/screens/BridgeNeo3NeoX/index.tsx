import React, { useEffect, useRef } from 'react'

import type { TBalanceResponse, TBridgeToken, TBridgeValidateValue, TBridgeValue } from '@cityofzion/blockchain-service'
import { Neo3NeoXBridgeOrchestrator } from '@cityofzion/bs-multichain'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import type { BSNeoX } from '@cityofzion/bs-neox'
import { useIsFocused } from '@react-navigation/core'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { ActionAddressButton } from '@/components/ActionAddressButton'
import { ActionCard } from '@/components/ActionCard'
import { ActionFeeStep } from '@/components/ActionFeeStep'
import { ActionInput } from '@/components/ActionInput'
import { ActionStep } from '@/components/ActionStep'
import { ActionTokenButton } from '@/components/ActionTokenButton'
import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'
import { TwStepSeparator } from '@/components/TwStepSeparator'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { StringHelper } from '@/helpers/StringHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useAccountMapSelector } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useLazyBalance } from '@/hooks/useBalances'
import { useBridgeNeo3NeoXValidations } from '@/hooks/useBridgeNeo3NeoXValidations'
import { useMount } from '@/hooks/useMount'
import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import TbArrowsSort from '@/assets/images/tb-arrows-sort.svg'
import TbCoin from '@/assets/images/tb-coin.svg'
import TbDiamond from '@/assets/images/tb-diamond.svg'
import TbHelp from '@/assets/images/tb-help.svg'
import TbLock from '@/assets/images/tb-lock.svg'
import TbReplace2 from '@/assets/images/tb-replace-2.svg'
import TbWallet from '@/assets/images/tb-wallet.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { IAccountState } from '@/types/store'

type TActionsData = {
  availableTokensToUse: TBridgeValue<TBridgeToken<TBlockchainServiceKey>[]>
  tokenToUse: TBridgeValue<TBridgeToken<TBlockchainServiceKey>>
  tokenToUseBalance: TBridgeValue<TBalanceResponse | undefined>
  accountToUse: TBridgeValue<IAccountState>
  amountToUse: TBridgeValidateValue<string>
  amountToUseMin: TBridgeValue<string>
  amountToUseMax: TBridgeValue<string>
  tokenToReceive: TBridgeValue<TBridgeToken<TBlockchainServiceKey>>
  addressToReceive: TBridgeValidateValue<string>
  amountToReceive: TBridgeValue<string>
  bridgeFee: TBridgeValue<string>
}

const isBridgeValueInvalid = (value: TBridgeValue<any> | TBridgeValidateValue<any>): boolean => {
  return !value.value || !!value.error || value.loading || ('valid' in value ? value.valid !== true : false)
}

export const BridgeNeo3NeoXScreen = ({
  navigation,
  route: {
    params: { account },
  },
}: TWalletsStackScreenProps<'BridgeNeo3NeoXScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'bridgeNeo3NeoXScreen' })
  const { t: tCommonErrors } = useTranslation('common', { keyPrefix: 'errors' })
  const { accountsMapRef } = useAccountMapSelector()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { getBalance } = useLazyBalance()
  const { authenticate } = useAuthentication()
  const { canAccountBridge } = useBridgeNeo3NeoXValidations(account)
  const isFocused = useIsFocused()

  const { actionData, actionState, setData, reset, handleAct } = useActions<TActionsData>({
    availableTokensToUse: { value: null, error: null, loading: false },
    tokenToUse: { value: null, error: null, loading: false },
    tokenToUseBalance: { value: null, error: null, loading: false },
    accountToUse: { value: canAccountBridge ? account! : null, error: null, loading: false },
    amountToUse: { value: null, valid: null, error: null, loading: false },
    amountToUseMin: { value: null, error: null, loading: false },
    amountToUseMax: { value: null, error: null, loading: false },
    tokenToReceive: { value: null, error: null, loading: false },
    addressToReceive: { value: null, valid: null, error: null, loading: false },
    amountToReceive: { value: null, error: null, loading: false },
    bridgeFee: { value: null, error: null, loading: false },
  })

  const bridgeOrchestratorRef = useRef({} as Neo3NeoXBridgeOrchestrator<TBlockchainServiceKey>)
  const isGoingBack = useRef(false)

  const isAddressesDisabled =
    !actionData.tokenToUse.value ||
    actionData.tokenToUse.loading ||
    !actionData.tokenToReceive.value ||
    actionData.tokenToReceive.loading ||
    !actionData.availableTokensToUse.value ||
    actionData.availableTokensToUse.loading

  const isAmountsDisabled =
    isAddressesDisabled ||
    !actionData.accountToUse.value ||
    actionData.accountToUse.loading ||
    !actionData.addressToReceive.value ||
    actionData.addressToReceive.loading ||
    actionData.addressToReceive.valid === false

  const isRestartDisabled = actionData.availableTokensToUse.loading || !actionState.hasChanged

  const isDisabled =
    actionState.isActing ||
    isAddressesDisabled ||
    isAmountsDisabled ||
    isRestartDisabled ||
    isBridgeValueInvalid(actionData.availableTokensToUse) ||
    isBridgeValueInvalid(actionData.tokenToUse) ||
    isBridgeValueInvalid(actionData.tokenToUseBalance) ||
    isBridgeValueInvalid(actionData.accountToUse) ||
    isBridgeValueInvalid(actionData.amountToUse) ||
    isBridgeValueInvalid(actionData.amountToUseMin) ||
    isBridgeValueInvalid(actionData.amountToUseMax) ||
    isBridgeValueInvalid(actionData.tokenToReceive) ||
    isBridgeValueInvalid(actionData.addressToReceive) ||
    isBridgeValueInvalid(actionData.amountToReceive) ||
    isBridgeValueInvalid(actionData.bridgeFee)

  const hasAddressToReceiveError = actionData.addressToReceive.valid === false
  const hasAccountToUseError = !!actionData.accountToUse.error

  const hasAmountToUseError =
    actionData.amountToUse.valid === false ||
    !!actionData.amountToUse.error ||
    !!actionData.amountToUseMin.error ||
    !!actionData.amountToUseMax.error

  const errorCode =
    actionData.availableTokensToUse.error?.code ||
    actionData.tokenToUseBalance.error?.code ||
    actionData.accountToUse.error?.code ||
    actionData.tokenToUse.error?.code ||
    actionData.tokenToReceive.error?.code ||
    actionData.bridgeFee.error?.code ||
    actionData.amountToUse.error?.code ||
    actionData.amountToUseMin.error?.code ||
    actionData.amountToUseMax.error?.code ||
    actionData.addressToReceive.error?.code ||
    actionData.amountToReceive.error?.code

  const errorMessage = errorCode ? t(`errorsByCode.${errorCode}`, t('errorsByCode.UNEXPECTED_ERROR')) : undefined

  const neo3Service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName
    .neo3 as BSNeo3<TBlockchainServiceKey>
  const neoXService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName
    .neox as BSNeoX<TBlockchainServiceKey>

  const handleGoToBridgeNeo3NeoXAboutModal = () => {
    navigation.navigate('BridgeNeo3NeoXAboutModal')
  }

  const handleSwitchTokens = async () => {
    await bridgeOrchestratorRef.current.switchTokens()
  }

  const handleSetAccountToUse = async (account: IAccountState) => {
    try {
      const key = await SecureStoreHelper.getKey(account)
      if (!key) throw new AppError(tCommonErrors('noKey'))

      const serviceAccount = await BlockchainServiceHelper.getServiceAccount({ account, key })

      await bridgeOrchestratorRef.current.setAccountToUse(serviceAccount)

      const data = await getBalance({ address: account.address, blockchain: account.blockchain })
      if (!data) throw new AppError(tCommonErrors('unexpected'))

      await bridgeOrchestratorRef.current.setBalances(data.tokensBalances)
    } catch (error) {
      LoggerHelper.error(error, { where: 'BridgeNeo3NeoXScreen', operation: 'handleSetAccountToUse' })
      ToastHelper.error({ message: AppError.wrap(error, t('messages.selectAccountToUseError')).message })
    }
  }

  const handleSelectAccountToUse = () => {
    const blockchain = actionData.tokenToUse.value?.blockchain

    navigation.navigate('AccountSelectionModal', {
      title: t('form.accountToUseModalTitle'),
      blockchains: blockchain ? [blockchain] : ['neo3', 'neox'],
      onSelect: handleSetAccountToUse,
    })
  }

  const handleSelectAddressToReceive = () => {
    navigation.navigate('AddressSelectionModal', {
      title: t('form.addressToReceiveModalTitle'),
      blockchain: actionData.tokenToReceive.value?.blockchain,
      onSelect: (address: string) => {
        bridgeOrchestratorRef.current.setAddressToReceive(
          StringHelper.removeSpecialCharacters(address, { allowSpaces: false, allowDots: true })
        )
      },
    })
  }

  const handleChangeAmountToUse = (amount: string) => {
    bridgeOrchestratorRef.current.setAmountToUse(amount)
  }

  const handleSelectTokenToUse = () => {
    navigation.navigate('TokenSelectionModal', {
      title: t('form.tokenToUseModalTitle'),
      account: actionData.accountToUse.value ?? undefined,
      blockchain: actionData.accountToUse.value?.blockchain,
      selectedToken: actionData.tokenToUse.value ?? undefined,
      tokens: actionData.availableTokensToUse.value ?? [],
      onSelect: (token: TBridgeToken<TBlockchainServiceKey>) => {
        bridgeOrchestratorRef.current.setTokenToUse(token)
      },
    })
  }

  const handleApplyMaxAmountToUse = () => {
    if (!actionData.amountToUseMax.value || actionData.amountToUseMax.value === '0') return

    bridgeOrchestratorRef.current.setAmountToUse(actionData.amountToUseMax.value)
  }

  const initializeOrRestartService = async () => {
    reset()

    const neo3NeoXBridgeOrchestrator = new Neo3NeoXBridgeOrchestrator<TBlockchainServiceKey>({
      neo3Service,
      neoXService,
      initialFromServiceName: account?.blockchain,
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('availableTokensToUse', availableTokensToUse =>
      setData({ availableTokensToUse })
    )

    neo3NeoXBridgeOrchestrator.eventEmitter.on('tokenToUse', tokenToUse => setData({ tokenToUse }))

    neo3NeoXBridgeOrchestrator.eventEmitter.on('tokenToUseBalance', tokenToUseBalance => setData({ tokenToUseBalance }))

    neo3NeoXBridgeOrchestrator.eventEmitter.on('accountToUse', accountToUse => {
      const value = accountToUse.value
        ? (accountsMapRef.current.get(AccountHelper.buildAccountKey(accountToUse.value)) ?? null)
        : null

      setData({ accountToUse: { ...accountToUse, value } })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('amountToUse', amountToUse => setData({ amountToUse }))

    neo3NeoXBridgeOrchestrator.eventEmitter.on('amountToUseMin', amountToUseMin => setData({ amountToUseMin }))

    neo3NeoXBridgeOrchestrator.eventEmitter.on('amountToUseMax', amountToUseMax => setData({ amountToUseMax }))

    neo3NeoXBridgeOrchestrator.eventEmitter.on('tokenToReceive', tokenToReceive => setData({ tokenToReceive }))

    neo3NeoXBridgeOrchestrator.eventEmitter.on('addressToReceive', addressToReceive => setData({ addressToReceive }))

    neo3NeoXBridgeOrchestrator.eventEmitter.on('amountToReceive', amountToReceive => setData({ amountToReceive }))

    neo3NeoXBridgeOrchestrator.eventEmitter.on('bridgeFee', bridgeFee => setData({ bridgeFee }))

    await neo3NeoXBridgeOrchestrator.init()

    bridgeOrchestratorRef.current = neo3NeoXBridgeOrchestrator

    if (account) await handleSetAccountToUse(account)
  }

  const handleSubmit = () => {
    if (isDisabled) return

    const accountToUse = actionData.accountToUse.value!
    const tokenToUse = actionData.tokenToUse.value!
    const tokenToReceive = actionData.tokenToReceive.value!
    const addressToReceive = actionData.addressToReceive.value ?? ''
    const amountToUse = actionData.amountToUse.value ?? ''
    const amountToReceive = actionData.amountToReceive.value ?? ''

    navigation.navigate('BridgeNeo3NeoXConfirmationModal', {
      tokenToUse,
      tokenToReceive,
      accountToUse,
      addressToReceive,
      amountToUse,
      amountToReceive,
      bridgeFee: actionData.bridgeFee.value ?? '',
      fromService: bridgeOrchestratorRef.current.fromService,
      onSubmit: async modalNavigation => {
        try {
          await authenticate(accountToUse)

          const transactionHash = await bridgeOrchestratorRef.current.bridge()

          modalNavigation.popToTop()
          await UtilsHelper.sleep(500)

          modalNavigation.navigate('BridgeNeo3NeoXDetailsModal', {
            tokenToUse,
            tokenToReceive,
            accountToUse,
            addressToReceive,
            amountToUse,
            amountToReceive,
            transactionHash,
            confirmed: !transactionHash ? false : undefined,
          })

          initializeOrRestartService()
        } catch (error) {
          LoggerHelper.error(error, { where: 'BridgeNeo3NeoXScreen', operation: 'handleSubmit' })
          ToastHelper.error({ message: AppError.wrap(error, t('messages.bridgeError')).message, duration: 8000 })
        }
      },
    })
  }

  useMount(() => {
    initializeOrRestartService()

    return () => {
      bridgeOrchestratorRef.current?.eventEmitter?.removeAllListeners()
    }
  })

  useEffect(() => {
    if (!isFocused || isGoingBack.current) return
    if (selectedNetworkByBlockchain.neo3.type === 'mainnet' && selectedNetworkByBlockchain.neox.type === 'mainnet')
      return

    isGoingBack.current = true

    ToastHelper.info({
      id: 'bridge-neo3-neox-mainnet-info',
      message: t('messages.networksShouldBeMainnet'),
      duration: 8000,
    })

    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'WalletsScreen',
      },
    })
  }, [navigation, t, isFocused, selectedNetworkByBlockchain.neo3, selectedNetworkByBlockchain.neox])

  return (
    <TwScreenLayout
      headerClassName="mt-2"
      title={
        <View className="-mt-1 flex max-w-[50%] flex-1 flex-row items-center justify-center">
          <Text className="line-clamp-1 font-sans-medium text-xl text-white">{t('title')}</Text>

          <TwIconButton
            aria-label={t('aboutButtonLabel')}
            size="sm"
            className="mt-1"
            icon={<TbHelp className="text-neon" aria-hidden />}
            onPress={handleGoToBridgeNeo3NeoXAboutModal}
          />
        </View>
      }
      rightElement={
        <TwButton
          label={t('restartButtonLabel')}
          className="mr-4"
          variant="text-slim"
          colorSchema={isRestartDisabled ? 'white' : 'neon'}
          disabled={isRestartDisabled}
          onPress={initializeOrRestartService}
        />
      }
    >
      <ActionCard>
        <ActionStep
          title={t('form.assetsStepLabel')}
          titleClassName="font-sans-bold"
          className="mb-2"
          leftElement={<TbDiamond aria-hidden className="text-blue" />}
        />

        <TwSeparator />

        <ActionStep
          title={t('form.tokenToUseLabel')}
          error={!!actionData.tokenToUse.error}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <ActionTokenButton
            label={t('form.selectPlaceholder')}
            className="bg-asphalt"
            tokenClassName="text-md text-neon"
            blockchainClassName="text-md text-neon"
            token={actionData.tokenToUse.value}
            isLoading={actionData.availableTokensToUse.loading || actionData.tokenToUse.loading}
            contentProps={{ className: 'px-1 gap-2' }}
            onPress={handleSelectTokenToUse}
          />
        </ActionStep>

        <View className="relative w-full">
          <TwSeparator containerClassName="py-1" />

          <View className="absolute left-1/2 top-1/2 mx-auto flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-800 p-2">
            <TwIconButton
              aria-label={t('form.switchTokensButtonLabel')}
              size="md"
              className="h-8 w-8 rounded-full bg-neon"
              icon={<TbArrowsSort aria-hidden className="h-5 max-h-5 min-h-5 w-5 min-w-5 max-w-5 text-black" />}
              onPress={handleSwitchTokens}
            />
          </View>
        </View>

        <ActionStep
          title={t('form.tokenToReceiveLabel')}
          error={!!actionData.tokenToReceive.error}
          leftElement={<TbLock aria-hidden className="h-5 w-5" />}
        >
          <ActionTokenButton
            label={t('form.selectPlaceholder')}
            tokenClassName="text-md"
            blockchainClassName="text-md"
            variant="card"
            token={actionData.tokenToReceive.value}
            isLoading={actionData.tokenToReceive.loading}
            disabled
            contentProps={{ className: 'px-1 gap-2' }}
          />
        </ActionStep>
      </ActionCard>

      <TwStepSeparator iconContainerClassName="bg-gray-700" />

      <ActionCard>
        <ActionStep
          title={t('form.accountDetailsStepLabel')}
          titleClassName="font-sans-bold"
          className="mb-2"
          leftElement={<TbWallet aria-hidden className="text-blue" />}
        />

        <TwSeparator />

        <ActionStep
          title={t('form.accountToUseLabel')}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
          error={hasAccountToUseError}
        >
          <ActionAddressButton
            label={t('form.selectPlaceholder')}
            address={actionData.accountToUse.value?.address}
            className="bg-asphalt"
            isLoading={actionData.accountToUse.loading}
            disabled={isAddressesDisabled}
            error={hasAccountToUseError}
            contentProps={{ className: 'px-3 gap-2' }}
            labelProps={
              !!actionData.accountToUse.value?.address
                ? {
                    className: StyleHelper.mergeStyles('text-md', { 'text-pink': hasAccountToUseError }),
                    ellipsizeMode: 'middle',
                  }
                : undefined
            }
            onPress={handleSelectAccountToUse}
          />
        </ActionStep>

        <TwSeparator />

        <ActionStep
          title={t('form.addressToReceiveLabel')}
          error={hasAddressToReceiveError}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <ActionAddressButton
            label={t('form.selectPlaceholder')}
            address={actionData.addressToReceive.value}
            className="bg-asphalt"
            isLoading={actionData.addressToReceive.loading}
            disabled={isAddressesDisabled}
            error={hasAddressToReceiveError}
            contentProps={{ className: 'px-3 gap-2' }}
            labelProps={
              !!actionData.addressToReceive.value
                ? {
                    className: StyleHelper.mergeStyles('text-md', { 'text-pink': hasAddressToReceiveError }),
                    ellipsizeMode: 'middle',
                  }
                : undefined
            }
            onPress={handleSelectAddressToReceive}
          />
        </ActionStep>
      </ActionCard>

      <TwStepSeparator iconContainerClassName="bg-gray-700" />

      <ActionCard>
        <ActionStep
          title={t('form.amountsStepLabel')}
          titleClassName="font-sans-bold"
          className="mb-2"
          leftElement={<TbCoin aria-hidden className="text-blue" />}
        />

        <TwSeparator />

        <ActionStep
          title={t('form.amountToUseLabel')}
          description={t('form.amountToUseMinLabel', {
            amount: actionData.amountToUseMin.value || t('form.amountToUseMinPlaceholder'),
          })}
          descriptionClassName="text-xs mt-1 text-gray-100"
          className="-mt-5"
          error={hasAmountToUseError}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <ActionInput
            aria-label={t('form.amountToUseLabel')}
            placeholder={t('form.amountPlaceholder')}
            keyboardType="decimal-pad"
            className="text-md w-24"
            containerClassName="mt-6"
            value={actionData.amountToUse.value ?? ''}
            disabled={isAmountsDisabled}
            editable={!isAmountsDisabled}
            error={hasAmountToUseError}
            maxButtonProps={{
              isLoading: actionData.amountToUseMax.loading,
              disabled: !actionData.amountToUseMax.value || isAmountsDisabled,
              labelProps: { className: 'text-md' },
              onPress: handleApplyMaxAmountToUse,
            }}
            onChangeText={handleChangeAmountToUse}
          />
        </ActionStep>

        <View className="mb-4 flex flex-row justify-between gap-x-2 pl-9 pr-4">
          <Text className="font-sans-italic text-xs text-gray-100">{t('form.balanceLabel')}</Text>
          <Text className="font-sans-italic text-xs text-gray-100">
            {actionData.tokenToUseBalance.value?.amount ?? t('form.balancePlaceholder')}
          </Text>
        </View>

        <TwSeparator />

        <ActionStep
          title={t('form.amountToReceiveLabel')}
          description={t('form.amountToReceiveAfterFeesLabel')}
          descriptionClassName="text-xs mt-1 text-gray-100"
          className="mb-4"
          error={!!actionData.amountToReceive.error}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <Text className="font-sans-medium text-lg text-white">
            {actionData.amountToReceive.value ?? t('form.amountToReceivePlaceholder')}
          </Text>
        </ActionStep>
      </ActionCard>

      {bridgeOrchestratorRef.current.fromService && (
        <ActionFeeStep
          title={t('form.bridgeFeeLabel')}
          feePlaceholder={t('form.bridgeFeePlaceholder')}
          fee={actionData.bridgeFee.value ?? undefined}
          isCalculatingFee={actionData.bridgeFee.loading}
          service={bridgeOrchestratorRef.current.fromService}
        />
      )}

      {errorMessage && <TwAlertErrorBanner message={errorMessage} className="mt-3" />}

      <TwButton
        label={t('form.submitButtonLabel')}
        variant="contained-light"
        className="mx-4 mb-10 mt-6"
        isLoading={actionState.isActing}
        disabled={isDisabled}
        leftElement={<TbReplace2 aria-hidden className="text-neon" />}
        onPress={handleAct(handleSubmit)}
      />
    </TwScreenLayout>
  )
}
