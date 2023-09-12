import storage from '@react-native-async-storage/async-storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore } from 'redux-persist'

import AccountReducer, { accountReducerName } from './account/AccountReducer'
import BlockchainReducer from './blockchain/BlockchainReducer'
import NetworkReducer from './network/NetworkReducer'

import ContactReducer, { contactReducerName } from '~/src/store/contact/ContactReducer'
import SettingsReducer, { settingsReducerName } from '~/src/store/settings/SettingsReducer'
import WalletReducer, { walletReducerName } from '~/src/store/wallet/WalletReducer'

export type RootState = ReturnType<typeof RootStore.reducers>

const persistedWalletReducer = persistReducer({ key: walletReducerName, storage }, WalletReducer)
const persistedAccountReducer = persistReducer({ key: accountReducerName, storage }, AccountReducer)
const persistedContactReducer = persistReducer({ key: contactReducerName, storage }, ContactReducer)
const persistedSettingsReducer = persistReducer({ key: settingsReducerName, storage }, SettingsReducer)

export abstract class RootStore {
  static readonly reducers = combineReducers({
    network: NetworkReducer,
    wallet: persistedWalletReducer,
    account: persistedAccountReducer,
    contact: persistedContactReducer,
    settings: persistedSettingsReducer,
    blockchain: BlockchainReducer,
  })

  static store = configureStore({
    reducer: this.reducers,
    middleware: getDefaultMiddleware => [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['blockchain.bsAggregator'],
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    ],
  })

  static persistor = persistStore(RootStore.store)
}
