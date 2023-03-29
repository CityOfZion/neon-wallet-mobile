import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { stackConfig } from '../config/ScreenConfig'
import { ProtocolEditPage, ProtocolEditPageParams } from '../scenes/Settings/ProtocolEditPage'
import { ProtocolsPage } from '../scenes/Settings/ProtocolsPage'
import { SecurityBackupCheckPage } from '../scenes/Settings/SecurityBackupCheckPage/SecurityBackupCheckPage'
import { SecurityPage } from '../scenes/Settings/SecurityPage'
import Step1BackupWalletPage, { Step1BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step1BackupWalletPage'
import Step2BackupWalletPage, { Step2BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step2BackupWalletPage'
import Step3BackupWalletPage, { Step3BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step3BackupWalletPage'

import { wrapper } from '~src/app/ApplicationWrapper'
import SettingsPage from '~src/scenes/Settings/SettingsPage'

export type SettingsStackParamList = {
  SettingsPage: undefined
  SecurityBackupCheckPage: undefined
  SecurityPage: undefined
  ProtocolEditPage: ProtocolEditPageParams
  ProtocolsPage: undefined
  Step1BackupWallet: Step1BackupWalletPageParams
  Step2BackupWallet: Step2BackupWalletPageParams
  Step3BackupWallet: Step3BackupWalletPageParams
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const SettingsStackNavigation = () => {
  return (
    <SettingsStack.Navigator screenOptions={stackConfig}>
      <SettingsStack.Screen name={wrapper.route.SettingsPage.name} component={SettingsPage} />
      <SettingsStack.Screen name={wrapper.route.SecurityBackupCheckPage.name} component={SecurityBackupCheckPage} />
      <SettingsStack.Screen name={wrapper.route.Step1BackupWallet.name} component={Step1BackupWalletPage} />
      <SettingsStack.Screen name={wrapper.route.Step2BackupWallet.name} component={Step2BackupWalletPage} />
      <SettingsStack.Screen name={wrapper.route.Step3BackupWallet.name} component={Step3BackupWalletPage} />
      <SettingsStack.Screen name={wrapper.route.SecurityPage.name} component={SecurityPage} />
      <SettingsStack.Screen name={wrapper.route.ProtocolsPage.name} component={ProtocolsPage} />
      <SettingsStack.Screen name={wrapper.route.ProtocolEditPage.name} component={ProtocolEditPage} />
    </SettingsStack.Navigator>
  )
}

export default SettingsStackNavigation
