import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwSkeleton } from '@/components/TwSkeleton'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  neoAmount: number
  hasNeoAmount: boolean
  isLoading: boolean
}

export const VoteNeo3AvailableVotes = ({ neoAmount, hasNeoAmount, isLoading }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'voteNeo3Screen.availableVotes' })

  return (
    <View className="flex w-full flex-row items-center justify-between gap-x-2">
      <Text className="font-sans-medium text-xl text-white">{t('availableVotesLabel')}</Text>

      <TwSkeleton isLoading={isLoading} colorSchema="gray" layout={{ width: 96, height: 28 }}>
        <Text
          className={StyleHelper.mergeStyles('font-sans-medium text-xl text-gray-200', {
            'text-pink': !hasNeoAmount,
          })}
        >
          {hasNeoAmount ? neoAmount : t('noAvailableVotesLabel')}
        </Text>
      </TwSkeleton>
    </View>
  )
}
