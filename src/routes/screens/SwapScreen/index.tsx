import React, { useMemo, useState, useSyncExternalStore } from 'react'

import type { BSError } from '@cityofzion/blockchain-service'
import { hasMemo, isCalculableFee } from '@cityofzion/blockchain-service'
import { SwapOrchestrator, type TSwapToken } from '@cityofzion/bs-multichain'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { match } from 'ts-pattern'

import { ActionFeeStep } from '@/components/ActionFeeStep'
import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwBanner } from '@/components/TwBanner'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwStepSeparator } from '@/components/TwStepSeparator'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useBalance } from '@/hooks/useBalances'
import { usePressOnce } from '@/hooks/usePressOnce'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdInfoOutline from '@/assets/images/md-info-outline.svg'
import TbReplace from '@/assets/images/tb-replace.svg'

import { SwapScreenAmountsCard } from './SwapScreenAmountsCard'
import { SwapScreenAssetsCard } from './SwapScreenAssetsCard'
import { SwapScreenExtraIdCard } from './SwapScreenExtraIdCard'
import { SwapScreenSourceCard } from './SwapScreenSourceCard'

import type { TWalletsStackScreenProps } from '@/types/stacks'

const createSwapOrchestrator = () => new SwapOrchestrator(BlockchainServiceHelper.bsAggregator)

const isNonNativeStellarToken = (token: TSwapToken) => {
  const stellarService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar

  return token.blockchain === 'stellar' && !!token.hash && !stellarService.tokenService.isNativeToken(token.hash)
}

export const SwapScreen = ({ navigation, route }: TWalletsStackScreenProps<'SwapScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'swap' })
  const { accounts } = useAccountsSelector()
  const { authenticate } = useAuthentication()
  const queryClient = useQueryClient()

  const [swapOrchestrator, setSwapOrchestrator] = useState(createSwapOrchestrator)

  const state = useSyncExternalStore(swapOrchestrator.store.subscribe, swapOrchestrator.store.getState)

  const serviceAccountToUse = state.accountToUse.value
  const tokenToUse = state.tokenToUse.value
  const tokenToReceive = state.tokenToReceive.value
  const tokenToReceiveBlockchain = tokenToReceive?.blockchain

  const tokenToReceiveService = tokenToReceiveBlockchain
    ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[tokenToReceiveBlockchain]
    : undefined

  const hasExtraIdToReceive = !!tokenToReceive && (!tokenToReceiveService || hasMemo(tokenToReceiveService))

  const accountToUse = useMemo(
    () => (serviceAccountToUse ? accounts.find(AccountHelper.predicate(serviceAccountToUse)) : undefined),
    [accounts, serviceAccountToUse]
  )

  const balanceQuery = useBalance(accountToUse)

  const service = accountToUse
    ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[accountToUse.blockchain]
    : undefined

  const tokenToUseBalance = useMemo(() => {
    const hash = tokenToUse?.hash
    if (!service || !hash) return

    return balanceQuery.data?.tokensBalances.find(({ token }) => service.tokenService.predicateByHash(hash, token))
  }, [balanceQuery.data, service, tokenToUse])

  const getErrorMessage = (error: BSError | null) => {
    if (!error) return

    return match(error.code)
      .with('AMOUNT_BELOW_ZERO', () => t('errors.amountZero'))
      .with('AMOUNT_BELOW_MINIMUM', () => t('errors.amountMin', { amount: error.metadata?.minAmount }))
      .with('AMOUNT_ABOVE_MAXIMUM', () => t('errors.amountMax', { amount: error.metadata?.maxAmount }))
      .with('AMOUNT_EXCEEDS_BALANCE', () => t('errors.insufficientFunds'))
      .with('FEE_EXCEEDS_BALANCE', 'FEE_CALCULATION_FAILED', () => t('errors.insufficientFundsFee'))
      .with('NO_QUOTES_AVAILABLE', () => t('errors.noQuotesAvailable'))
      .otherwise(() => error.message)
  }

  const isLoadingOrValidating = Object.values(state).some(
    field => ('loading' in field && field.loading) || ('validating' in field && field.validating)
  )

  const errorMessage = isLoadingOrValidating
    ? undefined
    : state.addressToReceive.valid === false
      ? t('errors.invalidAddress')
      : [
          state.accountToUse.error,
          state.availableTokensToReceive.error,
          state.amountToUse.error,
          state.quote.error,
          state.fee.error,
        ]
          .map(getErrorMessage)
          .find(Boolean)

  const handleRestart = () => {
    swapOrchestrator.cleanup()
    setSwapOrchestrator(createSwapOrchestrator())
  }

  const [isSwapping, handleSwap] = usePressOnce(async () => {
    if (!accountToUse || !swapOrchestrator.isAbleToSwap()) return

    try {
      await authenticate(accountToUse)

      const { swapId: orderId } = await swapOrchestrator.createOrder()

      // Not awaited, as executing can take a while (e.g. waiting for an approval to be confirmed) and the order can be tracked by its ID
      swapOrchestrator
        .executeOrder()
        .then(swapResult => {
          if (swapResult.status === 'failed') {
            LoggerHelper.sentry(new Error(swapResult.log), { where: 'SwapScreen', operation: 'executeOrder' })
            ToastHelper.error({ message: AppError.wrap(new Error(swapResult.log)).message })
            return
          }

          queryClient.invalidateQueries({ queryKey: ['swap-orders-by-address', swapResult.addressFrom] })
        })
        .catch(error => {
          LoggerHelper.sentry(error, { where: 'SwapScreen', operation: 'executeOrder' })
          ToastHelper.error({ message: AppError.wrap(error).message })
        })

      navigation.navigate('SwapDetailsModal', { orderId })

      handleRestart()
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'SwapScreen', operation: 'submitSwap' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  })

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header className="h-[48px]">
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
        <ScreenLayout.ButtonContent position="right">
          <TwIconButton
            aria-label={t('viewExplanationButtonLabel')}
            icon={<MdInfoOutline aria-hidden className="text-neon" />}
            size="md"
            onPress={() => navigation.navigate('SwapExplanationModal')}
          />
        </ScreenLayout.ButtonContent>
      </ScreenLayout.Header>

      <ScreenLayout.KeyboardAvoidingContent className="pt-0">
        <View className="h-10 flex-row justify-end">
          <TwButton variant="text-slim" label={t('restartButtonLabel')} disabled={isSwapping} onPress={handleRestart} />
        </View>

        <SwapScreenSourceCard
          swapOrchestrator={swapOrchestrator}
          accountToUse={accountToUse}
          initialAccount={route.params?.account}
          isLoading={state.accountToUse.validating}
          disabled={isSwapping}
        />

        <TwStepSeparator />

        <SwapScreenAssetsCard
          swapOrchestrator={swapOrchestrator}
          state={state}
          accountToUse={accountToUse}
          isLoadingBalance={!!accountToUse && balanceQuery.isLoading}
          disabled={isSwapping}
        />

        <TwStepSeparator />

        <SwapScreenAmountsCard
          swapOrchestrator={swapOrchestrator}
          state={state}
          tokenToUseBalance={tokenToUseBalance}
          disabled={isSwapping}
        />

        {hasExtraIdToReceive && (
          <SwapScreenExtraIdCard swapOrchestrator={swapOrchestrator} state={state} disabled={isSwapping} />
        )}

        {(!service || isCalculableFee(service)) && (
          <ActionFeeStep
            title={t('transactionFee')}
            feePlaceholder={t('feePlaceholder')}
            isCalculatingFee={state.fee.loading}
            fee={state.fee.value || undefined}
            service={service}
          />
        )}

        {!!tokenToUse && isNonNativeStellarToken(tokenToUse) && (
          <TwBanner
            type="warning"
            className="mt-3"
            textClassName="text-sm leading-5 py-3 px-4"
            text={t('stellarTrustlineWarnings.source', { token: tokenToUse.symbol.toUpperCase() })}
          />
        )}

        {!!tokenToReceive && isNonNativeStellarToken(tokenToReceive) && (
          <TwBanner
            type="warning"
            className="mt-3"
            textClassName="text-sm leading-5 py-3 px-4"
            text={t('stellarTrustlineWarnings.receiver', { token: tokenToReceive.symbol.toUpperCase() })}
          />
        )}

        {errorMessage && <TwAlertErrorBanner className="mt-3" message={errorMessage} />}

        <TwButton
          className="mx-4 mb-12 mt-8"
          variant="contained-light"
          label={t('buttonSubmitLabel')}
          leftElement={<TbReplace aria-hidden className="text-neon" />}
          isLoading={isSwapping}
          onPress={handleSwap}
          disabled={isSwapping || !swapOrchestrator.isAbleToSwap()}
        />
      </ScreenLayout.KeyboardAvoidingContent>
    </ScreenLayout.Root>
  )
}
