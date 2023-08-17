import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import NetInfo from '@react-native-community/netinfo'
import { NavigationContainerRef } from '@react-navigation/native'
import i18n from 'i18n-js'
import { useCallback, useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

import { appBus } from '../app/AppBus'
import { wrapper } from '../app/ApplicationWrapper'
import OTAHelper from '../helpers/OTAHelper'
import { Account } from '../models/redux/Account'
import { accountReducerActions } from '../store/account/AccountReducer'
import { contactReducerActions } from '../store/contact/ContactReducer'
import { networkReducerActions } from '../store/network/NetworkReducer'
import { settingsReducerActions } from '../store/settings/SettingsReducer'
import { selectWallets } from '../store/wallet/SelectorWallet'
import { walletReducerActions } from '../store/wallet/WalletReducer'

type Props = {
  navigationStarted: boolean
  navigationRef: NavigationContainerRef | null
}

export const useAfterStartApp = ({ navigationRef, navigationStarted }: Props) => {
  const dispatch = useDispatch()
  const { requests, sessions } = useWalletConnectWallet()
  const wallets = useSelector(selectWallets)
  const [started, setStarted] = useState(false)

  const migrateStorageToReduxPersist = useCallback(() => {
    dispatch(walletReducerActions.migrateWalletsFromStorage())
    dispatch(accountReducerActions.migrateAccountsFromStorage())
    dispatch(contactReducerActions.migrateContactsFromStorage())
    dispatch(settingsReducerActions.migrateSettingsStorage())
  }, [])

  const watchNetwork = useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(({ isInternetReachable }) => {
      dispatch(networkReducerActions.setIsConnected(isInternetReachable ?? false))
    })

    return unsubscribe
  }, [])

  const detectWalletConnectRequest = useCallback(() => {
    if (!requests.length || !navigationRef) {
      return
    }

    const [request] = requests
    if (!request) return

    const session = sessions.find(session => session.topic === request.topic)
    if (!session) return

    navigationRef.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCTransactionRequestModal.name,
      params: {
        request,
        session,
      },
    })
  }, [requests, sessions])

  const detectAppBusEvents = useCallback(() => {
    const pendingTransactionConfirmedCallback = (account: Account) => {
      showMessage({
        duration: 2000,
        message: i18n.t('toast.transactionCompleted'),
        type: 'success',
        onPress: () => {
          if (!navigationRef) return

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

  const start = useCallback(async () => {
    try {
      migrateStorageToReduxPersist()
    } finally {
      setStarted(true)
    }
  }, [migrateStorageToReduxPersist])

  useEffect(() => {
    detectWalletConnectRequest()
  }, [detectWalletConnectRequest])

  useEffect(() => {
    const unsubscribeWatchNetwork = watchNetwork()
    const unsubscribeDetectAppBusEvents = detectAppBusEvents()

    return () => {
      unsubscribeWatchNetwork()
      unsubscribeDetectAppBusEvents()
    }
  }, [watchNetwork])

  useEffect(() => {
    start()
  }, [start])

  useEffect(() => {
    if (!started || !navigationStarted) return
    OTAHelper.handleOTAUpdates()
  }, [started, navigationStarted])
}
