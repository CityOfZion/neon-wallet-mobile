import storage from '@react-native-async-storage/async-storage'
import type { CaseReducerActions } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { createMigrate, persistReducer } from 'redux-persist'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { LanguageHelper } from '@/helpers/LanguageHelper'

import { getSettingsMigrations } from './migrations'
import { settingsSliceReducers } from './reducers'

import type { TCurrency, TCustomNetwork, TLanguage, TSecurity, TSelectedNetworks } from '@/types/store'

export interface ISettingsReducer {
  data: {
    currency: TCurrency
    security: TSecurity
    isFirstTime: boolean
    isOnboardingCompleted: boolean
    customNetworksByBlockchain: TCustomNetwork
    selectedNetworkByBlockchain: TSelectedNetworks
    language: TLanguage
    canShowVoteNeo3SupportUsModal: boolean
  }
}

export let settingsReducerActions: CaseReducerActions<typeof settingsSliceReducers, string>

export function getSettingsReducer() {
  const settingsMigrations = getSettingsMigrations()

  const settingsReducerInitialState = {
    data: {
      currency: CurrencyHelper.defaultCurrency,
      isFirstTime: true,
      isOnboardingCompleted: false,
      security: { type: 'disabled' },
      customNetworksByBlockchain: {
        ethereum: [],
        neo3: [],
        neoLegacy: [],
        neox: [],
        polygon: [],
        base: [],
        arbitrum: [],
      },
      selectedNetworkByBlockchain: {
        neo3: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3.defaultNetwork,
        neoLegacy: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neoLegacy.defaultNetwork,
        ethereum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.ethereum.defaultNetwork,
        neox: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neox.defaultNetwork,
        polygon: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
        base: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.base.defaultNetwork,
        arbitrum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.arbitrum.defaultNetwork,
      },
      language: LanguageHelper.defaultLanguage,
      canShowVoteNeo3SupportUsModal: true,
    },
  } as ISettingsReducer

  const settingsReducerConfig: PersistConfig<ISettingsReducer> = {
    key: 'settingsReducer',
    storage,
    timeout: 0,
    migrate: createMigrate(settingsMigrations),
    version: 11,
  }

  const settingsSlice = createSlice({
    name: settingsReducerConfig.key,
    initialState: settingsReducerInitialState,
    reducers: settingsSliceReducers,
  })

  settingsReducerActions = settingsSlice.actions

  return persistReducer(settingsReducerConfig, settingsSlice.reducer)
}
