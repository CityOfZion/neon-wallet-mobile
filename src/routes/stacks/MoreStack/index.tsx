import { createNativeStackNavigator } from '@react-navigation/native-stack'

import type { TMoreStackParamList } from '@/types/stacks'

const MoreNavigator = createNativeStackNavigator<TMoreStackParamList>()

export const MoreStack = () => {
  return (
    <MoreNavigator.Navigator screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <MoreNavigator.Screen name="MoreScreen" getComponent={() => require('@/routes/screens/MoreScreen').MoreScreen} />

      <MoreNavigator.Screen
        name="CreateWalletStep1Screen"
        getComponent={() => require('@/routes/screens/CreateWalletStep1Screen').CreateWalletStep1Screen}
      />
      <MoreNavigator.Screen
        name="CreateWalletStep2Screen"
        getComponent={() => require('@/routes/screens/CreateWalletStep2Screen').CreateWalletStep2Screen}
      />
      <MoreNavigator.Screen
        name="CreateWalletStep3Screen"
        getComponent={() => require('@/routes/screens/CreateWalletStep3Screen').CreateWalletStep3Screen}
      />
      <MoreNavigator.Screen
        name="CreateWalletStep4Screen"
        getComponent={() => require('@/routes/screens/CreateWalletStep4Screen').CreateWalletStep4Screen}
      />
      <MoreNavigator.Screen
        name="CreateWalletStep5Screen"
        getComponent={() => require('@/routes/screens/CreateWalletStep5Screen').CreateWalletStep5Screen}
      />
      <MoreNavigator.Screen
        name="CreateWalletStep6Screen"
        getComponent={() => require('@/routes/screens/CreateWalletStep6Screen').CreateWalletStep6Screen}
      />

      <MoreNavigator.Screen
        name="ImportScreen"
        getComponent={() => require('@/routes/screens/ImportScreen').ImportScreen}
      />
      <MoreNavigator.Screen
        name="ImportBlockchainSelectionScreen"
        getComponent={() => require('@/routes/screens/ImportBlockchainSelectionScreen').ImportBlockchainSelectionScreen}
      />
      <MoreNavigator.Screen
        name="ImportPassphraseScreen"
        getComponent={() => require('@/routes/screens/ImportPassphraseScreen').ImportPassphraseScreen}
      />
      <MoreNavigator.Screen
        name="ImportMnemonicSelectionScreen"
        getComponent={() => require('@/routes/screens/ImportMnemonicSelectionScreen').ImportMnemonicSelectionScreen}
      />
      <MoreNavigator.Screen
        name="ImportKeySelectionScreen"
        getComponent={() => require('@/routes/screens/ImportKeySelectionScreen').ImportKeySelectionScreen}
      />
      <MoreNavigator.Screen
        name="ImportAddressSelectionScreen"
        getComponent={() => require('@/routes/screens/ImportAddressSelectionScreen').ImportAddressSelectionScreen}
      />

      <MoreNavigator.Screen
        name="SettingsScreen"
        getComponent={() => require('@/routes/screens/SettingsScreen').SettingsScreen}
      />
      <MoreNavigator.Screen
        name="SettingsProtocolsScreen"
        getComponent={() => require('@/routes/screens/SettingsProtocolsScreen').SettingsProtocolsScreen}
      />
      <MoreNavigator.Screen
        name="SettingsProtocolEditScreen"
        getComponent={() => require('@/routes/screens/SettingsProtocolEditScreen').SettingsProtocolEditScreen}
      />
      <MoreNavigator.Screen
        name="SettingsSecurityBackupScreen"
        getComponent={() => require('@/routes/screens/SettingsSecurityBackupScreen').SettingsSecurityBackupScreen}
      />
      <MoreNavigator.Screen
        name="SettingsWalletBackupStep1Screen"
        getComponent={() => require('@/routes/screens/SettingsWalletBackupStep1Screen').SettingsWalletBackupStep1Screen}
      />
      <MoreNavigator.Screen
        name="SettingsWalletBackupStep2Screen"
        getComponent={() => require('@/routes/screens/SettingsWalletBackupStep2Screen').SettingsWalletBackupStep2Screen}
      />
      <MoreNavigator.Screen
        name="SettingsWalletBackupStep3Screen"
        getComponent={() => require('@/routes/screens/SettingsWalletBackupStep3Screen').SettingsWalletBackupStep3Screen}
      />

      <MoreNavigator.Screen
        name="SupportTicketScreen"
        getComponent={() => require('@/routes/screens/SupportTicketScreen').SupportTicketScreen}
      />

      <MoreNavigator.Screen
        name="ContactsScreen"
        getComponent={() => require('@/routes/screens/ContactsScreen').ContactsScreen}
      />
      <MoreNavigator.Screen
        name="ContactScreen"
        getComponent={() => require('@/routes/screens/ContactScreen').ContactScreen}
      />

      <MoreNavigator.Screen
        name="NotificationsScreen"
        options={{
          gestureEnabled: false,
        }}
        getComponent={() => require('@/routes/screens/NotificationsScreen').NotificationsScreen}
      />
    </MoreNavigator.Navigator>
  )
}
