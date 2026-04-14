import React from 'react'

import type { TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import { BSNeo3Constants } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Details } from '@/components/Details'
import { Skeleton } from '@/components/Skeleton'

import { Neo3VoteConfirmationDetailsLabel } from './Neo3VoteConfirmationDetailsLabel'

import type { TAccount } from '@/types/store'

type TProps = {
  title: string
  neo3Account: TAccount
  candidate: TVoteServiceCandidate
  neoAmount: number
  isLoading?: boolean
}

export const Neo3VoteConfirmationSummary = ({ title, neo3Account, candidate, neoAmount, isLoading }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteConfirmation.summary' })

  return (
    <View className="flex w-full flex-col gap-y-3">
      <Text className="w-full font-sans-regular text-sm uppercase text-gray-100">{title}</Text>

      <Skeleton.Root loading={isLoading}>
        <Skeleton.Group>
          <Skeleton.Item className="h-[27rem] w-full" />
        </Skeleton.Group>
        <Skeleton.Content>
          <Details.Root className="bg-asphalt/50">
            <Details.Body>
              <Details.Item
                label={
                  <Neo3VoteConfirmationDetailsLabel>{t('detailsAccountNameLabel')}</Neo3VoteConfirmationDetailsLabel>
                }
              >
                {neo3Account.name}
              </Details.Item>

              <Details.ItemSeparator />

              <Details.Item
                label={
                  <Neo3VoteConfirmationDetailsLabel>{t('detailsAccountAddressLabel')}</Neo3VoteConfirmationDetailsLabel>
                }
              >
                {neo3Account.address}
              </Details.Item>

              <Details.ItemSeparator />

              <Details.Item
                label={
                  <Neo3VoteConfirmationDetailsLabel>{t('detailsCandidateLabel')}</Neo3VoteConfirmationDetailsLabel>
                }
              >
                {candidate.name}
              </Details.Item>

              <Details.ItemSeparator />

              <Details.Item
                label={<Neo3VoteConfirmationDetailsLabel>{t('detailsPubKeyLabel')}</Neo3VoteConfirmationDetailsLabel>}
              >
                {candidate.pubKey}
              </Details.Item>

              <Details.ItemSeparator />

              <Details.Item
                label={<Neo3VoteConfirmationDetailsLabel>{t('detailsVotesLabel')}</Neo3VoteConfirmationDetailsLabel>}
              >
                {neoAmount} {BSNeo3Constants.NEO_TOKEN.symbol}
              </Details.Item>
            </Details.Body>
          </Details.Root>
        </Skeleton.Content>
      </Skeleton.Root>
    </View>
  )
}
