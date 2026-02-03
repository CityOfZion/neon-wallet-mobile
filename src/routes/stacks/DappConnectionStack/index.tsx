import { createNativeStackNavigator } from '@react-navigation/native-stack'

import type { TDappConnectionsStackParamList } from '@/types/stacks'

const DappConnectionNavigator = createNativeStackNavigator<TDappConnectionsStackParamList>()

export const DappConnectionStack = () => {
  return (
    <DappConnectionNavigator.Navigator screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <DappConnectionNavigator.Screen
        name="DappConnectionsScreen"
        getComponent={() => require('@/routes/screens/DappConnectionsScreen').DappConnectionsScreen}
      />
    </DappConnectionNavigator.Navigator>
  )
}
