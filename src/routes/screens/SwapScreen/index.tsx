import React, { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import type {
  TBSToken,
  TSwapLoadableValue,
  TSwapMinMaxAmount,
  TSwapToken,
  TSwapValidateValue,
} from '@cityofzion/blockchain-service'
import { BSBigNumberHelper, isCalculableFee } from '@cityofzion/blockchain-service'
import { SimpleSwapOrchestrator } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'
import type { TextInput } from 'react-native'
import { Text, View } from 'react-native'

import { ActionAddressButton } from '@/components/ActionAddressButton'
import { ActionFeeStep } from '@/components/ActionFeeStep'
import { ActionInput } from '@/components/ActionInput'
import { ActionStep } from '@/components/ActionStep'
import { ActionTokenButton } from '@/components/ActionTokenButton'
import { Loader } from '@/components/Loader'
import { Tooltip } from '@/components/Tooltip'
import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'
import { TwStepSeparator } from '@/components/TwStepSeparator'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { NumberHelper } from '@/helpers/NumberHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { StringHelper } from '@/helpers/StringHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { SwapHelper } from '@/helpers/SwapHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { TransactionHelper } from '@/helpers/TransactionHelper'

import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useBalance } from '@/hooks/useBalances'
import { useAppDispatch } from '@/hooks/useRedux'
import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import MdInfoOutline from '@/assets/images/md-info-outline.svg'
import TbCoin from '@/assets/images/tb-coin.svg'
import TbDiamond from '@/assets/images/tb-diamond.svg'
import TbHelp from '@/assets/images/tb-help.svg'
import TbReplace from '@/assets/images/tb-replace.svg'
import TbWallet from '@/assets/images/tb-wallet.svg'
import TbWand from '@/assets/images/tb-wand.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import { utilityReducerActions } from '@/store/reducers/utility'
import { thunks } from '@/store/thunks'
import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { IAccountState, TSwapRecord } from '@/types/store'

type TActionsData = {
  availableTokensToUse: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>[]>
  selectedTokenToUse: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>>
  selectedAccountToUse: TSwapValidateValue<IAccountState>
  selectedAmountToUse: TSwapLoadableValue<string>
  availableTokensToReceive: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>[]>
  selectedTokenToReceive: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>>
  selectedAmountToReceive: TSwapLoadableValue<string>
  selectedAddressToReceive: TSwapValidateValue<string>
  selectedExtraIdToReceive: TSwapValidateValue<string>
  selectAmountToUseMinMax: TSwapLoadableValue<TSwapMinMaxAmount>
  fee?: string
  isCalculatingFee: boolean
}

export const SwapScreen = ({ navigation, route }: TWalletsStackScreenProps<'SwapScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'swapScreen' })
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { accountsRef } = useAccountsSelector()
  const dispatch = useAppDispatch()
  const { authenticate } = useAuthentication()

  const { actionData, actionState, setData, setError, clearErrors, reset, handleAct } = useActions<TActionsData>(
    {
      availableTokensToUse: { loading: true, value: [] },
      selectedTokenToUse: { loading: false, value: null },
      selectedAccountToUse: { loading: false, value: route.params?.account ?? null, valid: null },
      selectedAmountToUse: { loading: false, value: null },
      availableTokensToReceive: { loading: false, value: [] },
      selectedTokenToReceive: { loading: false, value: null },
      selectedAmountToReceive: { loading: false, value: null },
      selectedAddressToReceive: { loading: false, value: null, valid: null },
      selectedExtraIdToReceive: { loading: false, value: null, valid: null },
      selectAmountToUseMinMax: { loading: false, value: null },
      fee: undefined,
      isCalculatingFee: false,
    },
    { clearErrorsOnChange: false }
  )

  const isAddressesDisabled = !actionData.selectedTokenToUse.value || !actionData.selectedTokenToReceive.value

  const isReceiveAddressDisabled =
    isAddressesDisabled || !actionData.selectedAccountToUse.value || actionData.selectedAccountToUse.valid === false

  const isAmountsDisabled =
    isAddressesDisabled ||
    !actionData.selectedAccountToUse.value ||
    actionData.selectedAccountToUse.valid === false ||
    !actionData.selectedAddressToReceive.value ||
    actionData.selectedAddressToReceive.valid === false

  const hasExtraIdToReceive = !!actionData.selectedTokenToReceive.value?.hasExtraId

  const isExtraIdToReceiveInvalid =
    hasExtraIdToReceive &&
    (!actionData.selectedExtraIdToReceive.valid || !actionData.selectedExtraIdToReceive.value?.trim())

  const isExtraIdToReceiveWrong = hasExtraIdToReceive && actionData.selectedExtraIdToReceive.valid === false

  const errorMessage = useMemo(() => {
    const message = actionState.errors.selectedAmountToUse ?? actionState.errors.fee ?? ''

    if (message) return message
    if (actionData.selectedAddressToReceive.valid === false) return t('form.errors.invalidAddress')
    if (isExtraIdToReceiveWrong) return t('form.errors.invalidExtraIdToReceive')

    return message

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData, actionState, isExtraIdToReceiveWrong])

  const balanceQuery = useBalance(actionData.selectedAccountToUse.value ?? undefined)

  const swapChainsByServiceName = useMemo(
    () => SwapHelper.getNetworks(selectedNetworkByBlockchain),
    [selectedNetworkByBlockchain]
  )

  const service = useMemo(
    () =>
      actionData.selectedAccountToUse.value
        ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[
            actionData.selectedAccountToUse.value.blockchain
          ]
        : undefined,
    [actionData.selectedAccountToUse.value]
  )

  const selectedTokenBalance = useMemo(() => {
    const tokenToUse = actionData.selectedTokenToUse.value

    const hash = tokenToUse?.hash
    if (!service || !balanceQuery.data || !hash) return

    return balanceQuery.data?.tokensBalances?.find(tokenBalance =>
      service.tokenService.predicateByHash(hash, tokenBalance.token)
    )
  }, [actionData.selectedTokenToUse.value, balanceQuery.data, service])

  const selectedAmountToUseInputRef = useRef<TextInput>(null)
  const swapOrchestratorRef = useRef<SimpleSwapOrchestrator<TBlockchainServiceKey>>(undefined)

  const initializeOrRestartService = async () => {
    const swapService = new SimpleSwapOrchestrator({
      blockchainServicesByName: BlockchainServiceHelper.bsAggregator.blockchainServicesByName,
      chainsByServiceName: swapChainsByServiceName,
    })

    swapService.eventEmitter.on('availableTokensToUse', availableTokensToUse => {
      if (!availableTokensToUse.value) availableTokensToUse.value = []

      setData({ availableTokensToUse })
    })

    swapService.eventEmitter.on('tokenToUse', tokenToUse => {
      setData({ selectedTokenToUse: tokenToUse })
    })

    swapService.eventEmitter.on('accountToUse', accountToUse => {
      const account = accountToUse.value
        ? accountsRef.current.find(AccountHelper.predicate(accountToUse.value))
        : undefined

      setData({ selectedAccountToUse: { ...accountToUse, value: account ?? null } })
    })

    swapService.eventEmitter.on('amountToUse', amountToUse => {
      setData({ selectedAmountToUse: amountToUse })
    })

    swapService.eventEmitter.on('availableTokensToReceive', availableTokensToReceive => {
      if (!availableTokensToReceive.value) availableTokensToReceive.value = []

      setData({ availableTokensToReceive })
    })

    swapService.eventEmitter.on('tokenToReceive', tokenToReceive => {
      setData({ selectedTokenToReceive: tokenToReceive })
    })

    swapService.eventEmitter.on('amountToReceive', amountToReceive => {
      setData({ selectedAmountToReceive: amountToReceive })
    })

    swapService.eventEmitter.on('addressToReceive', addressToReceive => {
      setData({ selectedAddressToReceive: addressToReceive })
    })

    swapService.eventEmitter.on('extraIdToReceive', selectedExtraIdToReceive => {
      setData({ selectedExtraIdToReceive })
    })

    swapService.eventEmitter.on('amountToUseMinMax', selectAmountToUseMinMax => {
      setData({ selectAmountToUseMinMax })
    })

    swapService.eventEmitter.on('error', error => {
      // TODO: Create a BSSwapError to show translated messages based on error codes
      ToastHelper.error({ message: error })
    })

    swapOrchestratorRef.current = swapService

    reset()
    swapService.init()
  }

  const handleSelectTokenToUse = (token: TSwapToken<TBlockchainServiceKey>) => {
    swapOrchestratorRef.current!.setAmountToUse(null)
    swapOrchestratorRef.current!.setTokenToUse(token)
  }

  const handleSelectAccountToUse = async (account: IAccountState) => {
    const key = await SecureStoreHelper.getKey(account)

    if (!key) return

    swapOrchestratorRef.current?.setAccountToUse(BlockchainServiceHelper.getServiceAccount({ account, key }))
  }

  const handleChangeAmountToUse = (amount: string) => {
    swapOrchestratorRef.current?.setAmountToUse(amount)
  }

  const handleSelectTokenToReceive = (token: TSwapToken<TBlockchainServiceKey>) => {
    swapOrchestratorRef.current?.setTokenToReceive(token)
  }

  const handleSelectAddressToReceive = (address: string) => {
    swapOrchestratorRef.current?.setAddressToReceive(
      StringHelper.removeSpecialCharacters(address, { allowSpaces: false })
    )
  }

  const handleChangeExtraIdToReceive = (extraIdToReceive: string) => {
    swapOrchestratorRef.current?.setExtraIdToReceive(extraIdToReceive)
  }

  const handleSubmit = async () => {
    if (
      !swapOrchestratorRef.current ||
      !service ||
      !actionData.selectedTokenToUse.value ||
      !actionData.selectedTokenToUse.value.hash ||
      actionData.selectedTokenToUse.value.decimals === undefined ||
      !actionData.selectedTokenToReceive.value ||
      !actionData.selectedAmountToUse.value ||
      !actionData.selectedAmountToReceive.value ||
      !actionData.selectedAccountToUse.value ||
      !actionData.selectedAddressToReceive.value ||
      !actionData.selectedAddressToReceive.valid ||
      !actionData.selectAmountToUseMinMax.value ||
      isExtraIdToReceiveInvalid
    ) {
      return
    }

    const swapRecord: TSwapRecord = {
      account: actionData.selectedAccountToUse.value,
      addressTo: actionData.selectedAddressToReceive.value,
      extraIdTo: actionData.selectedExtraIdToReceive.value ?? undefined,
      amountFrom: actionData.selectedAmountToUse.value,
      amountTo: actionData.selectedAmountToReceive.value,
      tokenFrom: actionData.selectedTokenToUse.value,
      tokenTo: actionData.selectedTokenToReceive.value,
      swapStatus: 'confirming',
      swapProvider: 'simpleswap',
      fee: actionData.fee,
    }

    try {
      await authenticate(actionData.selectedAccountToUse.value)

      const swapResponse = await swapOrchestratorRef.current.swap()

      swapRecord.swapId = swapResponse.id
      swapRecord.txFrom = swapResponse.txFrom
      swapRecord.log = swapResponse.log

      if (swapRecord.txFrom) {
        const transaction = TransactionHelper.buildPendingTransaction({
          fromAccount: actionData.selectedAccountToUse.value,
          txId: swapRecord.txFrom,
          events: [
            {
              amount: actionData.selectedAmountToUse.value,
              token: actionData.selectedTokenToUse.value as TBSToken,
              toAddress: swapRecord.addressTo,
            },
          ],
        })

        dispatch(thunks.waitTransaction({ transaction }))
      } else {
        swapRecord.swapStatus = 'refunded'
      }

      dispatch(utilityReducerActions.saveSwapRecord(swapRecord))

      navigation.navigate('SwapDetailsModal', { swapRecord })

      initializeOrRestartService()
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'SwapScreen', operation: 'submitSwap' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  useEffect(() => {
    initializeOrRestartService()

    return () => {
      swapOrchestratorRef.current?.eventEmitter.removeAllListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const validateAmount = () => {
      if (!actionData.selectedAmountToUse.value || !actionData.selectedTokenToReceive.value) {
        clearErrors('selectedAmountToUse')
        return
      }

      try {
        const amountNumber = NumberHelper.number(actionData.selectedAmountToUse.value)

        if (actionData.selectAmountToUseMinMax.value) {
          const minNumber = NumberHelper.number(actionData.selectAmountToUseMinMax.value.min)

          if (amountNumber < minNumber) {
            throw new AppError(t('form.errors.amountMin', { amount: actionData.selectAmountToUseMinMax.value.min }))
          }

          if (actionData.selectAmountToUseMinMax.value.max) {
            const maxNumber = NumberHelper.number(actionData.selectAmountToUseMinMax.value.max)

            if (amountNumber > maxNumber) {
              throw new AppError(t('form.errors.amountMax', { amount: actionData.selectAmountToUseMinMax.value.max }))
            }
          }
        }

        if (
          actionData.selectedAccountToUse.value &&
          actionData.selectedTokenToUse.value &&
          (!selectedTokenBalance || selectedTokenBalance.amountNumber < amountNumber)
        ) {
          throw new AppError(t('form.errors.insufficientFunds'))
        }

        clearErrors('selectedAmountToUse')
      } catch (error) {
        setError('selectedAmountToUse', AppError.wrap(error).message)
      }
    }

    validateAmount()
  }, [
    actionData.selectAmountToUseMinMax.value,
    actionData.selectedAccountToUse.value,
    actionData.selectedAmountToUse.value,
    actionData.selectedTokenToReceive.value,
    actionData.selectedTokenToUse.value,
    clearErrors,
    selectedTokenBalance,
    setError,
    t,
  ])

  useEffect(() => {
    if (balanceQuery.isLoading) return

    const handleCalculateFee = async () => {
      try {
        if (
          !swapOrchestratorRef.current ||
          !service ||
          !actionData.selectedTokenToUse.value ||
          !actionData.selectedTokenToUse.value.hash ||
          actionData.selectedTokenToUse.value.decimals === undefined ||
          !actionData.selectedTokenToReceive.value ||
          !actionData.selectedAmountToUse.value ||
          !actionData.selectedAmountToReceive.value ||
          !actionData.selectedAccountToUse.value ||
          !actionData.selectedAddressToReceive.value ||
          !actionData.selectedAddressToReceive.valid ||
          !actionData.selectAmountToUseMinMax.value ||
          !selectedTokenBalance
        ) {
          setData({ fee: undefined })
          return
        }

        setData({ isCalculatingFee: true })

        const fee = await swapOrchestratorRef.current.calculateFee()

        setData({ fee })

        let totalFeeAmount = NumberHelper.number(fee)
        const feeTokenHash = service.feeToken.hash

        if (service.tokenService.predicateByHash(feeTokenHash, actionData.selectedTokenToUse.value?.hash ?? '')) {
          totalFeeAmount += NumberHelper.number(actionData.selectedAmountToUse.value)
        }

        const feeBalanceNumber =
          balanceQuery.data?.tokensBalances?.find(({ token }) =>
            service.tokenService.predicateByHash(feeTokenHash, token)
          )?.amountNumber ?? 0

        if (totalFeeAmount > feeBalanceNumber) {
          throw new AppError(t('form.errors.insufficientFundsFee'))
        }

        clearErrors('fee')
      } catch (error) {
        setError('fee', AppError.wrap(error, t('form.errors.insufficientFundsFee')).message)
      } finally {
        setData({ isCalculatingFee: false })
      }
    }

    handleCalculateFee()
  }, [
    actionData.selectAmountToUseMinMax.value,
    actionData.selectedAccountToUse.value,
    actionData.selectedAddressToReceive.valid,
    actionData.selectedAddressToReceive.value,
    actionData.selectedAmountToReceive.value,
    actionData.selectedAmountToUse.value,
    actionData.selectedTokenToReceive.value,
    actionData.selectedTokenToUse.value,
    balanceQuery.data?.tokensBalances,
    balanceQuery.isLoading,
    clearErrors,
    selectedTokenBalance,
    service,
    setData,
    setError,
    t,
  ])

  useLayoutEffect(() => {
    if (!route.params?.account) return

    handleSelectAccountToUse(route.params?.account)
  }, [route.params?.account])

  return (
    <TwScreenLayout
      title={t('title')}
      contentContainerClassName="pt-0"
      headerClassName="h-[48px]"
      rightElement={
        <TwIconButton
          size="md"
          icon={<MdInfoOutline aria-hidden className="text-neon" />}
          onPress={() => navigation.navigate('SwapExplanationModal')}
        />
      }
    >
      <View className="h-10 flex-row justify-end">
        <TwButton variant="text-slim" label={t('restartButtonLabel')} onPress={initializeOrRestartService} />
      </View>

      <View className="rounded bg-gray-700/60 px-1 pb-3 pt-2">
        <ActionStep
          title={t('form.assets')}
          titleClassName="font-sans-bold"
          leftElement={<TbDiamond aria-hidden className="text-blue" />}
        />

        <TwSeparator />

        <ActionStep title={t('form.tokenToUseTitle')} leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}>
          <ActionTokenButton
            label={t('form.selectPlaceholder')}
            token={actionData.selectedTokenToUse.value}
            isLoading={actionData.availableTokensToUse.loading || actionData.selectedTokenToUse.loading}
            onPress={() =>
              navigation.navigate('TokenSelectionModal', {
                onSelect: handleSelectTokenToUse,
                account: actionData.selectedAccountToUse.value ?? undefined,
                blockchain: actionData.selectedAccountToUse.value?.blockchain,
                selectedToken: actionData.selectedTokenToUse.value ?? undefined,
                title: t('form.tokenToUseModalTitle'),
                tokens: actionData.availableTokensToUse.value!,
              })
            }
          />
        </ActionStep>

        <TwSeparator />

        <ActionStep
          title={t('form.tokenToReceiveTitle')}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <ActionTokenButton
            label={t('form.selectPlaceholder')}
            token={actionData.selectedTokenToReceive.value}
            isLoading={actionData.availableTokensToReceive.loading}
            disabled={!actionData.selectedTokenToUse.value}
            onPress={() =>
              navigation.navigate('TokenSelectionModal', {
                onSelect: handleSelectTokenToReceive,
                selectedToken: actionData.selectedTokenToReceive.value ?? undefined,
                title: t('form.tokenToReceiveModalTitle'),
                tokens: actionData.availableTokensToReceive.value!,
              })
            }
          />
        </ActionStep>
      </View>

      <TwStepSeparator />

      <View className="rounded bg-gray-700/60 px-1 pb-3 pt-2">
        <ActionStep
          title={t('form.source')}
          titleClassName="font-sans-bold"
          leftElement={<TbWallet aria-hidden className="text-blue" />}
        />

        <TwSeparator />

        <ActionStep
          title={t('form.accountToUseTitle')}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <ActionAddressButton
            label={t('form.selectPlaceholder')}
            address={actionData.selectedAccountToUse.value?.address}
            blockchain={actionData.selectedAccountToUse.value?.blockchain}
            isLoading={actionData.selectedAccountToUse.loading}
            disabled={
              actionData.availableTokensToUse.loading || !actionData.availableTokensToUse.value || isAddressesDisabled
            }
            onPress={() =>
              navigation.navigate('AccountSelectionModal', {
                title: t('form.accountToUseModalTitle'),
                onSelect: handleSelectAccountToUse,
                blockchains: actionData.selectedTokenToUse.value?.blockchain
                  ? [actionData.selectedTokenToUse.value.blockchain]
                  : (Object.keys(swapChainsByServiceName) as TBlockchainServiceKey[]),
              })
            }
          />
        </ActionStep>

        <TwSeparator />

        <ActionStep
          title={t('form.addressToReceiveTitle')}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
          error={actionData.selectedAddressToReceive.valid === false}
        >
          <ActionAddressButton
            label={t('form.selectPlaceholder')}
            address={actionData.selectedAddressToReceive.value}
            isLoading={actionData.selectedAddressToReceive.loading}
            disabled={isReceiveAddressDisabled}
            error={actionData.selectedAddressToReceive.valid === false}
            onPress={() =>
              navigation.navigate('AddressSelectionModal', {
                onSelect: handleSelectAddressToReceive,
                title: t('form.addressToReceiveModalTitle'),
                blockchain: actionData.selectedTokenToReceive.value?.blockchain,
              })
            }
          />
        </ActionStep>

        {hasExtraIdToReceive && (
          <Fragment>
            <TwSeparator />

            <ActionStep
              title={
                <View className="flex-row items-center">
                  <Text
                    numberOfLines={1}
                    className={StyleHelper.mergeStyles('font-sans-regular text-lg text-white', {
                      'text-pink': isExtraIdToReceiveWrong,
                    })}
                  >
                    {t('form.extraIdToReceive')}
                  </Text>

                  <TwIconButton
                    className="-ml-1.5"
                    aria-label={t('form.openAboutExtraIdToReceiveModal')}
                    size="md"
                    icon={<TbHelp aria-hidden className="mt-1 h-5 w-5 text-neon" />}
                    onPress={() => navigation.navigate('AboutExtraIdToReceiveModal')}
                  />
                </View>
              }
              leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
              error={isExtraIdToReceiveWrong}
            >
              <TwInput
                aria-label={t('form.extraIdToReceiveLabel')}
                placeholder={t('form.extraIdToReceivePlaceholder')}
                containerProps={{ className: 'w-[36%] max-w-36' }}
                inputContainerProps={{ className: 'h-11 px-3' }}
                disabled={isReceiveAddressDisabled}
                value={actionData.selectedExtraIdToReceive.value ?? ''}
                onChangeText={handleChangeExtraIdToReceive}
              />
            </ActionStep>
          </Fragment>
        )}
      </View>

      <TwStepSeparator />

      <View className="rounded bg-gray-700/60 px-1 py-2">
        <ActionStep
          title={t('form.amounts')}
          titleClassName="font-sans-bold"
          leftElement={<TbCoin aria-hidden className="text-blue" />}
        />

        <TwSeparator />

        <ActionStep
          title={t('form.amountToUseTitle')}
          description={t('form.minimumAmountTitle', {
            amount: BSBigNumberHelper.format(actionData.selectAmountToUseMinMax.value?.min ?? 0, { decimals: 6 }),
          })}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
          className="items-start"
          error={!!actionState.errors.selectedAmountToUse}
        >
          <Tooltip.Root type="focus">
            <Tooltip.Trigger>
              <ActionInput
                onChangeText={handleChangeAmountToUse}
                placeholder={t('form.amountPlaceholder')}
                value={actionData.selectedAmountToUse.value ?? ''}
                disabled={isAmountsDisabled}
                editable
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="off"
                keyboardType="decimal-pad"
                error={!!actionState.errors.selectedAmountToUse}
                ref={selectedAmountToUseInputRef}
              />
            </Tooltip.Trigger>
            <Tooltip.Content className="w-60 items-center gap-3">
              <TbWand aria-hidden className="size-5 text-blue" />
              <Text className="flex-shrink font-sans-regular text-sm text-white">
                {t('tooltips.experimentHigherAmounts')}
              </Text>
            </Tooltip.Content>
          </Tooltip.Root>
        </ActionStep>

        <View className="-mt-1 flex-row justify-between pb-4 pl-9.5 pr-3">
          <Text className="font-sans-regular text-sm italic text-gray-300">{t('form.balanceLabel')}</Text>
          <Text className="font-sans-regular text-sm italic text-gray-300">
            {selectedTokenBalance?.amount ?? '0.00'}
          </Text>
        </View>

        <TwSeparator />

        <ActionStep
          title={t('form.amountToReceiveTitle')}
          description={t('form.amountToReceiveDescription')}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
          className="mb-5"
        >
          {actionData.selectedAmountToReceive.loading ? (
            <Loader />
          ) : (
            <Text
              className={StyleHelper.mergeStyles('w-32 text-right font-sans-regular text-lg text-white', {
                'opacity-50': !actionData.selectedTokenToUse.value,
              })}
            >
              {BSBigNumberHelper.format(actionData.selectedAmountToReceive.value ?? 0, { decimals: 10 })}
            </Text>
          )}
        </ActionStep>
      </View>

      <ActionFeeStep
        title={t('form.transactionFee')}
        feePlaceholder={t('form.feePlaceholder')}
        isCalculatingFee={actionData.isCalculatingFee}
        fee={actionData.fee}
        service={service}
      />

      {errorMessage && <TwAlertErrorBanner className="mt-3" message={errorMessage} />}

      <TwButton
        className="mx-4 mb-12 mt-8"
        variant="contained-light"
        label={t('form.buttonSubmitLabel')}
        leftElement={<TbReplace aria-hidden className="text-neon" />}
        isLoading={actionState.isActing}
        onPress={handleAct(handleSubmit)}
        disabled={
          !actionState.isValid ||
          !actionData.selectAmountToUseMinMax.value ||
          !actionData.selectedAmountToUse.value ||
          !actionData.selectedAmountToReceive.value ||
          !actionData.selectedTokenToUse.value ||
          !actionData.selectedTokenToReceive.value ||
          !actionData.selectedAccountToUse.value ||
          !actionData.selectedAddressToReceive.value ||
          !actionData.selectedAddressToReceive.valid ||
          isExtraIdToReceiveInvalid ||
          !service ||
          (isCalculableFee(service) && !actionData.fee)
        }
      />
    </TwScreenLayout>
  )
}
