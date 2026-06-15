import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match } from 'ts-pattern'

import { Details } from '@/components/Details'
import { Skeleton } from '@/components/Skeleton'
import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwButton } from '@/components/TwButton'
import { TwDashedSeparator } from '@/components/TwDashedSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useBalance } from '@/hooks/useBalances'
import { useExchange } from '@/hooks/useExchanges'
import { useModalErase } from '@/hooks/useModalErase'
import {
  useNeo3VoteCalculateVoteFee,
  useNeo3VoteGetVoteDetailsByAddress,
  useNeo3VoteValidations,
} from '@/hooks/useNeo3Vote'
import { useAppDispatch } from '@/hooks/useRedux'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbCheckbox from '@/assets/images/tb-checkbox.svg'

import { Neo3VoteConfirmationDetailsLabel } from './Neo3VoteConfirmationDetailsLabel'
import { Neo3VoteConfirmationSuccessContent } from './Neo3VoteConfirmationSuccessContent'
import { Neo3VoteConfirmationSummary } from './Neo3VoteConfirmationSummary'

import { thunks } from '@/store/thunks'
import type { TRootStackScreenProps } from '@/types/stacks'

export const Neo3VoteConfirmationModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'Neo3VoteConfirmationModal'>) => {
  const { neo3Account, candidate } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteConfirmation' })
  const dispatch = useAppDispatch()
  const { authenticate } = useAuthentication()
  const { currency } = useCurrencySelector()
  const { handleErase } = useModalErase()
  const calculateVoteFeeQuery = useNeo3VoteCalculateVoteFee({ neo3Account, candidatePubKey: candidate.pubKey })
  const voteDetailsByAddressQuery = useNeo3VoteGetVoteDetailsByAddress(neo3Account.address)
  const balanceQuery = useBalance(neo3Account)
  const { wallet } = useWalletByIdSelector(neo3Account.idWallet)
  const [isSubmitting, setSubmitting] = useState(false)

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3

  const exchangeQuery = useExchange([{ blockchain: 'neo3', tokens: [service.feeToken] }])

  const fee = calculateVoteFeeQuery.data

  const { hasEnoughGasToPayFee } = useNeo3VoteValidations({ balanceQuery, gasFee: fee })

  const neoAmount = voteDetailsByAddressQuery.data?.neoBalance || 0
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

      const serviceAccount = await BlockchainServiceHelper.getServiceAccount(neo3Account)
      const transaction = await service.voteService.vote({ account: serviceAccount, candidatePubKey: candidate.pubKey })

      const notificationPrefix = 'modals:neo3VoteConfirmation.notifications'
      const notificationSuccessPrefix = `${notificationPrefix}.voteSuccessNotification`
      const notificationFailurePrefix = `${notificationPrefix}.voteFailureNotification`

      dispatch(
        thunks.waitPendingTransaction({
          pendingTransaction: transaction,
          successNotification: {
            title: `${notificationSuccessPrefix}.title`,
            previewBody: `${notificationSuccessPrefix}.previewBody`,
          },
          failureNotification: {
            title: `${notificationFailurePrefix}.title`,
            previewBody: `${notificationFailurePrefix}.previewBody`,
          },
        })
      )

      navigation.popToTop()

      await UtilsHelper.sleep(1000)

      navigation.navigate('SuccessModal', {
        title: t('title'),
        className: 'mt-2 mb-10',
        titleClassName: 'text-lg',
        content: (
          <Neo3VoteConfirmationSuccessContent
            neo3Account={neo3Account}
            candidate={candidate}
            neoAmount={neoAmount}
            onClose={handleSuccessClose}
          />
        ),
        onClose: handleSuccessClose,
      })
    } catch (error) {
      LoggerHelper.sentry(error, { where: 'Neo3VoteConfirmationModal', operation: 'submitVote' })
      ToastHelper.error({ message: AppError.wrap(error, t('messages.voteError')).message, duration: 8000 })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title className="text-lg">{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="pt-2 pb-16">
        <View className="flex w-full flex-col gap-y-3">
          <Text className="font-sans-bold text-lg text-white">{t('holderDescription')}</Text>

          <Text className="font-sans-regular text-lg text-white">{t('systemDescription')}</Text>

          <TwDashedSeparator className="my-4" />

          <Neo3VoteConfirmationSummary
            title={t('voteDetailsTitle')}
            neo3Account={neo3Account}
            candidate={candidate}
            neoAmount={neoAmount}
            isLoading={isDataLoading}
          />

          <Details.Root className="bg-asphalt/50">
            <Details.Body>
              <Details.Item
                label={<Neo3VoteConfirmationDetailsLabel>{t('detailsFeeLabel')}</Neo3VoteConfirmationDetailsLabel>}
                description={
                  <Skeleton.Root loading={isCalculateVoteFeeLoading}>
                    <Skeleton.Group>
                      <Skeleton.Item className="h-5 w-24" />
                    </Skeleton.Group>
                    <Skeleton.Content>
                      <Text className="font-sans-medium text-sm uppercase text-gray-100" accessibilityRole="text">
                        {CurrencyHelper.format(
                          exchangeQuery.convertAmount(fee || 0, service.feeToken.hash, service.name),
                          { currency, maximumFractionDigits: 3, showZero: false }
                        )}
                      </Text>
                    </Skeleton.Content>
                  </Skeleton.Root>
                }
              >
                <View className="flex-row items-center">
                  <TwBlockchainIcon
                    blockchain={neo3Account.blockchain}
                    className="mr-2 mt-0.5 size-3.5 text-gray-300"
                  />
                  <Text className="font-sans-regular text-base text-white">{service.feeToken.name}</Text>
                </View>

                <Skeleton.Root loading={isCalculateVoteFeeLoading}>
                  <Skeleton.Group>
                    <Skeleton.Item className="h-5 w-30" />
                  </Skeleton.Group>
                  <Skeleton.Content>
                    <Text className="font-sans-medium text-base text-white">{fee}</Text>
                  </Skeleton.Content>
                </Skeleton.Root>
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
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
