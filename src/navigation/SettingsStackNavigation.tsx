import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import WalletDetailsPage, {
  WalletDetailsParamList,
} from '../scenes/WalletDetailsPage'
import {ModalStackParamList} from './ModalStackNavigation'

import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {HeaderCustomProps} from '~src/components/layout/HeaderBar'
import {Wallet} from '~src/models/redux/Wallet'
import Step1BackupWalletPage from '~src/scenes/BackupWalletPage/Step1BackupWalletPage'
import Step2BackupWalletPage from '~src/scenes/BackupWalletPage/Step2BackupWalletPage'
import Step3BackupWalletPage from '~src/scenes/BackupWalletPage/Step3BackupWalletPage'
import MyWalletOptionsPage from '~src/scenes/MyWalletOptionsPage'
import MyWalletsPage from '~src/scenes/MyWalletsPage'
import SettingsPage from '~src/scenes/SettingsPage'

export type SettingsStackParamList = {
  SettingsPage: {initialRoute?: keyof ModalStackParamList} | undefined
  MyWallets: undefined
  MyWalletOptions: {wallet: Wallet} & HeaderCustomProps
  WalletDetails: WalletDetailsParamList
  Step1BackupWallet: {wallet: Wallet} & HeaderActionButtonProps
  Step2BackupWallet: {wallet: Wallet} & HeaderActionButtonProps
  Step3BackupWallet: {wallet: Wallet} & HeaderActionButtonProps
  Modal: object
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const SettingsStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <SettingsStack.Navigator>
        <SettingsStack.Screen
          name={Facade.route.SettingsPage.name}
          component={SettingsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Settings.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={Facade.route.MyWallets.name}
          component={MyWalletsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.MyWallets.translate(),
              iconWidth: 28,
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={Facade.route.MyWalletOptions.name}
          component={MyWalletOptionsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={Facade.route.WalletDetails.name}
          component={WalletDetailsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.WalletDetails.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={Facade.route.Step1BackupWallet.name}
          component={Step1BackupWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Step1BackupWallet.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={Facade.route.Step2BackupWallet.name}
          component={Step2BackupWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Step2BackupWallet.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={Facade.route.Step3BackupWallet.name}
          component={Step3BackupWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Step3BackupWallet.translate(),
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
