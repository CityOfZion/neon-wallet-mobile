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

import type { TCurrency, TCustomNetworks, TLanguage, TSecurity, TSelectedNetworks, TSurveyInfo } from '@/types/store'

export type TSettingsReducer = {
  data: {
    currency: TCurrency
    security: TSecurity
    isFirstTime: boolean
    isOnboardingCompleted: boolean
    customNetworksByBlockchain: TCustomNetworks
    selectedNetworkByBlockchain: TSelectedNetworks
    language: TLanguage
    canShowNeo3VoteSupportUsModal: boolean
    surveyInfo: TSurveyInfo
    shouldConfirmAction: boolean
  }
}

export let settingsReducerActions: CaseReducerActions<typeof settingsSliceReducers, string>

export function getSettingsReducer() {
  const settingsMigrations = getSettingsMigrations()

  const settingsReducerInitialState: TSettingsReducer = {
    data: {
      currency: CurrencyHelper.defaultCurrency,
      isFirstTime: true,
      isOnboardingCompleted: false,
      security: { type: 'disabled' },
      customNetworksByBlockchain: {
        neo3: [],
        neoLegacy: [],
        neox: [],
        bitcoin: [],
        solana: [],
        ethereum: [],
        polygon: [],
        base: [],
        arbitrum: [],
        stellar: [],
      },
      selectedNetworkByBlockchain: {
        neo3: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3.defaultNetwork,
        neoLegacy: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neoLegacy.defaultNetwork,
        neox: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neox.defaultNetwork,
        bitcoin: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.bitcoin.defaultNetwork,
        solana: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.solana.defaultNetwork,
        ethereum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.ethereum.defaultNetwork,
        polygon: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
        base: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.base.defaultNetwork,
        arbitrum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.arbitrum.defaultNetwork,
        stellar: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar.defaultNetwork,
      },
      language: LanguageHelper.detectDeviceLanguage(),
      canShowNeo3VoteSupportUsModal: true,
      surveyInfo: { status: 'not-submitted', updatedAt: Date.now() },
      shouldConfirmAction: true,
    },
  }

  const settingsReducerConfig: PersistConfig<TSettingsReducer> = {
    key: 'settingsReducer',
    storage,
    timeout: 0,
    migrate: createMigrate(settingsMigrations),
    version: 13,
  }

  const settingsSlice = createSlice({
    name: settingsReducerConfig.key,
    initialState: settingsReducerInitialState,
    reducers: settingsSliceReducers,
  })

  settingsReducerActions = settingsSlice.actions

  return persistReducer(settingsReducerConfig, settingsSlice.reducer)
}
