import React from 'react'

import type { TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwDashedSeparator } from '@/components/TwDashedSeparator'

import TbEye from '@/assets/images/tb-eye.svg'

import { Neo3VoteConfirmationSummary } from './Neo3VoteConfirmationSummary'

import type { TAccount } from '@/types/store'

type TProps = {
  neo3Account: TAccount
  candidate: TVoteServiceCandidate
  neoAmount: number
  onClose(): void
}

export const Neo3VoteConfirmationSuccessContent = ({ neo3Account, candidate, neoAmount, onClose }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteConfirmationModal.successContent' })

  return (
    <View className="flex w-full flex-col gap-y-3">
      <Text className="mx-auto mt-2 w-full text-center font-sans-bold text-1xl text-white">
        {t('successDescription')}
      </Text>

      <TwDashedSeparator className="my-4" />

      <Neo3VoteConfirmationSummary
        title={t('successDetailsTitle')}
        neo3Account={neo3Account}
        candidate={candidate}
        neoAmount={neoAmount}
      />

      <TwButton
        label={t('viewTransactionButtonLabel')}
        variant="contained-light"
        className="mt-6 w-full"
        contentProps={{ className: 'px-4' }}
        leftElement={<TbEye aria-hidden />}
        onPress={onClose}
      />
    </View>
  )
}
