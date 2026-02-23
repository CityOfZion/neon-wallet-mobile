import React, { useState } from 'react'

import type { BSNeo3 } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match } from 'ts-pattern'

import { Details } from '@/components/Details'
import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwButton } from '@/components/TwButton'
import { TwDashedSeparator } from '@/components/TwDashedSeparator'
import { TwSkeleton } from '@/components/TwSkeleton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { TransactionHelper } from '@/helpers/TransactionHelper'
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

import { VoteNeo3ConfirmationDetailsLabel } from './VoteNeo3ConfirmationDetailsLabel'
import { VoteNeo3ConfirmationSuccessContent } from './VoteNeo3ConfirmationSuccessContent'
import { VoteNeo3ConfirmationSummary } from './VoteNeo3ConfirmationSummary'

import { thunks } from '@/store/thunks'
import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'

export const VoteNeo3ConfirmationModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'VoteNeo3ConfirmationModal'>) => {
  const { neo3Account, candidate } = route.params

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

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3<TBlockchainServiceKey>

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

      const account = await BlockchainServiceHelper.getServiceAccount({ account: neo3Account, key })

      const txId = await service.voteService.vote({ account, candidatePubKey: candidate.pubKey })

      const transaction = TransactionHelper.buildPendingTransaction({ txId, fromAccount: neo3Account, type: 'vote' })

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
          <Details.Root className="bg-asphalt/50">
            <Details.Body>
              <Details.Item
                label={<VoteNeo3ConfirmationDetailsLabel>{t('detailsFeeLabel')}</VoteNeo3ConfirmationDetailsLabel>}
                description={CurrencyHelper.format(
                  exchangeQuery.convertAmount(fee ?? 0, service.feeToken.hash, service.name),
                  { currency, maximumFractionDigits: 3, showZero: false }
                )}
              >
                <View className="flex-row items-center">
                  <TwBlockchainIcon blockchain={neo3Account.blockchain} type="gray" className="mr-2 mt-0.5 size-3.5" />
                  <Text className="font-sans-regular text-base text-white">{service.feeToken.name}</Text>
                </View>

                <Text className="font-sans-medium text-base text-white">{fee}</Text>
              </Details.Item>
            </Details.Body>
          </Details.Root>

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
