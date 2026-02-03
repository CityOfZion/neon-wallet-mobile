import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { TabStackBar } from './TabStackBar'

import type { TTabStackParamList } from '@/types/stacks'

const TabNavigator = createBottomTabNavigator<TTabStackParamList>()

export const TabStack = () => {
  return (
    <TabNavigator.Navigator tabBar={props => <TabStackBar {...props} />} screenOptions={{ headerShown: false }}>
      <TabNavigator.Screen name="WalletsStack" getComponent={() => require('../WalletStack').WalletStack} />
      <TabNavigator.Screen
        name="DappConnectStack"
        getComponent={() => require('../DappConnectionStack').DappConnectionStack}
      />
      <TabNavigator.Screen name="SearchStack" getComponent={() => require('../SearchStack').SearchStack} />
      <TabNavigator.Screen name="MoreStack" getComponent={() => require('../MoreStack').MoreStack} />
    </TabNavigator.Navigator>
  )
}
