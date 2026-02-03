import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import TbList from '@/assets/images/tb-list.svg'

export const VoteNeo3ListNotFound = () => {
  const { t } = useTranslation('screens', { keyPrefix: 'voteNeo3Screen.listNotFound' })

  return (
    <View className="mt-2 flex flex-col items-center gap-y-2 px-4">
      <TbList aria-hidden className="mb-1 h-16 w-16 text-neon" />
      <Text className="text-center font-sans-bold text-1xl text-white">{t('title')}</Text>
      <Text className="text-center font-sans-regular text-sm text-gray-300">{t('text')}</Text>
    </View>
  )
}
