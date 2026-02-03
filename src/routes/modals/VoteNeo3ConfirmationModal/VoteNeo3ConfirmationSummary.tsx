import React from 'react'

import type { TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import { BSNeo3Constants } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwDetailsCard } from '@/components/TwDetailsCard'
import { TwSeparator } from '@/components/TwSeparator'
import { TwSkeleton } from '@/components/TwSkeleton'

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
        <TwDetailsCard.Root className="gap-y-3 bg-asphalt/50 p-4">
          <TwDetailsCard.Row>
            <TwDetailsCard.Item
              label={t('detailsAccountNameLabel')}
              labelClassName="text-blue text-lg font-sans-regular"
              value={neo3Account.name}
              valueProps={{ className: 'text-lg font-sans-regular' }}
            />
          </TwDetailsCard.Row>

          <TwSeparator containerClassName="mt-1" />

          <TwDetailsCard.Row>
            <TwDetailsCard.Item
              label={t('detailsAccountAddressLabel')}
              labelClassName="text-blue text-lg font-sans-regular"
              value={neo3Account.address}
              valueProps={{ className: 'text-lg font-sans-regular' }}
            />
          </TwDetailsCard.Row>

          <TwSeparator containerClassName="mt-1" />

          <TwDetailsCard.Row>
            <TwDetailsCard.Item
              label={t('detailsCandidateLabel')}
              labelClassName="text-blue text-lg font-sans-regular"
              value={candidate.name}
              valueProps={{ className: 'text-lg font-sans-regular' }}
            />
          </TwDetailsCard.Row>

          <TwSeparator containerClassName="mt-1" />

          <TwDetailsCard.Row>
            <TwDetailsCard.Item
              label={t('detailsPubKeyLabel')}
              labelClassName="text-blue text-lg font-sans-regular"
              value={candidate.pubKey}
              valueProps={{ className: 'text-lg font-sans-regular' }}
            />
          </TwDetailsCard.Row>

          <TwSeparator containerClassName="mt-1" />

          <TwDetailsCard.Row>
            <TwDetailsCard.Item
              label={t('detailsVotesLabel')}
              labelClassName="text-blue text-lg font-sans-regular"
              value={`${neoAmount} ${BSNeo3Constants.NEO_TOKEN.symbol}`}
              valueProps={{ className: 'text-lg font-sans-regular' }}
            />
          </TwDetailsCard.Row>
        </TwDetailsCard.Root>
      </TwSkeleton>
    </View>
  )
}
