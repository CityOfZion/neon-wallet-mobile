import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Navigator} from '~src/app/Navigator'
import WalletConnectPage from '~src/scenes/walletConnect/WalletConnectPage'
export type WalletConnectStackParamList = {
  WalletConnectPage: undefined
}

const WalletConnectStack = createStackNavigator<WalletConnectStackParamList>()

const WalletConnectStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <WalletConnectStack.Navigator>
        <WalletConnectStack.Screen
          name={wrapper.route.WalletConnectPage.name}
          component={WalletConnectPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              theme,
              route,
            })
          }
        />
      </WalletConnectStack.Navigator>
    </ThemeProvider>
  )
}

export default WalletConnectStackNavigation
