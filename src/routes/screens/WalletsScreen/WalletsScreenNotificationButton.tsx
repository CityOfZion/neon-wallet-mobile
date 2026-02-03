import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'

import { TwIconButton } from '@/components/TwIconButton'

import { useHasNewNotificationsSelector } from '@/hooks/useNotificationSelector'

import TbBell from '@/assets/images/tb-bell.svg'

export const WalletsScreenNotificationButton = () => {
  const { hasNewNotifications } = useHasNewNotificationsSelector()
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate('TabStack', {
      screen: 'MoreStack',
      params: {
        screen: 'NotificationsScreen',
        initial: false,
      },
    })
  }
  return (
    <TwIconButton
      onPress={handlePress}
      icon={
        <View className="relative">
          <TbBell className="text-white" aria-hidden />

          {hasNewNotifications && (
            <View className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-asphalt bg-pink" />
          )}
        </View>
      }
    />
  )
}
