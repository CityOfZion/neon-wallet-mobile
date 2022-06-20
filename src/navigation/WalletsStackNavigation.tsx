import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { HeaderActionButtonProps } from '../components/layout/HeaderActionButton'
import AccountConnectionsScreen, { AccountConnectionsScreenParams } from '../scenes/Account/AccountConnectionsScreen'
import AccountNFTSScreen, { AccountNFTSScreenParams } from '../scenes/Account/AccountNFTSScreen/AccountNFTSScreen'
import { AccountSettingsView, AccountSettingsViewParams } from '../scenes/Account/AccountSettingsView'
import Step1BackupWalletPage, { StepsBackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step1BackupWalletPage'
import Step2BackupWalletPage from '../scenes/Wallet/BackupWallet/Step2BackupWalletPage'
import Step3BackupWalletPage from '../scenes/Wallet/BackupWallet/Step3BackupWalletPage'
import {
  WalletSettingsView,
  WalletSettingViewParams,
} from '../scenes/Wallet/WalletSettingsView'
import {RootState} from '../store/RootStore'

import AccountTransactionsScreen, {
  AccountTransactionsScreenParams,
} from '~/src/scenes/Account/AccountTransactionsScreen/AccountTransactionsScreen'
import GetWalletView from '~/src/scenes/Wallet/GetWalletView'
import ListWalletView from '~/src/scenes/Wallet/ListWalletView'
import { wrapper } from '~src/app/ApplicationWrapper'
import { Navigator } from '~src/app/Navigator'
import AccountAssetDetail, { AccountAssetDetailParams } from '~src/scenes/Account/AccountAssetDetail'
import AccountAssetScreen from '~src/scenes/Account/AccountAssetsScreen'
import GetAccountView from '~src/scenes/Account/GetAccountView'

export type WalletStackParamList = {
  ListWalletsPage: undefined
  GetWallet: undefined
  GetAccount: undefined
  AccountAssetDetail: AccountAssetDetailParams
  AccountAssetScreen: undefined
  AccountTransactionsScreen: AccountTransactionsScreenParams
  AccountConnectionsScreen: AccountConnectionsScreenParams
  AccountNFTSScreen: AccountNFTSScreenParams
  AccountSettingsView: AccountSettingsViewParams
  WalletSettingsView: WalletSettingViewParams
  Step1BackupWallet: StepsBackupWalletPageParams & HeaderActionButtonProps
  Step2BackupWallet: StepsBackupWalletPageParams & HeaderActionButtonProps
  Step3BackupWallet: StepsBackupWalletPageParams & HeaderActionButtonProps
}

const WalletStack = createStackNavigator<WalletStackParamList>()

const WalletStackNavigation = () => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <ThemeProvider theme={theme}>
      <WalletStack.Navigator initialRouteName={wrapper.route.ListWalletsPage.name}>
        <WalletStack.Screen
          name={wrapper.route.ListWalletsPage.name}
          component={ListWalletView}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.GetWallet.name}
          component={GetWalletView}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.GetAccount.name}
          component={GetAccountView}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.AccountAssetDetail.name}
          component={AccountAssetDetail}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.AccountAssetScreen.name}
          component={AccountAssetScreen}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.screenLayout.assets'),
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.AccountConnectionsScreen.name}
          component={AccountConnectionsScreen}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.screenLayout.connections'),
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.AccountTransactionsScreen.name}
          component={AccountTransactionsScreen}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.screenLayout.transactions'),
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.AccountNFTSScreen.name}
          component={AccountNFTSScreen}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.screenLayout.nfts'),
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.WalletSettingsView.name}
          component={WalletSettingsView}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.walletSettingsView.title'),
            })
          }
        />

        <WalletStack.Screen
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

        <WalletStack.Screen
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

        <WalletStack.Screen
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

        <WalletStack.Screen
          name={wrapper.route.AccountSettingsView.name}
          component={AccountSettingsView}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.accountSettingsView.title'),
            })
          }
        />
      </WalletStack.Navigator>
    </ThemeProvider>
  )
}

export default WalletStackNavigation
