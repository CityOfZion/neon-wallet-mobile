import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { SecurityBackupCheckPage } from '../scenes/Settings/SecurityBackupCheckPage/SecurityBackupCheckPage'
import { SecurityPage } from '../scenes/Settings/SecurityPage'
import Step1BackupWalletPage, { Step1BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step1BackupWalletPage'
import Step2BackupWalletPage, { Step2BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step2BackupWalletPage'
import Step3BackupWalletPage, { Step3BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step3BackupWalletPage'
import { RootState } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Navigator } from '~src/app/Navigator'
import SettingsPage from '~src/scenes/Settings/SettingsPage'

export type SettingsStackParamList = {
  SettingsPage: undefined
  SecurityBackupCheckPage: undefined
  SecurityPage: undefined
  Step1BackupWallet: Step1BackupWalletPageParams
  Step2BackupWallet: Step2BackupWalletPageParams
  Step3BackupWallet: Step3BackupWalletPageParams
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const SettingsStackNavigation = () => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <ThemeProvider theme={theme}>
      <SettingsStack.Navigator>
        <SettingsStack.Screen
          name={wrapper.route.SettingsPage.name}
          component={SettingsPage}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Settings.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.SecurityBackupCheckPage.name}
          component={SecurityBackupCheckPage}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.SecurityBackupCheckPage.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.Step1BackupWallet.name}
          component={Step1BackupWalletPage}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Step1BackupWallet.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.Step2BackupWallet.name}
          component={Step2BackupWalletPage}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Step2BackupWallet.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.Step3BackupWallet.name}
          component={Step3BackupWalletPage}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Step3BackupWallet.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.SecurityPage.name}
          component={SecurityPage}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.SecurityPage.translate(),
              theme,
              route,
            })
          }
        />
      </SettingsStack.Navigator>
    </ThemeProvider>
  )
}

export default SettingsStackNavigation
