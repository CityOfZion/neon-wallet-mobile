import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import AccountAssetDetail, {
  AccountAssetDetailParams,
} from '~src/scenes/Account/AccountAssetDetail'
import GetAccountView, {
  GetAccountParams,
} from '~src/scenes/Account/GetAccountView'
import GetWalletView, {GetWalletParams} from '~src/scenes/GetWalletView'
import ListWalletView from '~src/scenes/ListWalletView'

export type WalletStackParamList = {
  ListWallets: undefined
  GetWallet: GetWalletParams
  GetAccount: GetAccountParams
  AccountAssetDetail: AccountAssetDetailParams
  Modal: {screen: RouteName}
}

export type WalletStackParams =
  | DefaultNavigationParam<GetWalletParams>
  | DefaultNavigationParam<GetAccountParams>

const WalletStack = createStackNavigator<WalletStackParamList>()

const WalletStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <WalletStack.Navigator initialRouteName={Facade.route.ListWallets.name}>
        <WalletStack.Screen
          name={Facade.route.ListWallets.name}
          component={ListWalletView}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={Facade.route.GetWallet.name}
          component={GetWalletView}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={Facade.route.GetAccount.name}
          component={GetAccountView}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={Facade.route.AccountAssetDetail.name}
          component={AccountAssetDetail}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
      </WalletStack.Navigator>
    </ThemeProvider>
  )
}

export default WalletStackNavigation
