import { useNavigation } from '@react-navigation/native'
import * as ExpoNotifications from 'expo-notifications'
import { Platform } from 'react-native'

import { useMount } from '@/hooks/useMount'

ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

async function requestPermissions() {
  if (Platform.OS === 'android') {
    await ExpoNotifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: ExpoNotifications.AndroidImportance.MAX,
    })
  }

  const { status } = await ExpoNotifications.getPermissionsAsync()

  if (status !== 'granted') {
    await ExpoNotifications.requestPermissionsAsync()
  }
}

const NotificationManagerSetup = () => {
  const navigation = useNavigation()

  useMount(() => {
    requestPermissions()

    const notificationResponseReceivedSubscription = ExpoNotifications.addNotificationResponseReceivedListener(
      event => {
        // Some devices throw an invalid notification when hardware wallet is connected
        if (event.notification.date === 0) return

        navigation.navigate('TabStack', {
          screen: 'MoreStack',
          params: {
            screen: 'NotificationsScreen',
          },
        })
      }
    )

    return () => {
      notificationResponseReceivedSubscription.remove()
    }
  })

  return null
}

export default NotificationManagerSetup
