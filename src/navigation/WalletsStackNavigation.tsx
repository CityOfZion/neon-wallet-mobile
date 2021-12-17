import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {MoreStackParamList} from './MoreStackNavigation'
import {SettingsStackParamList} from './SettingsStackNavigation'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalParams} from '~src/navigation/ModalStackNavigation'
import AccountAssetDetail, {
  AccountAssetDetailParams,
} from '~src/scenes/Account/AccountAssetDetail'
import GetAccountView, {
  GetAccountParams,
} from '~src/scenes/Account/GetAccountView'
import GetWalletView, {GetWalletParams} from '~src/scenes/GetWalletView'
import ListWalletView, {ListWalletParams} from '~src/scenes/ListWalletView'

export type WalletStackParamList = {
  ListWalletsPage: ListWalletParams
  GetWallet: GetWalletParams
  GetAccount: GetAccountParams
  AccountAssetDetail: AccountAssetDetailParams
  Modal: ModalParams
  Settings: SettingsStackParamList
  Step1BackupWallet: {wallet: Wallet} & HeaderActionButtonProps
  More: MoreStackParamList
}

export type WalletStackParams =
  | DefaultNavigationParam<GetWalletParams>
  | DefaultNavigationParam<GetAccountParams>

const WalletStack = createStackNavigator<WalletStackParamList>()

const WalletStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <WalletStack.Navigator
        initialRouteName={wrapper.route.ListWalletsPage.name}
      >
        <WalletStack.Screen
          name={wrapper.route.ListWalletsPage.name}
          component={ListWalletView}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.GetWallet.name}
          component={GetWalletView}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.GetAccount.name}
          component={GetAccountView}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.AccountAssetDetail.name}
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
