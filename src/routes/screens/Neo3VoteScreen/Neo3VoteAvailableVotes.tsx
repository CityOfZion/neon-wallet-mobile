import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Skeleton } from '@/components/Skeleton'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  neoAmount: number
  hasNeoAmount: boolean
  isLoading: boolean
}

export const Neo3VoteAvailableVotes = ({ neoAmount, hasNeoAmount, isLoading }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'neo3Vote.availableVotes' })

  return (
    <View className="flex w-full flex-row items-center justify-between gap-x-2">
      <Text className="font-sans-medium text-xl text-white">{t('availableVotesLabel')}</Text>

      <Skeleton.Root loading={isLoading} className="h-7">
        <Skeleton.Group>
          <Skeleton.Item className="w-24" />
        </Skeleton.Group>

        <Skeleton.Content>
          <Text
            className={StyleHelper.mergeStyles('font-sans-medium text-xl text-gray-200', {
              'text-pink': !hasNeoAmount,
            })}
          >
            {hasNeoAmount ? neoAmount : t('noAvailableVotesLabel')}
          </Text>
        </Skeleton.Content>
      </Skeleton.Root>
    </View>
  )
}
