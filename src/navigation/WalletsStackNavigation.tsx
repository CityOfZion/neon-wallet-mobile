import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {ROUTES} from '~/constants'
import ListWalletsView from '~src/scenes/ListWalletsView'
import {RootState} from '~src/store/reducers/root'

type WalletStackParamList = {
  ListWallets: undefined
}

const WalletStack = createStackNavigator<WalletStackParamList>()

const WalletStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <WalletStack.Navigator>
        <WalletStack.Screen name={ROUTES.LIST_WALLETS.name} component={ListWalletsView} />
      </WalletStack.Navigator>
    </ThemeProvider>
  )
}

export default WalletStackNavigation
