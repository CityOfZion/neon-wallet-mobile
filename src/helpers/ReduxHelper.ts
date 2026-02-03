import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import { getLanguageMiddleware } from '../store/middlewares/language'
import { getNetworkMiddleware } from '../store/middlewares/network'
import { getAccountReducer } from '../store/reducers/account'
import { getContactReducer } from '../store/reducers/contact'
import { getNotificationReducer } from '../store/reducers/notification'
import { getSettingsReducer } from '../store/reducers/settings'
import { getUtilityReducer } from '../store/reducers/utility'
import { getWalletReducer } from '../store/reducers/wallet'

export class ReduxHelper {
  static store: ReturnType<typeof this.setup>
  static persistor: ReturnType<typeof persistStore>

  static getReducer() {
    return combineReducers({
      utility: getUtilityReducer(),
      account: getAccountReducer(),
      wallet: getWalletReducer(),
      contact: getContactReducer(),
      settings: getSettingsReducer(),
      notification: getNotificationReducer(),
    })
  }

  static setup() {
    const reducer = this.getReducer()
    const middlewares = [getLanguageMiddleware(), getNetworkMiddleware()]

    const configuredStore = configureStore({
      reducer,
      middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }).concat(middlewares),
    })

    this.store = configuredStore

    this.persistor = persistStore(this.store)

    return configuredStore
  }

  static waitForBootstrap() {
    return new Promise<void>((resolve, reject) => {
      if (!this.persistor) {
        reject(new Error('Store is not initialized'))
      }

      const { bootstrapped } = this.persistor.getState()
      if (bootstrapped) {
        resolve()
        return
      }

      const unsubscribe = this.persistor.subscribe(() => {
        const { bootstrapped } = this.persistor.getState()
        if (bootstrapped) {
          unsubscribe()
          resolve()
        }
      })
    })
  }
}
