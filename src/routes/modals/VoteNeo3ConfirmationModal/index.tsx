import React, { useMemo, useState } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import { BSNeo3Constants } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match } from 'ts-pattern'

import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwButton } from '@/components/TwButton'
import { TwDashedSeparator } from '@/components/TwDashedSeparator'
import { TwDetailsCard } from '@/components/TwDetailsCard'
import { TwSkeleton } from '@/components/TwSkeleton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useBalance } from '@/hooks/useBalances'
import { useExchange } from '@/hooks/useExchanges'
import { useModalErase } from '@/hooks/useModalErase'
import { useAppDispatch } from '@/hooks/useRedux'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'
import {
  useVoteNeo3CalculateVoteFee,
  useVoteNeo3GetVoteDetailsByAddress,
  useVoteNeo3Validations,
} from '@/hooks/useVoteNeo3'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCheckbox from '@/assets/images/tb-checkbox.svg'

import { VoteNeo3ConfirmationSuccessContent } from './VoteNeo3ConfirmationSuccessContent'
import { VoteNeo3ConfirmationSummary } from './VoteNeo3ConfirmationSummary'

import { thunks } from '@/store/thunks'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TTransaction } from '@/types/store'

export const VoteNeo3ConfirmationModal = ({
  navigation,
  route: {
    params: { neo3Account, candidate },
  },
}: TRootStackScreenProps<'VoteNeo3ConfirmationModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'voteNeo3ConfirmationModal' })
  const dispatch = useAppDispatch()
  const { authenticate } = useAuthentication()
  const { currency } = useCurrencySelector()
  const { handleErase } = useModalErase()
  const calculateVoteFeeQuery = useVoteNeo3CalculateVoteFee({ neo3Account, candidatePubKey: candidate.pubKey })
  const voteDetailsByAddressQuery = useVoteNeo3GetVoteDetailsByAddress(neo3Account.address)
  const balanceQuery = useBalance(neo3Account)
  const { wallet } = useWalletByIdSelector(neo3Account.idWallet)
  const [isSubmitting, setSubmitting] = useState(false)

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  const exchangeQuery = useExchange([{ blockchain: 'neo3', tokens: [service.feeToken] }])

  const fee = calculateVoteFeeQuery.data

  const { hasEnoughGasToPayFee } = useVoteNeo3Validations({ balanceQuery, gasFee: fee })

  const neoAmount = voteDetailsByAddressQuery.data?.neoBalance ?? 0
  const hasNeoAmount = neoAmount > 0
  const isWatchAccount = neo3Account.type === 'watch'
  const isDataLoading = voteDetailsByAddressQuery.isLoading || balanceQuery.isLoading || exchangeQuery.isLoading
  const isCalculateVoteFeeLoading = calculateVoteFeeQuery.isLoading

  const isDisabled =
    isCalculateVoteFeeLoading ||
    isDataLoading ||
    isSubmitting ||
    !fee ||
    isWatchAccount ||
    voteDetailsByAddressQuery.data?.candidatePubKey === candidate.pubKey ||
    !hasNeoAmount ||
    !hasEnoughGasToPayFee

  const voteErrorMessage = match({ hasNeoAmount, isWatchAccount, hasEnoughGasToPayFee })
    .with({ hasNeoAmount: false }, () => t('voteErrorMessages.noNeoLabel'))
    .with({ isWatchAccount: true }, () => t('voteErrorMessages.watchAccountLabel'))
    .with({ hasEnoughGasToPayFee: false }, () => t('voteErrorMessages.canNotPayGasFeeLabel'))
    .otherwise(() => undefined)

  const feeFiatPrice = useMemo(() => {
    let fiatBn = BSBigNumberHelper.fromNumber(0)

    if (exchangeQuery.data && fee) {
      const feeBn = BSBigNumberHelper.fromNumber(fee)

      fiatBn = feeBn.multipliedBy(
        ExchangeHelper.getExchangeConvertedPrice(service.feeToken.hash, 'neo3', exchangeQuery.data)
      )
    }

    return CurrencyHelper.format(fiatBn.toNumber(), { currency, maximumFractionDigits: 3 })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeQuery.data, fee, currency.label])

  const handleSuccessClose = async () => {
    handleErase()

    await UtilsHelper.sleep(500)

    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'WalletsScreen',
        params: { wallet },
      },
    })

    await UtilsHelper.sleep(500)

    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'AccountScreen',
        params: { account: neo3Account, wallet },
      },
    })

    await UtilsHelper.sleep(500)

    navigation.navigate('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'AccountTransactionsScreen',
        params: { account: neo3Account },
      },
    })
  }

  const handleSubmit = async () => {
    try {
      if (isDisabled) return

      setSubmitting(true)

      await authenticate(neo3Account)

      const key = await SecureStoreHelper.getKey(neo3Account)

      if (!key) {
        ToastHelper.error({ message: t('messages.invalidKey'), duration: 8000 })

        return
      }

      const account = BlockchainServiceHelper.getServiceAccount({ account: neo3Account, key })

      const transactionHash = await service.voteService.vote({ account, candidatePubKey: candidate.pubKey })

      const transaction: TTransaction = {
        account: neo3Account,
        hash: transactionHash,
        block: 0,
        time: DateHelper.getNowUnix(),
        notifications: [],
        fee,
        type: 'default',
        transfers: [
          {
            amount: '0',
            type: 'token',
            contractHash: BSNeo3Constants.NEO_TOKEN.hash,
            from: 'Mint',
            to: neo3Account.address,
            token: BSNeo3Constants.NEO_TOKEN,
          },
        ],
      }

      dispatch(
        thunks.waitTransaction({
          transaction,
          successNotification: {
            title: 'modals:voteNeo3ConfirmationModal.notifications.voteSuccessNotification.title',
            previewBody: 'modals:voteNeo3ConfirmationModal.notifications.voteSuccessNotification.previewBody',
          },
          failureNotification: {
            title: 'modals:voteNeo3ConfirmationModal.notifications.voteFailureNotification.title',
            previewBody: 'modals:voteNeo3ConfirmationModal.notifications.voteFailureNotification.previewBody',
          },
        })
      )

      navigation.popToTop()
      await UtilsHelper.sleep(500)

      navigation.navigate('SuccessModal', {
        title: t('title'),
        className: 'mt-2 mb-10',
        titleClassName: 'text-lg',
        content: (
          <VoteNeo3ConfirmationSuccessContent
            neo3Account={neo3Account}
            candidate={candidate}
            neoAmount={neoAmount}
            onClose={handleSuccessClose}
          />
        ),
        onClose: handleSuccessClose,
      })
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'VoteNeo3ConfirmationModal', operation: 'submitVote' })
      ToastHelper.error({ message: AppError.wrap(error, t('messages.voteError')).message, duration: 8000 })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <TwModalLayout
      title={t('title')}
      titleClassName="text-lg"
      contentContainerClassName="pt-2 pb-16"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <View className="flex w-full flex-col gap-y-3">
        <Text className="font-sans-bold text-lg text-white">{t('holderDescription')}</Text>

        <Text className="font-sans-regular text-lg text-white">{t('systemDescription')}</Text>

        <TwDashedSeparator className="my-4" />

        <VoteNeo3ConfirmationSummary
          title={t('voteDetailsTitle')}
          neo3Account={neo3Account}
          candidate={candidate}
          neoAmount={neoAmount}
          isLoading={isDataLoading}
        />

        <TwSkeleton isLoading={isCalculateVoteFeeLoading} layout={{ width: '100%', height: 68 }}>
          <TwDetailsCard.Root className="bg-asphalt/50 p-4">
            <TwDetailsCard.Row>
              <TwDetailsCard.Item
                className="flex-row justify-between gap-x-3"
                labelClassName="text-blue text-lg font-sans-regular"
                label={t('detailsFeeLabel')}
                value={
                  <View className="flex flex-col items-end gap-y-0.5">
                    <Text className="font-sans-regular text-lg text-white">
                      {fee || '0'} {service.feeToken.symbol}
                    </Text>
                    <Text className="font-sans-regular text-lg text-gray-100">{feeFiatPrice}</Text>
                  </View>
                }
              />
            </TwDetailsCard.Row>
          </TwDetailsCard.Root>

          {!!voteErrorMessage && (
            <TwAlertErrorBanner
              className="w-full gap-x-3 px-4"
              iconClassName="text-pink"
              messageClassName="text-lg font-sans-regular"
              message={voteErrorMessage}
            />
          )}
        </TwSkeleton>

        <TwButton
          label={t('castVoteButtonLabel')}
          variant="contained-light"
          className="mt-6 w-full"
          disabled={isDisabled}
          isLoading={isSubmitting}
          contentProps={{ className: 'px-4' }}
          leftElement={<TbCheckbox aria-hidden />}
          onPress={handleSubmit}
        />
      </View>
    </TwModalLayout>
  )
}
