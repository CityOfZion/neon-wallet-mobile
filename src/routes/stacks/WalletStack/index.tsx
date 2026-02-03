import { createNativeStackNavigator } from '@react-navigation/native-stack'

import type { TWalletsStackParamList } from '@/types/stacks'

const WalletNavigator = createNativeStackNavigator<TWalletsStackParamList>()

export const WalletStack = () => {
  return (
    <WalletNavigator.Navigator screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <WalletNavigator.Screen
        name="WalletsScreen"
        getComponent={() => require('@/routes/screens/WalletsScreen').WalletsScreen}
      />
      <WalletNavigator.Screen
        name="WalletScreen"
        getComponent={() => require('@/routes/screens/WalletScreen').WalletScreen}
      />
      <WalletNavigator.Screen
        name="WalletSettingsScreen"
        getComponent={() => require('@/routes/screens/WalletSettingsScreen').WalletSettingsScreen}
      />

      <WalletNavigator.Screen
        name="AccountScreen"
        getComponent={() => require('@/routes/screens/AccountScreen').AccountScreen}
      />
      <WalletNavigator.Screen
        name="AccountSettingsScreen"
        getComponent={() => require('@/routes/screens/AccountSettingsScreen').AccountSettingsScreen}
      />
      <WalletNavigator.Screen
        name="AccountAssetsScreen"
        getComponent={() => require('@/routes/screens/AccountAssetsScreen').default}
      />
      <WalletNavigator.Screen
        name="AccountTransactionsScreen"
        getComponent={() => require('@/routes/screens/AccountTransactionsScreen').default}
      />
      <WalletNavigator.Screen
        name="AccountConnectionsScreen"
        getComponent={() => require('@/routes/screens/AccountConnectionsScreen').default}
      />
      <WalletNavigator.Screen
        name="AccountNftsScreen"
        getComponent={() => require('@/routes/screens/AccountNftsScreen').AccountNftsSScreen}
      />
      <WalletNavigator.Screen
        name="SwapScreen"
        getComponent={() => require('@/routes/screens/SwapScreen').SwapScreen}
      />
      <WalletNavigator.Screen
        name="BuyAndSellTokensScreen"
        getComponent={() => require('@/routes/screens/BuyAndSellTokensScreen').BuyAndSellTokensScreen}
      />
      <WalletNavigator.Screen
        name="VoteNeo3Screen"
        getComponent={() => require('@/routes/screens/VoteNeo3Screen').VoteNeo3Screen}
      />
      <WalletNavigator.Screen
        name="BridgeNeo3NeoXScreen"
        getComponent={() => require('@/routes/screens/BridgeNeo3NeoX').BridgeNeo3NeoXScreen}
      />
      <WalletNavigator.Screen
        name="SendScreen"
        getComponent={() => require('@/routes/screens/SendScreen').SendScreen}
      />

      <WalletNavigator.Screen
        name="ReceiveScreen"
        getComponent={() => require('@/routes/screens/ReceiveScreen').ReceiveScreen}
      />
    </WalletNavigator.Navigator>
  )
}
