import React, { useEffect, useMemo, useRef } from 'react'

import { BSBigNumberHelper, isCalculableFee } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import type { TextInput } from 'react-native'
import { Text, View } from 'react-native'

import { ActionAddressButton } from '@/components/ActionAddressButton'
import { ActionFeeStep } from '@/components/ActionFeeStep'
import { ActionInput } from '@/components/ActionInput'
import { ActionStep } from '@/components/ActionStep'
import { ActionTokenButton } from '@/components/ActionTokenButton'
import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'
import { TwStepSeparator } from '@/components/TwStepSeparator'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { NumberHelper } from '@/helpers/NumberHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { StringHelper } from '@/helpers/StringHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { TransactionHelper } from '@/helpers/TransactionHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useAccountMapSelector } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useBalance } from '@/hooks/useBalances'
import { useDebounceFunction } from '@/hooks/useDebounceFunction'
import { useAppDispatch } from '@/hooks/useRedux'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TDepositActionsData } from '@/routes/screens/BuyAndSellTokensScreen'

import TbStepInto from '@/assets/images/tb-step-into.svg'
import TbStepOut from '@/assets/images/tb-step-out.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import { thunks } from '@/store/thunks'
import type { TTokenSelectionModalToken } from '@/types/modals'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { IAccountState } from '@/types/store'

export const SellTokensDepositModal = ({
  navigation,
  route: { params },
}: TRootStackScreenProps<'SellTokensDepositModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDepositModal' })
  const { t: commonT } = useTranslation('common')

  const dispatch = useAppDispatch()
  const { currency } = useCurrencySelector()
  const { authenticate } = useAuthentication()
  const debounceAddress = useDebounceFunction()
  const debounceAmount = useDebounceFunction()
  const { accountsMapRef } = useAccountMapSelector()
  const amountTextInputRef = useRef<TextInput>(null)
  const isTransactionCompleted = useRef(false)

  const { actionData, actionState, setData, setError, clearErrors, handleAct } = useActions<TDepositActionsData>(
    params.depositActionsData ?? {
      amount: '',
      isAmountLoading: false,
      address: '',
      account: params.account,
      isFeeLoading: false,
    }
  )

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance(actionData.account)

  const tokenBalances = useMemo(() => balanceData?.tokensBalances ?? [], [balanceData])

  const service = useMemo(
    () =>
      actionData.account
        ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[actionData.account.blockchain]
        : undefined,
    [actionData.account]
  )

  const tokenBalance = useMemo(() => {
    const { token } = actionData

    const hash = token?.hash
    if (tokenBalances.length === 0 || !hash || !service) return null

    return tokenBalances.find(balance => service.tokenService.predicateByHash(hash, balance.token)) ?? null

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData.token, tokenBalances, service])

  const isRecipientDisabled = !actionData.account
  const isAmountDisabled = isRecipientDisabled || isBalanceLoading || !actionData.token
  const isServiceCalculableFee = service ? isCalculableFee(service) : false
  const blockchain = service?.name
  const { amount: amountError, address: addressError, token: tokenError, account: accountError } = actionState.errors
  const errorMessage = actionState.errors.fee || addressError || tokenError || amountError || accountError || ''
  const isInvalidForm = !service || isAmountDisabled || !actionData.address || !actionData.amount

  const isDisabled =
    !balanceData ||
    isBalanceLoading ||
    actionState.isActing ||
    !actionState.isValid ||
    actionData.isFeeLoading ||
    actionData.isAmountLoading ||
    !!errorMessage ||
    isInvalidForm ||
    (isServiceCalculableFee && !actionData.fee)

  const handleChangeAccount = (account: IAccountState) => {
    setData({
      account,
      fee: undefined,
      ...(account.blockchain !== actionData.account?.blockchain ? { token: undefined, amount: '' } : {}),
    })
  }

  const handleChangeToken = (token: TTokenSelectionModalToken) => {
    setData({ token, amount: '' })
  }

  const handleChangeAmount = (amount: string) => {
    setData({ amount, isAmountLoading: true })

    debounceAmount(() => {
      setData({
        amount: BSBigNumberHelper.format(amount, { decimals: tokenBalance?.token?.decimals }),
        isAmountLoading: false,
      })
    })
  }

  const handleChangeAddress = (address: string) => {
    setData({ address: StringHelper.removeSpecialCharacters(address, { allowSpaces: false, trimText: true }) })
  }

  const handleOpenAccountSelectionModal = () => {
    navigation.navigate('AccountSelectionModal', {
      title: t('accountSelection.title'),
      onSelect: handleChangeAccount,
    })
  }

  const handleOpenTokenSelectionModal = () => {
    navigation.navigate('TokenSelectionModal', {
      title: t('selectionToken.title'),
      account: actionData.account,
      blockchain,
      selectedToken: actionData.token,
      tokens: tokenBalances.map(({ token }) => token) ?? [],
      onSelect: handleChangeToken,
    })
  }

  const handleSubmit = async () => {
    if (isDisabled || isTransactionCompleted.current) return

    const account = actionData.account!

    try {
      await authenticate(account)

      const key = await SecureStoreHelper.getKey(account)
      if (!key) throw new AppError(commonT('errors.noKey'))

      const token = tokenBalance!.token
      const amount = actionData.amount
      const address = actionData.address
      const serviceAccount = await BlockchainServiceHelper.getServiceAccount({ account, key })

      const [transactionHash] = await service.transfer({
        senderAccount: serviceAccount,
        intents: [{ amount, receiverAddress: address, token }],
      })

      isTransactionCompleted.current = true

      const toAccount = accountsMapRef.current.get(
        AccountHelper.buildAccountKey({
          address,
          blockchain: account.blockchain,
        })
      )

      const transaction = TransactionHelper.buildPendingTransaction({
        fromAccount: account,
        txId: transactionHash,
        events: [
          {
            amount,
            toAccount: toAccount,
            toAddress: address,
            token,
          },
        ],
      })

      dispatch(
        thunks.waitTransaction({
          transaction,
          failureNotification: {
            title: 'modals:sellTokensDepositModal.failureNotification.title',
            previewBody: 'modals:sellTokensDepositModal.failureNotification.previewBody',
          },
          successNotification: {
            title: 'modals:sellTokensDepositModal.successNotification.title',
            previewBody: 'modals:sellTokensDepositModal.successNotification.previewBody',
          },
        })
      )

      params.setDepositActionsData(null)
      navigation.popToTop()

      await UtilsHelper.sleep(500)

      navigation.navigate('SellTokensDepositSuccessModal', { transaction })
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'SellTokensDepositModal', operation: 'submitDeposit' })
      ToastHelper.error({ message: AppError.wrap(error, t('messages.transactionFailed')).message })
    }
  }

  useEffect(() => {
    debounceAddress(() => {
      if (!actionData.address || !actionData.account || service!.validateAddress(actionData.address)) {
        clearErrors('address')
        return
      }

      setError('address', t('messages.invalidAddress'))
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData.address, actionData.account])

  useEffect(() => {
    const handleCalculateFee = async () => {
      if (
        !balanceData ||
        isBalanceLoading ||
        actionData.isAmountLoading ||
        isInvalidForm ||
        isTransactionCompleted.current ||
        !isCalculableFee(service)
      ) {
        setData({ fee: undefined })

        return
      }

      setData({ isFeeLoading: true })

      try {
        const account = actionData.account!
        const key = await SecureStoreHelper.getKey(account)

        if (!key) return

        const token = tokenBalance?.token
        const amount = actionData.amount

        if (!token || !amount) {
          const message = t('messages.insufficientFunds')
          setError('amount', message)
          throw new AppError(message)
        }

        const serviceAccount = await BlockchainServiceHelper.getServiceAccount({ account, key })

        const fee = await service.calculateTransferFee({
          senderAccount: serviceAccount,
          intents: [
            {
              amount: BSBigNumberHelper.format(actionData.amount, { decimals: token.decimals }),
              receiverAddress: actionData.address,
              token,
            },
          ],
        })

        let feeWithAmountBn = BSBigNumberHelper.fromNumber(fee)

        setData({ fee })

        if (service.tokenService.predicateByHash(service.feeToken, token)) {
          feeWithAmountBn = feeWithAmountBn.plus(amount)
        }

        const feeTokenBalance = tokenBalances.find(({ token }) =>
          service.tokenService.predicateByHash(service.feeToken, token)
        )

        const amountBn = BSBigNumberHelper.fromNumber(amount)

        if (amountBn.isZero() || amountBn.isNegative()) {
          setError('amount', t('messages.invalidAmount'))
        } else if (
          amountBn.isGreaterThan(tokenBalance?.amount ?? '0') ||
          feeWithAmountBn.isGreaterThan(feeTokenBalance?.amount ?? '0')
        ) {
          setError('amount', t('messages.insufficientFunds'))
        } else {
          clearErrors(['fee', 'amount'])
        }
      } catch (error) {
        LoggerHelper.error(error, { where: 'SellTokensDepositModal', operation: 'handleCalculateFee' })

        const errorMessage = t('messages.feeError')

        ToastHelper.error({ message: errorMessage })

        setError('fee', errorMessage)
        setData({ fee: undefined })

        throw error
      } finally {
        setData({ isFeeLoading: false })
      }
    }

    handleCalculateFee()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionData.amount,
    actionData.account,
    actionData.token,
    actionData.address,
    actionData.isAmountLoading,
    balanceData,
    service,
  ])

  useEffect(() => {
    return () => {
      if (isTransactionCompleted.current) return

      params.setDepositActionsData({
        ...actionData,
        fee: undefined,
        isFeeLoading: false,
        isAmountLoading: false,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <TwModalLayout
      title={t('title')}
      titleClassName="text-white text-xl"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <Text className="mx-3 font-sans-bold text-sm text-white">{t('description')}</Text>

      <Text className="mx-3 mt-4 font-sans-regular text-sm text-white">{t('observation')}</Text>

      <TwSeparator containerClassName="px-3 mt-4" />

      <Text className="mx-3 mt-4 font-sans-semibold text-xs uppercase text-gray-200">{t('form.title')}</Text>

      <View className="mt-3 rounded bg-gray-300/15 px-1 pb-0 pt-2">
        <ActionStep
          title={t('form.account.label')}
          className="pb-6"
          leftElement={<TbStepOut aria-hidden className="h-5 w-5 text-blue" />}
        >
          <ActionAddressButton
            label={t('form.select.placeholder')}
            className="h-11 w-30 rounded-md"
            contentProps={{ className: 'px-2 gap-2' }}
            address={actionData.account?.address}
            blockchain={blockchain}
            error={!!accountError}
            isLoading={false}
            onPress={handleOpenAccountSelectionModal}
          />
        </ActionStep>
      </View>

      <TwStepSeparator contentClassName="bg-gray-700" iconContainerClassName="bg-gray-300/15" />

      <View className="rounded bg-gray-300/15 px-1 py-3">
        <ActionStep
          title={t('form.recipient.label')}
          className="pb-6 pt-4"
          leftElement={<TbStepInto aria-hidden className="h-5 w-5 text-blue" />}
        />

        <TwSeparator containerClassName="px-1" />

        <ActionStep
          title={t('form.token.label')}
          error={!!tokenError}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <ActionTokenButton
            label={t('form.select.placeholder')}
            className="h-11 w-30 rounded-md"
            contentProps={{ className: 'px-2 gap-2' }}
            token={actionData.token}
            disabled={isRecipientDisabled}
            isLoading={isBalanceLoading}
            onPress={handleOpenTokenSelectionModal}
          />
        </ActionStep>

        <TwSeparator containerClassName="px-1" />

        <ActionStep
          title={t('form.address.label')}
          error={!!addressError}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <TwInput
            aria-label={t('form.address.label')}
            placeholder={t('form.address.placeholder')}
            value={actionData.address}
            pastable
            disabled={isRecipientDisabled}
            className="whitespace-nowrap"
            containerProps={{ className: 'w-[62%]' }}
            inputContainerProps={{ className: 'h-11 px-1 rounded-md gap-1' }}
            onChangeText={handleChangeAddress}
          />
        </ActionStep>

        <TwSeparator containerClassName="px-1" />

        <ActionStep
          title={t('form.amount.label')}
          error={!!amountError}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
        >
          <ActionInput
            ref={amountTextInputRef}
            placeholder={t('form.amount.placeholder')}
            className="ml-auto mr-0 w-30 whitespace-nowrap rounded-md bg-gray-800"
            value={actionData.amount}
            disabled={isAmountDisabled}
            editable={!isAmountDisabled}
            error={!!amountError}
            onChangeText={handleChangeAmount}
          />
        </ActionStep>

        <View className="flex-row justify-between pb-3 pl-9 pr-3">
          <Text className="font-sans-italic text-sm text-gray-200">
            {t('form.fiat.label', { currencyLabel: currency.label })}
          </Text>
          <Text className="font-sans-italic text-sm text-gray-200">
            {CurrencyHelper.format(
              NumberHelper.number(actionData.amount) * NumberHelper.number(tokenBalance?.exchangeConvertedPrice),
              { currency }
            )}
          </Text>
        </View>
      </View>

      {isServiceCalculableFee && (
        <ActionFeeStep
          title={t('form.totalFee.label')}
          feePlaceholder={t('form.totalFee.placeholder')}
          className="mt-3 bg-gray-300/15"
          iconClassName="w-5 h-5"
          isCalculatingFee={actionData.isFeeLoading}
          fee={actionData.fee}
          service={service}
        />
      )}

      {errorMessage && <TwAlertErrorBanner className="mt-3 gap-3 px-3" message={errorMessage} />}

      <TwButton
        className="mx-4 my-10"
        variant="contained-light"
        label={t('form.submit')}
        isLoading={actionState.isActing}
        disabled={isDisabled}
        leftElement={<TbStepOut aria-hidden className="text-neon" />}
        onPress={handleAct(handleSubmit)}
      />
    </TwModalLayout>
  )
}
