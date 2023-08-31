import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { stackConfig } from '../config/ScreenConfig'
import { DefaultNavigationParam } from '../types/global'
import SettingsStackNavigation from './SettingsStackNavigation'

import ImportReadAccount, { ImportReadAccountParams } from '~/src/scenes/Account/ImportReadAccount'
import Step1CreateWalletPage, { Step1CreateWalletParams } from '~/src/scenes/Wallet/CreateWallet/Step1CreateWalletPage'
import Step2CreateWalletPage from '~/src/scenes/Wallet/CreateWallet/Step2CreateWalletPage'
import Step3CreateWalletPage, { ParamsCreateWalletPage } from '~/src/scenes/Wallet/CreateWallet/Step3CreateWalletPage'
import Step4CreateWalletPage, { Step4CreateWalletParams } from '~/src/scenes/Wallet/CreateWallet/Step4CreateWalletPage'
import Step5CreateWalletPage, {
  Step5CreateWalletPageParams,
} from '~/src/scenes/Wallet/CreateWallet/Step5CreateWalletPage'
import { wrapper } from '~src/app/ApplicationWrapper'
import BlockchainListPage, { BlockchainListPageParams } from '~src/scenes/BlockchainListPage'
import ImportKey, { ImportKeyParams } from '~src/scenes/ImportKey'
import MnemonicSelectionList, { MnemonicSelectionListParams } from '~src/scenes/MnemonicSelectionList'
import MorePage from '~src/scenes/MorePage'
import Passphrase, { PassphraseParams } from '~src/scenes/Passphrase'

export type MoreStackParam =
  | DefaultNavigationParam<
      ImportReadAccountParams | PassphraseParams | Step1CreateWalletParams | Step4CreateWalletParams | undefined
    >
  | undefined

export type MoreStackParamList = {
  MorePage?: undefined
  Step1CreateWallet: Step1CreateWalletParams
  Step2CreateWallet: undefined
  Step3CreateWallet: ParamsCreateWalletPage
  Step4CreateWallet: Step4CreateWalletParams
  Step5CreateWallet: Step5CreateWalletPageParams | undefined
  ImportKey: ImportKeyParams | undefined
  ImportReadAccount: ImportReadAccountParams
  Passphrase: PassphraseParams
  ListWallets: undefined
  BlockchainListPage: BlockchainListPageParams
  MnemonicSelectionList: MnemonicSelectionListParams
  Settings: undefined
}

const MoreStack = createStackNavigator<MoreStackParamList>()

const MoreStackNavigation = () => {
  return (
    <MoreStack.Navigator initialRouteName={wrapper.route.MorePage.name} screenOptions={stackConfig}>
      <MoreStack.Screen name={wrapper.route.MorePage.name} component={MorePage} />
      <MoreStack.Screen name={wrapper.route.Step1CreateWallet.name} component={Step1CreateWalletPage} />
      <MoreStack.Screen name={wrapper.route.Step2CreateWallet.name} component={Step2CreateWalletPage} />
      <MoreStack.Screen name={wrapper.route.Step3CreateWallet.name} component={Step3CreateWalletPage} />
      <MoreStack.Screen name={wrapper.route.Step4CreateWallet.name} component={Step4CreateWalletPage} />
      <MoreStack.Screen name={wrapper.route.Step5CreateWallet.name} component={Step5CreateWalletPage} />
      <MoreStack.Screen name={wrapper.route.ImportKey.name} component={ImportKey} />
      <MoreStack.Screen name={wrapper.route.Passphrase.name} component={Passphrase} />
      <MoreStack.Screen name={wrapper.route.ImportReadAccount.name} component={ImportReadAccount} />
      <MoreStack.Screen name={wrapper.route.BlockchainListPage.name} component={BlockchainListPage} />
      <MoreStack.Screen name={wrapper.route.MnemonicSelectionList.name} component={MnemonicSelectionList} />
      <MoreStack.Screen name={wrapper.route.Settings.name} component={SettingsStackNavigation} />
    </MoreStack.Navigator>
  )
}

export default MoreStackNavigation
