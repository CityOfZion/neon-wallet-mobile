import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import PasscodeStackNavigation, {
  PasscodeStackParams,
} from './PasscodeStackNavigation'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {HeaderCustomProps} from '~src/components/layout/HeaderBar'
import {Wallet} from '~src/models/redux/Wallet'
import Step1BackupWalletPage, {
  StepsBackupWalletPageParams,
} from '~src/scenes/BackupWalletPage/Step1BackupWalletPage'
import Step2BackupWalletPage from '~src/scenes/BackupWalletPage/Step2BackupWalletPage'
import Step3BackupWalletPage from '~src/scenes/BackupWalletPage/Step3BackupWalletPage'
import MyWalletOptionsPage from '~src/scenes/MyWalletOptionsPage'
import MyWalletsPage from '~src/scenes/MyWalletsPage'
import SettingsPage from '~src/scenes/SettingsPage'
import WalletDetailsPage, {
  WalletDetailsParamList,
} from '~src/scenes/WalletDetailsPage'

export type SettingsStackParamList = {
  SettingsPage: undefined
  MyWallets: undefined
  MyWalletOptions: {wallet: Wallet} & HeaderCustomProps
  WalletDetails: WalletDetailsParamList
  Step1BackupWallet: StepsBackupWalletPageParams & HeaderActionButtonProps
  Step2BackupWallet: StepsBackupWalletPageParams & HeaderActionButtonProps
  Step3BackupWallet: StepsBackupWalletPageParams & HeaderActionButtonProps
  PasscodeStack: PasscodeStackParams
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const SettingsStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <SettingsStack.Navigator>
        <SettingsStack.Screen
          name={wrapper.route.SettingsPage.name}
          component={SettingsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Settings.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.MyWallets.name}
          component={MyWalletsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.MyWallets.translate(),
              iconWidth: 28,
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.MyWalletOptions.name}
          component={MyWalletOptionsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.WalletDetails.name}
          component={WalletDetailsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.WalletDetails.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.Step1BackupWallet.name}
          component={Step1BackupWalletPage}
          options={({route}) =>
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
          options={({route}) =>
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
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Step3BackupWallet.translate(),
              theme,
              route,
            })
          }
        />
        <SettingsStack.Screen
          name={wrapper.route.PasscodeStack.name}
          component={PasscodeStackNavigation}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.PasscodeStack.name,
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
