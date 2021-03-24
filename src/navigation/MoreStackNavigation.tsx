import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Wallet} from '../models/redux/Wallet'
import {GetWalletParams} from '../scenes/GetWalletView'
import {SettingsStackParamList} from './SettingsStackNavigation'
import {WalletStackParams} from './WalletsStackNavigation'

import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {IPlayload} from '~src/config/DeepLinkingConfig'
import Step1CreateWalletPage, {
  Step1CreateWalletParams,
} from '~src/scenes/CreateWalletPage/Step1CreateWalletPage'
import Step2CreateWalletPage from '~src/scenes/CreateWalletPage/Step2CreateWalletPage'
import Step3CreateWalletPage from '~src/scenes/CreateWalletPage/Step3CreateWalletPage'
import Step4CreateWalletPage from '~src/scenes/CreateWalletPage/Step4CreateWalletPage'
import Step5CreateWalletPage from '~src/scenes/CreateWalletPage/Step5CreateWalletPage'
import CustomizeAccount, {
  CustomizeAccountParams,
} from '~src/scenes/CustomizeAccount'
import ImportKey from '~src/scenes/ImportKey'
import ImportReadAccount, {
  ImportReadAccountParams,
} from '~src/scenes/ImportReadAccount'
import MorePage from '~src/scenes/MorePage'
import Passphrase, {PassphraseParams} from '~src/scenes/Passphrase'
export type MoreStackParam =
  | DefaultNavigationParam<
      | Partial<CustomizeAccountParams>
      | ImportReadAccountParams
      | PassphraseParams
      | Step1CreateWalletParams
      | undefined
    >
  | undefined

export type MoreStackParamList = {
  MorePage?: {playload?: IPlayload}
  Step1CreateWallet: Step1CreateWalletParams
  Step2CreateWallet: undefined
  Step3CreateWallet: HeaderActionButtonProps
  Step4CreateWallet: undefined
  Step5CreateWallet: undefined
  ImportKey: {key?: string}
  ImportReadAccount: ImportReadAccountParams
  Passphrase: PassphraseParams
  CustomizeAccount: CustomizeAccountParams
  GetWallet: GetWalletParams
  Settings: SettingsStackParamList
  ListWallets: WalletStackParams
}

const MoreStack = createStackNavigator<MoreStackParamList>()

const MoreStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <MoreStack.Navigator initialRouteName={Facade.route.MorePage.name}>
        <MoreStack.Screen
          name={Facade.route.MorePage.name}
          component={MorePage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.More.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.route.Step1CreateWallet.name}
          component={Step1CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Step1CreateWallet.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.route.Step2CreateWallet.name}
          component={Step2CreateWalletPage}
          options={Navigator.defaultStackNavigatorOptions({
            title: Facade.route.Step2CreateWallet.translate(),
            theme,
          })}
        />

        <MoreStack.Screen
          name={Facade.route.Step3CreateWallet.name}
          component={Step3CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Step3CreateWallet.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.route.Step4CreateWallet.name}
          component={Step4CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Step4CreateWallet.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.route.Step5CreateWallet.name}
          component={Step5CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Step5CreateWallet.translate(),
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.route.ImportKey.name}
          component={ImportKey}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.ImportKey.translate(),
              theme,
              route,
            })
          }
        />
        <MoreStack.Screen
          name={Facade.route.Passphrase.name}
          component={Passphrase}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.ImportKey.translate(),
              theme,
              route,
            })
          }
        />
        <MoreStack.Screen
          name={Facade.route.ImportReadAccount.name}
          component={ImportReadAccount}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.ImportReadAccount.translate(),
              theme,
              route,
            })
          }
        />
        <MoreStack.Screen
          name={Facade.route.CustomizeAccount.name}
          component={CustomizeAccount}
          options={Navigator.defaultStackNavigatorOptions({
            title: Facade.route.CustomizeAccount.translate(),
            theme,
          })}
        />
      </MoreStack.Navigator>
    </ThemeProvider>
  )
}

export default MoreStackNavigation
