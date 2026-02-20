import { useEffect, useMemo, useRef } from 'react'

import type { TIntentTransferParam } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper, isCalculableFee } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ActionAddressButton } from '@/components/ActionAddressButton'
import { ActionCard } from '@/components/ActionCard'
import { ActionFeeStep } from '@/components/ActionFeeStep'
import { ActionStep } from '@/components/ActionStep'
import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwButton } from '@/components/TwButton'
import { TwStepSeparator } from '@/components/TwStepSeparator'

import { AccountHelper } from '@/helpers/AccountHelper'
import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { TransactionHelper } from '@/helpers/TransactionHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useAccountMapSelector } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useBalance } from '@/hooks/useBalances'
import { useExchange } from '@/hooks/useExchanges'
import { useAppDispatch } from '@/hooks/useRedux'
import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import TbPlus from '@/assets/images/tb-plus.svg'
import TbStepOut from '@/assets/images/tb-step-out.svg'

import { SendRecipient, type TSendRecipient } from './SendRecipient'
import { SendSuccessContent } from './SendSuccessContent'
import { SendTipCheckbox } from './SendTipCheckbox'

import { thunks } from '@/store/thunks'
import type { TRootStackScreenProps, TWalletsStackScreenProps } from '@/types/stacks'
import type { IAccountState, TUseTransactionsTransaction } from '@/types/store'

type TActionsData = {
  selectedAccount?: IAccountState
  recipients: TSendRecipient[]
  fee?: string
  isCalculatingFee: boolean
  isLoadingMaxAmount?: boolean
  maxAmountRecipientId?: string
  isTipChecked: boolean
  isTipDisabled: boolean
  tipAmountBn?: BigNumber
  tipFiatPriceBn?: BigNumber
  tipError?: string
}

export const SendScreen = ({ navigation, route }: TWalletsStackScreenProps<'SendScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'sendScreen' })
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { authenticate } = useAuthentication()
  const { accountsMapRef } = useAccountMapSelector()
  const dispatch = useAppDispatch()

  const currentRecipientAddress = useRef(undefined)
  const isDisabledMaxAmountRef = useRef(false)

  const { actionData, actionState, setData, setError, clearErrors, handleAct, reset, setDataWrapper } =
    useActions<TActionsData>({
      selectedAccount: route.params?.account ?? undefined,
      recipients: [],
      isCalculatingFee: false,
      fee: undefined,
      isTipChecked: false,
      isTipDisabled: true,
    })

  const service = useMemo(
    () =>
      actionData.selectedAccount
        ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[actionData.selectedAccount.blockchain]
        : undefined,
    [actionData.selectedAccount]
  )

  const tipConfig = useMemo(
    () => (service ? ConstantsHelper.tipConfigByBlockchain.get(service.name) : undefined),
    [service]
  )

  const balanceQuery = useBalance(actionData.selectedAccount)

  const exchangeQuery = useExchange(
    service && tipConfig ? [{ blockchain: service.name, tokens: [tipConfig.token] }] : []
  )

  const isAccountDisabled = !actionData.selectedAccount
  const isMultiTransfer = actionData.recipients.length > 1
  const isRestartDisabled = !actionState.hasChanged
  const isCalculatingMaxAmount = isDisabledMaxAmountRef.current || actionData.isLoadingMaxAmount
  const isCalculatingForm = isCalculatingMaxAmount || actionData.isCalculatingFee
  const isAmountsLoading = actionData.recipients.some(recipient => !!recipient.isAmountLoading)
  const isMainnetNetwork = service ? selectedNetworkByBlockchain[service.name].type === 'mainnet' : false
  const isFeeInvalid = service ? isCalculableFee(service) && (!actionData.fee || !!actionState.errors.fee) : false
  const isButtonDisabled =
    !actionState.isValid ||
    !actionData.selectedAccount ||
    !!actionState.errors.recipients ||
    !service ||
    isCalculatingForm ||
    isFeeInvalid

  const getSendFields = async () => {
    const { selectedAccount } = actionData

    if (
      !selectedAccount ||
      !service ||
      actionState.errors.recipients !== undefined ||
      !actionState.changed.recipients ||
      isAmountsLoading
    )
      return

    const intents = actionData.recipients.map<TIntentTransferParam>(recipient => ({
      amount: recipient.amount!,
      receiverAddress: recipient.address!,
      token: recipient.token!.token,
    }))

    const key = await SecureStoreHelper.getKey(selectedAccount!)
    if (!key) throw new AppError(t('messages.invalidKey'))

    const serviceAccount = BlockchainServiceHelper.getServiceAccount({ account: selectedAccount!, key })

    const { isTipChecked, isTipDisabled, tipAmountBn, tipFiatPriceBn } = actionData

    if (isTipChecked && !isTipDisabled && tipAmountBn && tipFiatPriceBn && tipConfig) {
      intents.push({
        amount: tipAmountBn.toFixed(),
        receiverAddress: tipConfig.address,
        token: tipConfig.token,
      })
    }

    const transactions: TUseTransactionsTransaction[] = []

    if (service.isMultiTransferSupported) {
      transactions.push(
        TransactionHelper.buildPendingTransaction({
          fromAccount: selectedAccount,
          txId: '',
          events: intents.map(intent => ({
            amount: intent.amount,
            toAddress: intent.receiverAddress,
            token: intent.token,
            toAccount: accountsMapRef.current.get(
              AccountHelper.buildAccountKey({
                address: intent.receiverAddress,
                blockchain: service.name,
              })
            ),
          })),
        })
      )
    } else {
      intents.forEach(intent => {
        transactions.push(
          TransactionHelper.buildPendingTransaction({
            fromAccount: selectedAccount,
            txId: '',
            events: [
              {
                amount: intent.amount,
                toAddress: intent.receiverAddress,
                token: intent.token,
                toAccount: accountsMapRef.current.get(
                  AccountHelper.buildAccountKey({
                    address: intent.receiverAddress,
                    blockchain: service.name,
                  })
                ),
              },
            ],
          })
        )
      })
    }

    return {
      service,
      serviceAccount,
      selectedAccount,
      intents,
      transactions,
    }
  }

  const handleSetRecipients = (setRecipients: (prevRecipients: TSendRecipient[]) => TSendRecipient[]) => {
    setData({ isTipChecked: false })

    let recipients: TSendRecipient[] = []

    setData(state => {
      recipients = setRecipients(state.recipients)
      return { recipients }
    })

    for (const recipient of recipients) {
      if (!recipient.token || !recipient.amount || !recipient.address) {
        if (!recipient.amount) clearErrors('selectedAccount')

        setError('recipients', '')

        return
      }

      const amountBn = BSBigNumberHelper.fromNumber(recipient.amount)

      const tokenBalance = balanceQuery.data?.tokensBalances?.find(tokenBalance =>
        service?.tokenService?.predicateByHash(recipient.token?.token?.hash ?? '', tokenBalance.token)
      )

      if (!tokenBalance || amountBn.isGreaterThan(tokenBalance.amount)) {
        setError('selectedAccount', t('messages.insufficientFunds'))

        return
      }
    }

    clearErrors(['recipients', 'selectedAccount'])
  }

  const handleSelectAccount = (account?: IAccountState) => {
    handleSetRecipients(() => [{ id: UtilsHelper.uuid(), addressInput: currentRecipientAddress.current }])
    setData({ selectedAccount: account })
  }

  const handleAddRecipient = () => {
    handleSetRecipients(prev => [...prev, { id: UtilsHelper.uuid() }])
  }

  const handleRemoveRecipient = (id: string) => {
    handleSetRecipients(prev => prev.filter(recipient => recipient.id !== id))
  }

  const handleUpdateRecipient = (id: string, newRecipient: Partial<TSendRecipient>) => {
    if (newRecipient.address) currentRecipientAddress.current = undefined

    handleSetRecipients(prev =>
      prev.map(recipient => (recipient.id === id ? { ...recipient, ...newRecipient } : recipient))
    )
  }

  const handleUpdateRecipientAmount = (id: string, amount: number, decimals?: number) => {
    const amountBn = BSBigNumberHelper.fromNumber(amount)
    if (amountBn.isLessThanOrEqualTo(0)) {
      ToastHelper.error({ message: t('messages.amountIsLessOrEqualZero') })
      return
    }

    handleUpdateRecipient(id, {
      amount: BSBigNumberHelper.format(amount, { decimals }),
    })
  }

  const initializeOrRestartService = () => {
    reset()
    handleSelectAccount()
  }

  const handleMaxAmount = async (recipient: TSendRecipient) => {
    const decimals = recipient.token?.token?.decimals
    const { selectedAccount } = actionData

    if (
      !service ||
      !actionState.changed.recipients ||
      !recipient.id ||
      !recipient.address ||
      !recipient.token ||
      isCalculatingMaxAmount
    )
      return

    if (!service.tokenService.predicateByHash(service.feeToken, recipient.token.token)) {
      handleUpdateRecipientAmount(recipient.id, recipient.token.amountNumber, decimals)

      return
    }

    if (!isCalculableFee(service)) {
      handleUpdateRecipientAmount(
        recipient.id,
        BSBigNumberHelper.fromNumber(recipient.token.amount)
          .minus(actionData.fee ?? '0')
          .toNumber(),
        decimals
      )

      return
    }

    isDisabledMaxAmountRef.current = true
    setData({ isLoadingMaxAmount: true, maxAmountRecipientId: recipient.id, isTipChecked: false })

    try {
      const intents = actionData.recipients
        .map(currentRecipient => {
          const receiverAddress = currentRecipient.address
          const token = currentRecipient.token?.token
          const amount = currentRecipient.id === recipient.id ? currentRecipient.token?.amount : currentRecipient.amount

          if (!receiverAddress || !token || !amount) return null

          return { receiverAddress, amount, token }
        })
        .filter(recipient => recipient !== null) as TIntentTransferParam[]

      const key = await SecureStoreHelper.getKey(selectedAccount!)

      if (!key || !selectedAccount) throw new AppError(t('messages.invalidKey'))

      const senderAccount = BlockchainServiceHelper.getServiceAccount({ account: selectedAccount, key })

      const fee = await service.calculateTransferFee({ senderAccount, intents })

      handleUpdateRecipientAmount(
        recipient.id,
        BSBigNumberHelper.fromNumber(recipient.token.amount).minus(fee).toNumber(),
        decimals
      )
    } catch (error) {
      LoggerHelper.error(error, { where: 'SendScreen', operation: 'calculateMaxAmount' })
      ToastHelper.error({
        message: AppError.wrap(error, t('messages.calculateMaxAmount')).message,
        id: 'send-calculate-max-amount-error',
      })
    } finally {
      isDisabledMaxAmountRef.current = false
      setData({ isLoadingMaxAmount: false, maxAmountRecipientId: '' })
    }
  }

  const handleGoToConfirmStep = async () => {
    const fields = await getSendFields()

    if (!fields || isCalculatingForm || actionState.isActing || isFeeInvalid) return

    navigation.navigate('SendConfirmModal', {
      transactions: fields.transactions,
      fee: actionData.fee,
      service: service!,
      onConfirm: handleConfirm,
    })
  }

  const handleConfirm = async (modalNavigation: TRootStackScreenProps<'SendConfirmModal'>['navigation']) => {
    try {
      const fields = await getSendFields()

      if (!fields || isCalculatingForm || actionState.isActing || isFeeInvalid) return

      await authenticate(fields.selectedAccount)

      const transactionHashes = await fields.service.transfer({
        senderAccount: fields.serviceAccount,
        intents: fields.intents,
      })

      fields.transactions.forEach((transaction, index) => {
        transaction.txId = transactionHashes[index] ?? ''
      })

      fields.transactions.forEach(transaction => {
        dispatch(
          thunks.waitTransaction({
            transaction,
            failureNotification: {
              title: 'screens:sendScreen.failureNotification.title',
              previewBody: 'screens:sendScreen.failureNotification.previewBody',
            },
            successNotification: {
              title: 'screens:sendScreen.successNotification.title',
              previewBody: 'screens:sendScreen.successNotification.previewBody',
            },
          })
        )
      })

      AnalyticsHelper.logEvent('transaction_executed')

      currentRecipientAddress.current = undefined
      handleSelectAccount()

      initializeOrRestartService()

      modalNavigation.replace('SuccessModal', {
        title: t('form.sendSuccessContentTitle'),
        content: (
          <SendSuccessContent
            transactions={fields.transactions}
            fee={actionData.fee}
            selectedAccount={actionData.selectedAccount!}
            navigation={navigation}
          />
        ),
        onClose: () => modalNavigation.replace('SurveyModal'),
      })
    } catch (error: any) {
      LoggerHelper.sentry(error, { where: 'SendScreen', operation: 'processSend' })
      ToastHelper.error({ message: AppError.wrap(error, t('messages.sendError')).message })
    }
  }

  useEffect(() => {
    if (balanceQuery.isLoading || isAmountsLoading) return

    const handleCalculateFee = async () => {
      try {
        const fields = await getSendFields()

        if (!fields || !isCalculableFee(fields.service) || fields.intents.length === 0) {
          setData({ fee: undefined })
          return
        }

        setData({ isCalculatingFee: true })

        const fee = await fields.service.calculateTransferFee({
          senderAccount: fields.serviceAccount,
          intents: fields.intents,
        })

        setData({ fee })

        let totalFeeAmountBn = BSBigNumberHelper.fromNumber(fee)

        fields.intents.forEach(intent => {
          if (!fields.service.tokenService.predicateByHash(fields.service.feeToken, intent.token.hash)) return
          totalFeeAmountBn = totalFeeAmountBn.plus(intent.amount)
        })

        const feeBalance =
          balanceQuery.data?.tokensBalances?.find(({ token }) =>
            fields.service.tokenService.predicateByHash(fields.service.feeToken, token)
          )?.amount ?? '0'
        if (totalFeeAmountBn.isGreaterThan(feeBalance)) {
          setError('fee', t('messages.insufficientFunds'))
        } else {
          clearErrors('fee')
        }
      } catch (error) {
        LoggerHelper.error(error, { where: 'SendScreen', operation: 'calculateFee' })
        const appError = AppError.wrap(error, t('messages.feeError'))

        ToastHelper.error({ message: appError.message, id: 'send-calculate-fee-error' })

        setError('fee', appError.message)
        setData({ fee: undefined })
      } finally {
        setData({ isCalculatingFee: false })
      }
    }

    handleCalculateFee()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceQuery.data, actionData.recipients, actionData.isTipChecked])

  useEffect(() => {
    if (!service || !isMainnetNetwork || !tipConfig) {
      setData({
        isTipChecked: false,
        isTipDisabled: true,
        tipAmountBn: undefined,
        tipFiatPriceBn: undefined,
        tipError: undefined,
      })

      return
    }

    if (exchangeQuery.isLoading || isAmountsLoading || isCalculatingForm || actionState.isActing) {
      setData({ isTipDisabled: true, tipError: undefined })

      return
    }

    let totalFiatPricesBn = BSBigNumberHelper.fromNumber('0')
    let totalAmountsBn = BSBigNumberHelper.fromNumber(
      actionData.fee && service.tokenService.predicateByHash(service.feeToken, tipConfig.token) ? actionData.fee : '0'
    )

    actionData.recipients.forEach(recipient => {
      const amount = recipient.amount
      const tokenBalance = recipient.token
      const token = tokenBalance?.token

      if (!amount || !token) return

      const amountBn = BSBigNumberHelper.fromNumber(BSBigNumberHelper.format(amount, { decimals: token.decimals }))

      totalFiatPricesBn = totalFiatPricesBn.plus(amountBn.multipliedBy(tokenBalance.exchangeConvertedPrice))

      if (service.tokenService.predicateByHash(token, tipConfig.token)) {
        totalAmountsBn = totalAmountsBn.plus(amountBn)
      }
    })

    const isTipDisabled = isFeeInvalid || !actionState.isValid || !!actionState.errors.recipients

    if (totalFiatPricesBn.isLessThanOrEqualTo('0')) {
      setData({
        isTipChecked: false,
        isTipDisabled,
        tipAmountBn: undefined,
        tipFiatPriceBn: undefined,
        tipError: t('messages.noFiatPriceToTip'),
      })

      return
    }

    const tipTokenBalance = balanceQuery.data?.tokensBalances?.find(tokenBalance =>
      service.tokenService.predicateByHash(tokenBalance.token, tipConfig.token)
    )

    if (!tipTokenBalance) {
      setData({
        isTipChecked: false,
        isTipDisabled,
        tipAmountBn: undefined,
        tipFiatPriceBn: undefined,
        tipError: t('messages.noTokenToTip'),
      })

      return
    }

    const tokenFiatPrice = ExchangeHelper.getExchangeConvertedPrice(
      tipConfig.token.hash,
      service.name,
      exchangeQuery.data
    )

    let tipFiatPriceBn = totalFiatPricesBn.multipliedBy(ConstantsHelper.tipPercentageBn)
    let tipAmountBn = tipFiatPriceBn.div(tokenFiatPrice)

    if (tipAmountBn.isLessThan(tipConfig.minBn)) {
      tipFiatPriceBn = tipConfig.minBn.multipliedBy(tokenFiatPrice)
      tipAmountBn = tipConfig.minBn
    }

    totalAmountsBn = totalAmountsBn.plus(tipAmountBn)

    if (totalAmountsBn.isGreaterThan(tipTokenBalance.amount)) {
      setData({
        isTipChecked: false,
        isTipDisabled,
        tipAmountBn,
        tipFiatPriceBn,
        tipError: t('messages.noAmountToTip'),
      })

      return
    }

    setData({ isTipDisabled, tipAmountBn, tipFiatPriceBn, tipError: undefined })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionData.fee,
    actionData.recipients,
    actionState.errors.recipients,
    actionState.isActing,
    actionState.isValid,
    balanceQuery.data?.tokensBalances,
    exchangeQuery.data,
    exchangeQuery.isLoading,
    isAmountsLoading,
    isCalculatingForm,
    isFeeInvalid,
    isMainnetNetwork,
    service,
    tipConfig,
  ])

  useEffect(() => {
    handleSelectAccount(route.params?.account)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.account])

  return (
    <TwScreenLayout
      title={t('title')}
      contentContainerClassName="pt-0"
      headerClassName="h-12 mb-8"
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
        <ActionStep title={t('form.sourceAccountLabel')} leftElement={<TbStepOut aria-hidden className="text-blue" />}>
          <ActionAddressButton
            label={t('form.recipient.selectButtonLabel')}
            address={actionData.selectedAccount?.address}
            blockchain={actionData.selectedAccount?.blockchain}
            onPress={() =>
              navigation.navigate('AccountSelectionModal', {
                title: t('form.accountToUseModalTitle'),
                onSelect: handleSelectAccount,
              })
            }
          />
        </ActionStep>
      </ActionCard>

      <TwStepSeparator />

      <View className="mb-2 flex flex-col gap-4">
        {actionData.recipients.map((recipient, index) => (
          <SendRecipient
            key={recipient.id}
            order={index + 1}
            recipient={recipient}
            onRemoveRecipient={() => handleRemoveRecipient(recipient.id)}
            onUpdateRecipient={updatedRecipient => handleUpdateRecipient(recipient.id, updatedRecipient)}
            selectedAccount={actionData.selectedAccount}
            removable={isMultiTransfer}
            balance={balanceQuery}
            isLoadingMaxAmount={actionData.maxAmountRecipientId === recipient.id}
            isDisabledMaxAmount={isCalculatingForm}
            onMaxAmount={handleMaxAmount}
          />
        ))}
      </View>

      {(actionState.errors.fee || actionState.errors.selectedAccount) && (
        <TwAlertErrorBanner className="my-2" message={actionState.errors.fee || actionState.errors.selectedAccount} />
      )}

      <TwButton
        leftElement={<TbPlus aria-hidden />}
        label={t('form.addRecipientButtonLabel')}
        variant="text"
        iconsOnEdge={false}
        disabled={isAccountDisabled}
        colorSchema={isAccountDisabled ? 'white' : 'neon'}
        className="mx-auto my-2 w-64"
        onPress={handleAddRecipient}
      />

      <ActionFeeStep
        title={t('form.totalFeeLabel')}
        feePlaceholder={t('form.totalFeePlaceholder')}
        fee={actionData.fee ?? undefined}
        isCalculatingFee={actionData.isCalculatingFee}
        service={service}
        className="mb-4"
      />

      {!!tipConfig && actionData.tipAmountBn && actionData.tipFiatPriceBn && (
        <SendTipCheckbox
          amountBn={actionData.tipAmountBn}
          tokenSymbol={tipConfig.token}
          isChecked={actionData.isTipChecked}
          onCheckChange={setDataWrapper('isTipChecked')}
          isDisabled={actionData.isTipDisabled}
          isLoading={exchangeQuery.isLoading}
          fiatPriceBn={actionData.tipFiatPriceBn}
          className="mb-8"
        />
      )}

      <TwButton
        label={t('form.sendTokensButtonLabel')}
        className="mb-4 mt-auto"
        variant="card"
        disabled={isButtonDisabled}
        leftElement={<TbStepOut aria-hidden className="text-neon" />}
        onPress={handleAct(handleGoToConfirmStep)}
        isLoading={actionState.isActing}
      />
    </TwScreenLayout>
  )
}
