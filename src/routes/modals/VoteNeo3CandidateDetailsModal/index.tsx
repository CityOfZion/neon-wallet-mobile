import React, { Fragment } from 'react'

import { Image } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { Details } from '@/components/Details'
import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { NumberHelper } from '@/helpers/NumberHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useBalance } from '@/hooks/useBalances'
import {
  useVoteNeo3CalculateVoteFee,
  useVoteNeo3GetVoteDetailsByAddress,
  useVoteNeo3Validations,
} from '@/hooks/useVoteNeo3'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCheckbox from '@/assets/images/tb-checkbox.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const VoteNeo3CandidateDetailsModal = ({
  navigation,
  route: {
    params: { neo3Account, candidate, candidateVotePercentage },
  },
}: TRootStackScreenProps<'VoteNeo3CandidateDetailsModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'voteNeo3CandidateDetailsModal' })

  const { position, name, votes, logoUrl, pubKey, description } = candidate

  const calculateVoteFeeQuery = useVoteNeo3CalculateVoteFee({ neo3Account, candidatePubKey: pubKey })
  const voteDetailsByAddressQuery = useVoteNeo3GetVoteDetailsByAddress(neo3Account?.address)
  const balanceQuery = useBalance(neo3Account)
  const { hasEnoughGasToPayFee } = useVoteNeo3Validations({ balanceQuery, gasFee: calculateVoteFeeQuery.data })

  const neoAmount = voteDetailsByAddressQuery.data?.neoBalance || 0
  const hasNeoAmount = neoAmount > 0
  const isWatchAccount = neo3Account?.type === 'watch'
  const isCozCandidate = ConstantsHelper.voteNeo3CozPubKey === pubKey
  const isCurrentVote = voteDetailsByAddressQuery.data?.candidatePubKey === pubKey
  const isLoading = voteDetailsByAddressQuery.isLoading || calculateVoteFeeQuery.isLoading || balanceQuery.isLoading
  const isDisabled = isCurrentVote || isLoading || !hasEnoughGasToPayFee || !hasNeoAmount

  const errorMessage = match({ neo3Account, hasNeoAmount, isWatchAccount, hasEnoughGasToPayFee })
    .with({ neo3Account: P.when(value => !value) }, () => t('selectNeo3AccountTitle'))
    .with({ hasNeoAmount: false }, () => t('thereIsNoNeoTitle'))
    .with({ isWatchAccount: true }, () => t('accountCanNotBeWatchTitle'))
    .with({ hasEnoughGasToPayFee: false }, () => (
      <View className="flex w-full flex-shrink flex-col gap-y-1">
        <Text className="w-full font-sans-regular text-sm text-white">{t('insufficientGasTitle')}</Text>
        <Text className="w-full font-sans-italic text-sm text-gray-200">{t('insufficientGasDescription')}</Text>
      </View>
    ))
    .otherwise(() => undefined)

  const handleGoToVoteNeo3ConfirmationModal = async () => {
    if (isDisabled) return

    navigation.goBack()

    await UtilsHelper.sleep(500)

    navigation.navigate('VoteNeo3ConfirmationModal', { neo3Account: neo3Account!, candidate })
  }

  return (
    <TwModalLayout
      title={t('title')}
      contentContainerClassName="pt-2 pb-12"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <View className="flex flex-col gap-y-6">
        {(logoUrl || isCozCandidate) && (
          <View className="mx-auto flex h-12 w-44 min-w-44 max-w-44 items-center justify-center rounded-full bg-gray-600/50">
            <Image
              className="h-full max-h-8 w-full max-w-36"
              contentFit="contain"
              source={!logoUrl && isCozCandidate ? require('@/assets/images/logo-coz.png') : logoUrl}
              alt={name}
            />
          </View>
        )}

        <Details.Root>
          <Details.Body>
            <Details.Item label={t('positionLabel')}>{position}</Details.Item>
            <Details.ItemSeparator />
            <Details.Item label={t('nameLabel')}>{name}</Details.Item>
            <Details.ItemSeparator />
            <Details.Item label={t('pubKeyLabel')}>{pubKey}</Details.Item>
            <Details.ItemSeparator />
            <Details.Item label={t('votesLabel')}>
              {`${NumberHelper.localeNumber(votes)} (${candidateVotePercentage})`}
            </Details.Item>
          </Details.Body>
        </Details.Root>

        <View className="mx-auto flex w-[92%] flex-col gap-y-4">
          <TwButton
            variant="contained-light"
            className="w-full"
            contentProps={{ className: 'px-4' }}
            label={isCurrentVote ? t('voteAlreadyCastButtonLabel') : t('castVoteButtonLabel')}
            isLoading={isLoading}
            disabled={isDisabled}
            leftElement={isCurrentVote ? undefined : <TbCheckbox aria-hidden />}
            onPress={handleGoToVoteNeo3ConfirmationModal}
          />

          {!isLoading && !isCurrentVote && !!errorMessage && (
            <TwAlertErrorBanner
              className="w-full gap-x-3 px-4"
              iconClassName="text-pink"
              messageClassName="text-sm font-sans-regular"
              message={errorMessage}
            />
          )}
        </View>

        {!!description && (
          <Fragment>
            <TwSeparator />

            <View className="flex flex-col gap-y-2">
              <Text className="w-full font-sans-semibold text-sm uppercase text-gray-100">{t('descriptionLabel')}</Text>
              <Text className="w-full break-all font-sans-regular text-sm text-white">{description}</Text>
            </View>
          </Fragment>
        )}
      </View>
    </TwModalLayout>
  )
}
