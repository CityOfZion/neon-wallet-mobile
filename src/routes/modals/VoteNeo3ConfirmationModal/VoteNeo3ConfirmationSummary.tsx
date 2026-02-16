import React from 'react'

import type { TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import { BSNeo3Constants } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Details } from '@/components/Details'
import { TwSkeleton } from '@/components/TwSkeleton'

import { VoteNeo3ConfirmationDetailsLabel } from './VoteNeo3ConfirmationDetailsLabel'

import type { IAccountState } from '@/types/store'

type TProps = {
  title: string
  neo3Account: IAccountState
  candidate: TVoteServiceCandidate
  neoAmount: number
  isLoading?: boolean
}

export const VoteNeo3ConfirmationSummary = ({ title, neo3Account, candidate, neoAmount, isLoading }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'voteNeo3ConfirmationModal.summary' })

  return (
    <View className="flex w-full flex-col gap-y-3">
      <Text className="w-full font-sans-regular text-sm uppercase text-gray-100">{title}</Text>

      <TwSkeleton isLoading={isLoading} layout={{ width: '100%', height: 386 }}>
        <Details.Root className="bg-asphalt/50">
          <Details.Body>
            <Details.Item
              label={
                <VoteNeo3ConfirmationDetailsLabel>{t('detailsAccountNameLabel')}</VoteNeo3ConfirmationDetailsLabel>
              }
            >
              {neo3Account.name}
            </Details.Item>

            <Details.ItemSeparator />

            <Details.Item
              label={
                <VoteNeo3ConfirmationDetailsLabel>{t('detailsAccountAddressLabel')}</VoteNeo3ConfirmationDetailsLabel>
              }
            >
              {neo3Account.address}
            </Details.Item>

            <Details.ItemSeparator />

            <Details.Item
              label={<VoteNeo3ConfirmationDetailsLabel>{t('detailsCandidateLabel')}</VoteNeo3ConfirmationDetailsLabel>}
            >
              {candidate.name}
            </Details.Item>

            <Details.ItemSeparator />

            <Details.Item
              label={<VoteNeo3ConfirmationDetailsLabel>{t('detailsPubKeyLabel')}</VoteNeo3ConfirmationDetailsLabel>}
            >
              {candidate.pubKey}
            </Details.Item>

            <Details.ItemSeparator />

            <Details.Item
              label={<VoteNeo3ConfirmationDetailsLabel>{t('detailsVotesLabel')}</VoteNeo3ConfirmationDetailsLabel>}
            >
              {`${neoAmount} ${BSNeo3Constants.NEO_TOKEN.symbol}`}
            </Details.Item>
          </Details.Body>
        </Details.Root>
      </TwSkeleton>
    </View>
  )
}
