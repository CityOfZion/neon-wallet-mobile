import {RouteProp} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {Account} from '~src/models/redux/Account'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import Step1CreateWalletPage from '~src/scenes/CreateWalletPage/Step1CreateWalletPage'
import Step2CreateWalletPage from '~src/scenes/CreateWalletPage/Step2CreateWalletPage'
import Step3CreateWalletPage from '~src/scenes/CreateWalletPage/Step3CreateWalletPage'
import Step4CreateWalletPage from '~src/scenes/CreateWalletPage/Step4CreateWalletPage'
import Step5CreateWalletPage from '~src/scenes/CreateWalletPage/Step5CreateWalletPage'
import CustomizeAccount, {
  CustomizeAccountParams,
} from '~src/scenes/CustomizeAccount'
import ImportKey from '~src/scenes/ImportKey'
import ImportReadAccount from '~src/scenes/ImportReadAccount'
import MorePage from '~src/scenes/MorePage'
import Passphrase, {PassphraseParams} from '~src/scenes/Passphrase'

export type MoreStackParamList = {
  More: undefined
  Step1CreateWallet: undefined
  Step2CreateWallet: undefined
  Step3CreateWallet: HeaderActionButtonProps
  Step4CreateWallet: undefined
  Step5CreateWallet: undefined
  ListWallets: undefined
  Modal: {screen: string}
  ImportKey: undefined
  CustomizeReadAccount: undefined
  ImportReadAccount: undefined
  Passphrase: PassphraseParams
  CustomizeAccount: CustomizeAccountParams
  CustomColor: undefined
}

const MoreStack = createStackNavigator<MoreStackParamList>()

const MoreStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <MoreStack.Navigator>
        <MoreStack.Screen
          name={Facade.route.More.name}
          component={MorePage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.More.translate(),
              image: require('~src/assets/images/more-horiz.png'),
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
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
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
            image: require('~src/assets/images/icon-add-circle-outline-white.png'),
            theme,
          })}
        />

        <MoreStack.Screen
          name={Facade.route.Step3CreateWallet.name}
          component={Step3CreateWalletPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Step3CreateWallet.translate(),
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
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
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
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
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
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
              image: require('~src/assets/images/icon-import-white.png'),
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
              image: require('~src/assets/images/icon-import-white.png'),
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
              image: require('~src/assets/images/icon-watch-white.png'),
              theme,
              route,
            })
          }
        />
        <MoreStack.Screen
          name={Facade.route.CustomizeAccount.name}
          component={CustomizeAccount}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.CustomizeAccount.translate(),
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
              theme,
              route,
            })
          }
        />
      </MoreStack.Navigator>
    </ThemeProvider>
  )
}

export default MoreStackNavigation
