import { JsonRpcRequest } from '@json-rpc-tools/utils'
import NetInfo from '@react-native-community/netinfo'
import { NavigationContainer, RouteProp, NavigationContainerRef } from '@react-navigation/native'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useEffect, useRef, useState } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { appBus } from '../app/AppBus'
import { blockchainServices, getBlockchainByAddress, hasWCIntegration } from '../blockchain'
import { useWalletConnect } from '../contexts/WalletConnectContext'
import { Account } from '../models/redux/Account'
import SetupCompletePage, { SetupCompleteParamList } from '../scenes/SetupCompletePage'
import { RootState } from '../store/RootStore'
import { networkReducerActions } from '../store/network/NetworkReducer'
import { settingsReducerActions } from '../store/settings/SettingsReducer'
import { selectWallets } from '../store/wallet/SelectorWallet'
import { walletReducerActions } from '../store/wallet/WalletReducer'
import { walletConnectReducerActions } from '../store/walletConnect/WalletConnectReducer'

import { createStackNavigator } from '~/node_modules/@react-navigation/stack'
import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { contactReducerActions } from '~/src/store/contact/ContactReducer'
import { wrapper } from '~src/app/ApplicationWrapper'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { DeepLinkingConfig } from '~src/config/DeepLinkingConfig'
import { screenConfig } from '~src/config/ScreenConfig'
import ModalStackNavigation, { ModalParams } from '~src/navigation/ModalStackNavigation'
import TabNavigation, { TabParams } from '~src/navigation/TabNavigation'
import OnboardingPage from '~src/scenes/OnboardingPage'
import { QRCodeScan, QRCodeScanParams } from '~src/scenes/QRCodeScan'

export type RootStackParamList = {
  Tab: TabParams
  Modal: ModalParams
  Onboarding: undefined
  QRCodeScan: QRCodeScanParams
  SetupCompletePage: SetupCompleteParamList
}

interface Props {
  route?: RouteProp<RootStackParamList, 'Modal'>
}

const RootStack = createStackNavigator<RootStackParamList>()

const deepLinking = new DeepLinkingConfig()

const AppNavigation: React.FC<Props> = props => {
  const theme = useSelector((state: RootState) => {
    return wrapper.theme[state.settings.theme]
  })

  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const isFirstTime = useSelector((state: RootState) => state.settings.isFirstTime)
  const wallets = useSelector(selectWallets)

  const walletConnectCtx = useWalletConnect()
  const dispatch = useDispatch<any>()

  const [hasInit, setInit] = useState(false)

  const navigationRef = useRef<NavigationContainerRef>(null)

  const migrateStorage = async () => {
    await dispatch(walletReducerActions.migrateWalletsFromStorage())
    await dispatch(accountReducerActions.migrateAccountsFromStorage())
    await dispatch(contactReducerActions.migrateContactsFromStorage())
    await dispatch(settingsReducerActions.migrateSettingsStorage())
    await dispatch(walletConnectReducerActions.migrateWalletConnectFromStorage())
  }

  const startApplication = async () => {
    await migrateStorage()

    setInit(true)
  }

  const getInitialRouteName = () => {
    return isFirstTime ? wrapper.route.Onboarding.name : wrapper.route.Tab.name
  }

  deepLinking.setInitialRoute(getInitialRouteName())

  const linking = deepLinking.getLinkingConfig()

  useEffect(() => {
    if (!hasInit) {
      Await.run('application', startApplication)
    }
  }, [hasInit])

  useEffect(() => {
    async function handle() {
      if (!hasInit) {
        return
      }

      if (!isConnected && walletConnectCtx.initialized) {
        showMessage({
          message: i18n.t('walletconnect.internetConnectionLost'),
          type: 'danger',
          duration: 5000,
        })
        await walletConnectCtx.resetApp()
        return
      }

      if (isConnected && !walletConnectCtx.initialized) {
        await walletConnectCtx.init()
      }
    }

    handle()
  }, [isConnected, hasInit])

  useEffect(() => {
    walletConnectCtx.autoAcceptIntercept(
      (_accountAddress, _chain, request: JsonRpcRequest) =>
        request.method === 'testInvoke' || request.method === 'multiTestInvoke'
    )

    walletConnectCtx.onRequestListener(async (accountAddress, _chain, request: JsonRpcRequest) => {
      const blockchain = getBlockchainByAddress(accountAddress)

      if (blockchain) {
        const bs = blockchainServices[blockchain]

        if (hasWCIntegration(bs)) {
          const result = await bs.rpcCall(accountAddress, request)

          return result
        }
      }
      throw new Error('Failed request listener')
    })
  }, [])

  useEffect(() => {
    appBus.on('pendingTransactionConfirmed', (account: Account) => {
      showMessage({
        duration: 2000,
        message: i18n.t('toast.transactionCompleted'),
        type: 'success',
        onPress: () => {
          const navigation = navigationRef.current
          const wallet = account.getWallet(wallets)

          if (!navigation || !wallet) return

          navigation.reset({
            index: 0,
            routes: [{ name: wrapper.route.Tab.name }],
          })
          navigation.navigate(wrapper.route.GetWallet.name, { wallet })
          navigation.navigate(wrapper.route.GetAccount.name, { account, wallet })
          navigation.navigate(wrapper.route.AccountTransactionsScreen.name, {
            account,
          })
        },
      })
    })

    appBus.on('claimGasEnd', () => {
      showMessage({
        message: i18n.t('toast.gasClaimSuccess'),
        type: 'success',
        duration: 2000,
      })
    })
  }, [])

  useEffect(() => {
    if (!walletConnectCtx.requests.length || !walletConnectCtx.sessions.length || !navigationRef.current) {
      return
    }

    const [request] = walletConnectCtx.requests
    const foundSession = walletConnectCtx.sessions.find(it => it.topic === request.topic)

    if (!foundSession) {
      return
    }

    navigationRef.current.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCTransactionRequestModal.name,
      params: {
        request,
        session: foundSession,
      },
    })
  }, [walletConnectCtx.requests, walletConnectCtx.sessions])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isInternetReachable }) => {
      dispatch(networkReducerActions.setIsConnected(isInternetReachable ?? false))
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <AwaitActivity name="application" loadingView={<ScreenLoader />}>
      <NavigationContainer linking={linking} fallback={<ScreenLoader />} ref={navigationRef}>
        <ThemeProvider theme={theme}>
          <RootStack.Navigator initialRouteName={getInitialRouteName()} headerMode="none" screenOptions={screenConfig}>
            <RootStack.Screen name={wrapper.route.Tab.name} component={TabNavigation} />
            <RootStack.Screen name={wrapper.route.Onboarding.name} component={OnboardingPage} />
            <RootStack.Screen name={wrapper.route.QRCodeScan.name} component={QRCodeScan} />
            <RootStack.Screen name={wrapper.route.SetupCompletePage.name} component={SetupCompletePage} />
            <RootStack.Screen
              name={wrapper.route.Modal.name}
              component={ModalStackNavigation}
              initialParams={props.route?.params}
            />
          </RootStack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
    </AwaitActivity>
  )
}

export default AppNavigation
