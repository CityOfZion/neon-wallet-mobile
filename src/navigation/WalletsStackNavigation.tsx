import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { stackConfig } from '../config/ScreenConfig'
import AccountConnectionsScreen, { AccountConnectionsScreenParams } from '../scenes/Account/AccountConnectionsScreen'
import AccountNFTSScreen, { AccountNFTSScreenParams } from '../scenes/Account/AccountNFTSScreen/AccountNFTSScreen'
import { AccountSettingsView, AccountSettingsViewParams } from '../scenes/Account/AccountSettingsView'
import Step1BackupWalletPage, { Step1BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step1BackupWalletPage'
import Step2BackupWalletPage, { Step2BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step2BackupWalletPage'
import Step3BackupWalletPage, { Step3BackupWalletPageParams } from '../scenes/Wallet/BackupWallet/Step3BackupWalletPage'
import { WalletSettingsView, WalletSettingViewParams } from '../scenes/Wallet/WalletSettingsView'
import { DefaultNavigationParam } from '../types/global'

import AccountTransactionsScreen, {
  AccountTransactionsScreenParams,
} from '~/src/scenes/Account/AccountTransactionsScreen/AccountTransactionsScreen'
import GetWalletView, { GetWalletViewParams } from '~/src/scenes/Wallet/GetWalletView'
import { ListWalletView, ListWalletViewParams } from '~/src/scenes/Wallet/ListWalletView/ListWalletView'
import { wrapper } from '~src/app/ApplicationWrapper'
import AccountAssetScreen, { AccountAssetScreenParams } from '~src/scenes/Account/AccountAssetsScreen'
import GetAccountView, { GetAccountViewParams } from '~src/scenes/Account/GetAccountView'

export type WalletStackParamList = {
  ListWalletsPage: ListWalletViewParams | undefined
  GetWallet: GetWalletViewParams
  GetAccount: GetAccountViewParams
  AccountAssetScreen: AccountAssetScreenParams
  AccountTransactionsScreen: AccountTransactionsScreenParams
  AccountConnectionsScreen: AccountConnectionsScreenParams
  AccountNFTSScreen: AccountNFTSScreenParams
  AccountSettingsView: AccountSettingsViewParams
  WalletSettingsView: WalletSettingViewParams
  Step1BackupWallet: Step1BackupWalletPageParams
  Step2BackupWallet: Step2BackupWalletPageParams
  Step3BackupWallet: Step3BackupWalletPageParams
}

export type WalletStackParam =
  | DefaultNavigationParam<
      | GetWalletViewParams
      | GetAccountViewParams
      | AccountAssetScreenParams
      | AccountTransactionsScreenParams
      | AccountConnectionsScreenParams
      | AccountNFTSScreenParams
      | AccountSettingsViewParams
      | WalletSettingViewParams
      | Step1BackupWalletPageParams
      | Step2BackupWalletPageParams
      | Step3BackupWalletPageParams
      | ListWalletViewParams
    >
  | undefined

const WalletStack = createStackNavigator<WalletStackParamList>()

const WalletStackNavigation = () => {
  return (
    <WalletStack.Navigator initialRouteName={wrapper.route.ListWalletsPage.name} screenOptions={stackConfig}>
      <WalletStack.Screen name={wrapper.route.ListWalletsPage.name} component={ListWalletView} />
      <WalletStack.Screen name={wrapper.route.GetWallet.name} component={GetWalletView} />
      <WalletStack.Screen name={wrapper.route.GetAccount.name} component={GetAccountView} />
      <WalletStack.Screen name={wrapper.route.AccountAssetScreen.name} component={AccountAssetScreen} />
      <WalletStack.Screen name={wrapper.route.AccountConnectionsScreen.name} component={AccountConnectionsScreen} />
      <WalletStack.Screen name={wrapper.route.AccountTransactionsScreen.name} component={AccountTransactionsScreen} />
      <WalletStack.Screen name={wrapper.route.AccountNFTSScreen.name} component={AccountNFTSScreen} />
      <WalletStack.Screen name={wrapper.route.WalletSettingsView.name} component={WalletSettingsView} />
      <WalletStack.Screen name={wrapper.route.Step1BackupWallet.name} component={Step1BackupWalletPage} />
      <WalletStack.Screen name={wrapper.route.Step2BackupWallet.name} component={Step2BackupWalletPage} />
      <WalletStack.Screen name={wrapper.route.Step3BackupWallet.name} component={Step3BackupWalletPage} />
      <WalletStack.Screen name={wrapper.route.AccountSettingsView.name} component={AccountSettingsView} />
    </WalletStack.Navigator>
  )
}

export default WalletStackNavigation
