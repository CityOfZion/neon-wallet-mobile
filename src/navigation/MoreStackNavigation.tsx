import {createStackNavigator} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import SettingsStackNavigation, {
  SettingsStackParamList,
} from './SettingsStackNavigation'
import {WalletStackParams} from './WalletsStackNavigation'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import BlockchainListPage from '~src/scenes/BlockchainListPage'
import Step1CreateWalletPage, {
  Step1CreateWalletParams,
} from '~src/scenes/CreateWalletPage/Step1CreateWalletPage'
import Step2CreateWalletPage from '~src/scenes/CreateWalletPage/Step2CreateWalletPage'
import Step3CreateWalletPage, {
  ParamsCreateWalletPage,
} from '~src/scenes/CreateWalletPage/Step3CreateWalletPage'
import Step4CreateWalletPage, {
  Step4CreateWalletParams,
} from '~src/scenes/CreateWalletPage/Step4CreateWalletPage'
import Step5CreateWalletPage from '~src/scenes/CreateWalletPage/Step5CreateWalletPage'
import CustomizeAccount, {
  CustomizeAccountParams,
} from '~src/scenes/CustomizeAccount'
import {GetWalletParams} from '~src/scenes/GetWalletView'
import ImportKey from '~src/scenes/ImportKey'
import ImportReadAccount, {
  ImportReadAccountParams,
} from '~src/scenes/ImportReadAccount'
import MnemonicSelectionList, {
  MnemonicSelectionListParams,
} from '~src/scenes/MnemonicSelectionList'
import MorePage from '~src/scenes/MorePage'
import Passphrase, {PassphraseParams} from '~src/scenes/Passphrase'

export type MoreStackParam =
  | DefaultNavigationParam<
      | Partial<CustomizeAccountParams>
      | ImportReadAccountParams
      | PassphraseParams
      | Step1CreateWalletParams
      | Step4CreateWalletParams
      | undefined
    >
  | undefined

export type MoreStackParamList = {
  MorePage?: undefined
  Step1CreateWallet: Step1CreateWalletParams
  Step2CreateWallet: undefined
  Step3CreateWallet: HeaderActionButtonProps & ParamsCreateWalletPage
  Step4CreateWallet: Step4CreateWalletParams
  Step5CreateWallet: undefined
  ImportKey: {key?: string}
  ImportReadAccount: ImportReadAccountParams
  Passphrase: PassphraseParams
  CustomizeAccount: CustomizeAccountParams
  GetWallet: GetWalletParams
  ListWallets: WalletStackParams
  BlockchainListPage: undefined
  MnemonicSelectionList: MnemonicSelectionListParams
  Settings: undefined
}

const MoreStack = createStackNavigator<MoreStackParamList>()

const MoreStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <MoreStack.Navigator initialRouteName={wrapper.route.MorePage.name}>
        <MoreStack.Screen
          name={wrapper.route.MorePage.name}
          component={MorePage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.More.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={wrapper.route.Step1CreateWallet.name}
          component={Step1CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Step1CreateWallet.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={wrapper.route.Step2CreateWallet.name}
          component={Step2CreateWalletPage}
          options={Navigator.defaultStackNavigatorOptions({
            title: wrapper.route.Step2CreateWallet.translate(),
            theme,
          })}
        />

        <MoreStack.Screen
          name={wrapper.route.Step3CreateWallet.name}
          component={Step3CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Step3CreateWallet.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={wrapper.route.Step4CreateWallet.name}
          component={Step4CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Step4CreateWallet.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={wrapper.route.Step5CreateWallet.name}
          component={Step5CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Step5CreateWallet.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={wrapper.route.ImportKey.name}
          component={ImportKey}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.ImportKey.translate(),
              theme,
              route,
            })
          }
        />
        <MoreStack.Screen
          name={wrapper.route.Passphrase.name}
          component={Passphrase}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.ImportKey.translate(),
              theme,
              route,
            })
          }
        />
        <MoreStack.Screen
          name={wrapper.route.ImportReadAccount.name}
          component={ImportReadAccount}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.ImportReadAccount.translate(),
              theme,
              route,
            })
          }
        />
        <MoreStack.Screen
          name={wrapper.route.CustomizeAccount.name}
          component={CustomizeAccount}
          options={Navigator.defaultStackNavigatorOptions({
            title: wrapper.route.CustomizeAccount.translate(),
            theme,
          })}
        />
        <MoreStack.Screen
          name={wrapper.route.BlockchainListPage.name}
          component={BlockchainListPage}
          options={Navigator.defaultStackNavigatorOptions({
            title: i18n.t('more.createWallet'),
            theme,
          })}
        />
        <MoreStack.Screen
          name={wrapper.route.MnemonicSelectionList.name}
          component={MnemonicSelectionList}
          options={Navigator.defaultStackNavigatorOptions({
            title: wrapper.route.ImportKey.translate(),
            theme,
          })}
        />
        <MoreStack.Screen
          name={wrapper.route.Settings.name}
          component={SettingsStackNavigation}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Settings.translate(),
              theme,
            })
          }
        />
      </MoreStack.Navigator>
    </ThemeProvider>
  )
}

export default MoreStackNavigation
