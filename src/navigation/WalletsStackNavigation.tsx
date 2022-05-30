import {createStackNavigator} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {AccountNFTSScreenParams} from '../scenes/Account/AccountNFTSScreen'
import WCAccountConnectionsScreen, {
  WCAccountConnectionsScreenParams,
} from '../scenes/walletConnect/WCAccountConnectionsScreen'
import {MoreStackParamList} from './MoreStackNavigation'
import {SettingsStackParamList} from './SettingsStackNavigation'

import AccountTransactionsScreen, {
  AccountTransactionsScreenParams,
} from '~/src/scenes/Account/AccountTransactionsScreen'
import {wrapper} from '~src/app/ApplicationWrapper'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalParams} from '~src/navigation/ModalStackNavigation'
import AccountAssetDetail, {
  AccountAssetDetailParams,
} from '~src/scenes/Account/AccountAssetDetail'
import AccountAssetScreen from '~src/scenes/Account/AccountAssetsScreen'
import GetAccountView from '~src/scenes/Account/GetAccountView'
import GetWalletView from '~src/scenes/GetWalletView'
import ListWalletView, {ListWalletParams} from '~src/scenes/ListWalletView'

export type WalletStackParamList = {
  ListWalletsPage: ListWalletParams
  GetWallet: undefined
  GetAccount: undefined
  AccountAssetDetail: AccountAssetDetailParams
  AccountAssetScreen: undefined
  AccountTransactionsScreen: AccountTransactionsScreenParams
  WCAccountConnectionsScreen: WCAccountConnectionsScreenParams
  AccountNFTSScreen: AccountNFTSScreenParams
}

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
        <WalletStack.Screen
          name={wrapper.route.AccountAssetScreen.name}
          component={AccountAssetScreen}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.screenLayout.assets'),
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.WCAccountConnectionsScreen.name}
          component={WCAccountConnectionsScreen}
          options={({route}) =>
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
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.screenLayout.transactions'),
            })
          }
        />
        <WalletStack.Screen
          name={wrapper.route.AccountNFTSScreen.name}
          component={AccountTransactionsScreen}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
              title: i18n.t('screens.screenLayout.nfts'),
            })
          }
        />
      </WalletStack.Navigator>
    </ThemeProvider>
  )
}

export default WalletStackNavigation
