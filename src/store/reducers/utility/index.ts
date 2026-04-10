import storage from '@react-native-async-storage/async-storage'
import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig, PersistedState } from 'redux-persist'
import { createMigrate, getStoredState, persistReducer } from 'redux-persist'

import { getUtilityMigrations } from './migrations'
import { utilitySliceReducers } from './reducers'

import type { TUseTransactionsTransaction } from '@/types/hooks'
import type { THiddenTokenByBlockchain, TLastIndexesByWallet, TSwapRecord } from '@/types/store'

export type TUtilityReducer = {
  memoryData: {
    pendingTransactions: TUseTransactionsTransaction[]
    isConnected?: boolean
  }
  data: {
    swapRecords: TSwapRecord[]
    unlockedSkinIds: string[]
    hiddenTokensByBlockchain: THiddenTokenByBlockchain
    lastIndexesByWallet: TLastIndexesByWallet
  }
}

export let utilityReducerActions: CaseReducerActions<typeof utilitySliceReducers, string>

export function getUtilityReducer() {
  const utilityMigrations = getUtilityMigrations()

  const utilityReducerInitialState: TUtilityReducer = {
    memoryData: {
      pendingTransactions: [],
      isConnected: undefined,
    },
    data: {
      swapRecords: [],
      unlockedSkinIds: [],
      hiddenTokensByBlockchain: {},
      lastIndexesByWallet: {},
    },
  }

  const utilityReducerConfig: PersistConfig<TUtilityReducer> = {
    key: 'utilityReducer',
    storage,
    timeout: 0,
    blacklist: ['memoryData'],
    migrate: createMigrate(utilityMigrations),
    version: 3,
    getStoredState: async (config: any) => {
      const storedState = await config.storage.getItem(`persist:${config.key}`)

      if (storedState) {
        return (await getStoredState(config)) as PersistedState
      }

      const accountStore = await storage.getItem('persist:accountReducer')

      if (accountStore) {
        const accountStoreJSON = JSON.parse(accountStore)

        if (accountStoreJSON.swapRecords && accountStoreJSON.unlockedSkinIds) {
          const swapRecords = JSON.parse(accountStoreJSON.swapRecords)
          const unlockedSkinIds = JSON.parse(accountStoreJSON.unlockedSkinIds)

          return {
            ...utilityReducerInitialState,
            data: {
              ...utilityReducerInitialState.data,
              swapRecords,
              unlockedSkinIds,
              migrationsNeo3: {},
            },
            _persist: {
              rehydrated: true,
              version: 0,
            },
          }
        }
      }

      return {
        ...utilityReducerInitialState,
        _persist: {
          rehydrated: true,
          version: config.version,
        },
      }
    },
  }

  const utilitySlice = createSlice({
    name: 'utilityReducer',
    initialState: utilityReducerInitialState,
    reducers: utilitySliceReducers,
  })

  utilityReducerActions = utilitySlice.actions

  return persistReducer(utilityReducerConfig, utilitySlice.reducer)
}
