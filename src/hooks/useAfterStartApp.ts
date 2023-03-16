import NetInfo from '@react-native-community/netinfo'
import { NavigationContainerRef } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import i18n from 'i18n-js'
import { useCallback, useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

import { appBus } from '../app/AppBus'
import { wrapper } from '../app/ApplicationWrapper'
import { walletConnectConfig } from '../config/WalletConnectConfig'
import { SessionRequest, useWalletConnect } from '../contexts/WalletConnectContext'
import { NeonWcAdapter } from '../helpers/NeonWcAdapter'
import { Account } from '../models/redux/Account'
import { RootState } from '../store/RootStore'
import { accountReducerActions } from '../store/account/AccountReducer'
import { selectAccounts } from '../store/account/SelectorAccount'
import { contactReducerActions } from '../store/contact/ContactReducer'
import { networkReducerActions } from '../store/network/NetworkReducer'
import { settingsReducerActions } from '../store/settings/SettingsReducer'
import { selectWallets } from '../store/wallet/SelectorWallet'
import { walletReducerActions } from '../store/wallet/WalletReducer'
import { walletConnectReducerActions } from '../store/walletConnect/WalletConnectReducer'

type Props = {
  navigationStarted: boolean
  navigationRef: NavigationContainerRef | null
}

export const useAfterStartApp = ({ navigationRef, navigationStarted }: Props) => {
  const dispatch = useDispatch()
  const walletConnectCtx = useWalletConnect()
  const wallets = useSelector(selectWallets)
  const accounts = useSelector(selectAccounts)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const selectedBlockchainNetworks = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)
  const [started, setStarted] = useState(false)

  const migrateStorageToReduxPersist = useCallback(() => {
    dispatch(walletReducerActions.migrateWalletsFromStorage())
    dispatch(accountReducerActions.migrateAccountsFromStorage())
    dispatch(contactReducerActions.migrateContactsFromStorage())
    dispatch(settingsReducerActions.migrateSettingsStorage())
    dispatch(walletConnectReducerActions.migrateWalletConnectFromStorage())
  }, [])

  const watchNetwork = useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(({ isInternetReachable }) => {
      dispatch(networkReducerActions.setIsConnected(isInternetReachable ?? false))
    })

    return unsubscribe
  }, [])

  const initWalletConnect = useCallback(async () => {
    if (!isConnected) return

    walletConnectCtx.autoAcceptIntercept((_accountAddress, _chain, request: SessionRequest) =>
      walletConnectConfig.defaultAutoacceptMethods.includes(request.params.request.method)
    )

    await walletConnectCtx.init()
  }, [walletConnectCtx.init, walletConnectCtx.autoAcceptIntercept, isConnected])

  const registerWalletConnectRequestListener = useCallback(() => {
    if (!walletConnectCtx.initialized) return

    walletConnectCtx.onRequestListener(async (accountAddress, _chain, request: SessionRequest) => {
      try {
        const account = accounts.find(account => account.address === accountAddress)
        if (!account) throw new Error('Failed request listener')

        const wif = await account.getWif()
        if (!wif) throw new Error('Failed request listener')

        const adapter = await NeonWcAdapter.init(selectedBlockchainNetworks[account.blockchain].url, wif)
        return adapter.rpcCall(request)
      } catch {
        throw new Error('Failed request listener')
      }
    })
  }, [walletConnectCtx.initialized, accounts, selectedBlockchainNetworks])

  const detectAppBusEvents = useCallback(() => {
    const pendingTransactionConfirmedCallback = (account: Account) => {
      showMessage({
        duration: 2000,
        message: i18n.t('toast.transactionCompleted'),
        type: 'success',
        onPress: () => {
          if (!navigationRef || selectedBlockchainNetworks[account.blockchain].type === 'custom') return

          const wallet = account.getWallet(wallets)

          if (!wallet) return

          navigationRef.reset({
            index: 0,
            routes: [{ name: wrapper.route.Tab.name }],
          })
          navigationRef.navigate(wrapper.route.GetWallet.name, { wallet })
          navigationRef.navigate(wrapper.route.GetAccount.name, { account, wallet })
          navigationRef.navigate(wrapper.route.AccountTransactionsScreen.name, {
            account,
          })
        },
      })
    }

    const claimGasEndCallback = () => {
      showMessage({
        message: i18n.t('toast.gasClaimSuccess'),
        type: 'success',
        duration: 2000,
      })
    }

    appBus.on('pendingTransactionConfirmed', pendingTransactionConfirmedCallback)

    appBus.on('claimGasEnd', claimGasEndCallback)

    return () => {
      appBus.off('pendingTransactionConfirmed', pendingTransactionConfirmedCallback)
      appBus.off('claimGasEnd', claimGasEndCallback)
    }
  }, [])

  const detectWalletConnectTransactionRequest = useCallback(() => {
    if (!walletConnectCtx.requests.length || !walletConnectCtx.sessions.length || !navigationRef) {
      return
    }

    const [request] = walletConnectCtx.requests
    const foundSession = walletConnectCtx.sessions.find(it => it.topic === request.topic)

    if (!foundSession) {
      return
    }

    navigationRef.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCTransactionRequestModal.name,
      params: {
        request,
        session: foundSession,
      },
    })
  }, [walletConnectCtx.requests, walletConnectCtx.sessions])

  const start = useCallback(async () => {
    try {
      migrateStorageToReduxPersist()
      await initWalletConnect()
    } finally {
      setStarted(true)
    }
  }, [migrateStorageToReduxPersist, initWalletConnect])

  useEffect(() => {
    registerWalletConnectRequestListener()
  }, [registerWalletConnectRequestListener])

  useEffect(() => {
    const unsubscribeWatchNetwork = watchNetwork()
    const unsubscribeDetectAppBusEvents = detectAppBusEvents()

    return () => {
      unsubscribeWatchNetwork()
      unsubscribeDetectAppBusEvents()
    }
  }, [watchNetwork])

  useEffect(() => {
    detectWalletConnectTransactionRequest()
  }, [detectWalletConnectTransactionRequest])

  useEffect(() => {
    start()
  }, [start])

  useEffect(() => {
    if (!started || !navigationStarted) return

    SplashScreen.hideAsync()
  }, [started, navigationStarted])
}
