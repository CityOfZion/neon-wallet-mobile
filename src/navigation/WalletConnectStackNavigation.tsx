import {createStackNavigator} from '@react-navigation/stack'
import React, {useEffect, useCallback} from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {useWalletConnect} from '../contexts/WalletConnectContext'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Navigator} from '~src/app/Navigator'
import WalletConnectPage, {
  WalletConnectPageParams,
} from '~src/scenes/walletConnect/WalletConnectPage'
export type WalletConnectStackParamList = {
  WalletConnectPage: WalletConnectPageParams
}

const WalletConnectStack = createStackNavigator<WalletConnectStackParamList>()

const WalletConnectStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const walletConnectCtx = useWalletConnect()
  const isConnected = useSelector(
    (state: RootState) => state.network.isConnected
  )

  const handleInitWalletConnect = useCallback(async () => {
    if (walletConnectCtx.wcClient === undefined && isConnected) {
      await walletConnectCtx.init()
    }
  }, [walletConnectCtx.wcClient, isConnected])

  useEffect(() => {
    handleInitWalletConnect()
  }, [walletConnectCtx.wcClient, isConnected])

  return (
    <ThemeProvider theme={theme}>
      <WalletConnectStack.Navigator>
        <WalletConnectStack.Screen
          name={wrapper.route.WalletConnectPage.name}
          component={WalletConnectPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.WalletConnectPage.translate(),
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
