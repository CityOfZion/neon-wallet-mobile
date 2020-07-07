import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Account} from '~src/models/Account'
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
      <WalletStack.Navigator initialRouteName={Facade.path.ListWallets.name}>
        <WalletStack.Screen
          name={Facade.path.ListWallets.name}
          component={ListWalletsView}
        />
        <WalletStack.Screen
          name={Facade.path.GetWallet.name}
          component={GetWalletView}
        />
        <WalletStack.Screen
          name={Facade.path.GetAccount.name}
          component={GetAccountView}
        />
      </WalletStack.Navigator>
    </ThemeProvider>
  )
}

export default WalletStackNavigation
