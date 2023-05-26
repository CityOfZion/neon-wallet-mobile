import storage from '@react-native-async-storage/async-storage'
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'

import AccountReducer, { accountReducerName } from './account/AccountReducer'
import NetworkReducer from './network/NetworkReducer'
import WalletConnectReducer, { walletConnectReducerName } from './walletConnect/WalletConnectReducer'

import ContactReducer, { contactReducerName } from '~/src/store/contact/ContactReducer'
import SettingsReducer, { settingsReducerName } from '~/src/store/settings/SettingsReducer'
import WalletReducer, { walletReducerName } from '~/src/store/wallet/WalletReducer'

export type RootState = ReturnType<typeof RootStore.reducers>

const persistedWalletReducer = persistReducer({ key: walletReducerName, storage }, WalletReducer)
const persistedAccountReducer = persistReducer({ key: accountReducerName, storage }, AccountReducer)
const persistedContactReducer = persistReducer({ key: contactReducerName, storage }, ContactReducer)
const persistedSettingsReducer = persistReducer({ key: settingsReducerName, storage }, SettingsReducer)
const persistedWalletConnectedReducer = persistReducer({ key: walletConnectReducerName, storage }, WalletConnectReducer)

export abstract class RootStore {
  static readonly reducers = combineReducers({
    network: NetworkReducer,
    wallet: persistedWalletReducer,
    account: persistedAccountReducer,
    contact: persistedContactReducer,
    settings: persistedSettingsReducer,
    wcReducer: persistedWalletConnectedReducer,
  })
}
