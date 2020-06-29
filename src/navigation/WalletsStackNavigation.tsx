import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {ROUTES} from '~/constants'
import GetAccountView from '~src/scenes/GetAccountView'
import GetWalletView from '~src/scenes/GetWalletView'
import ListWalletsView from '~src/scenes/ListWalletsView'
import {RootState} from '~src/store/reducers/root'

export type WalletStackParamList = {
  ListWallets: undefined
  GetWallet: {wallet: Account[]}
  GetAccount: {account: Account}
}

const WalletStack = createStackNavigator<WalletStackParamList>()

const WalletStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <WalletStack.Navigator initialRouteName={ROUTES.LIST_WALLETS.name}>
        <WalletStack.Screen
          name={ROUTES.LIST_WALLETS.name}
          component={ListWalletsView}
        />
        <WalletStack.Screen
          name={ROUTES.GET_WALLET.name}
          component={GetWalletView}
        />
        <WalletStack.Screen
          name={ROUTES.GET_ACCOUNT.name}
          component={GetAccountView}
        />
      </WalletStack.Navigator>
    </ThemeProvider>
  )
}

export default WalletStackNavigation
