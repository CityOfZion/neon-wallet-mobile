import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import type { TSettingsReducer } from './index'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type { TCurrency, TLanguage, TSecurity, TSelectedNetworks, TSurveyInfoStatus } from '@/types/store'

const setSecurity: CaseReducer<TSettingsReducer, PayloadAction<TSecurity>> = (state, action) => {
  state.data.security = action.payload
}

const setCurrency: CaseReducer<TSettingsReducer, PayloadAction<TCurrency>> = (state, action) => {
  state.data.currency = action.payload
}

const setLanguage: CaseReducer<TSettingsReducer, PayloadAction<TLanguage>> = (state, action) => {
  state.data.language = action.payload
}

const setIsFirstTime: CaseReducer<TSettingsReducer, PayloadAction<boolean>> = (state, action) => {
  state.data.isFirstTime = action.payload
}

const setSurveyInfo: CaseReducer<TSettingsReducer, PayloadAction<TSurveyInfoStatus>> = (state, action) => {
  state.data.surveyInfo.status = action.payload
  state.data.surveyInfo.updatedAt = Date.now()
}

const setSelectNetwork = <T extends TBlockchainServiceKey>(
  state: TSettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { blockchain, network } = action.payload

  state.data.selectedNetworkByBlockchain[blockchain] = network as any
}

const setSelectedNetworkByBlockchain = (state: TSettingsReducer, action: PayloadAction<TSelectedNetworks>) => {
  state.data.selectedNetworkByBlockchain = action.payload
}

const setSelectedNetworkUrl: CaseReducer<
  TSettingsReducer,
  PayloadAction<{ blockchain: TBlockchainServiceKey; url: string; isAutomatic?: boolean }>
> = (state, action) => {
  const { blockchain, url, isAutomatic } = action.payload
  const selectedNetwork = state.data.selectedNetworkByBlockchain[blockchain]

  selectedNetwork.url = url
  selectedNetwork.isAutomatic = isAutomatic
}

const saveCustomNetwork = <T extends TBlockchainServiceKey>(
  state: TSettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { blockchain, network } = action.payload
  const customNetworks = state.data.customNetworksByBlockchain[blockchain]
  const foundIndex = customNetworks.findIndex(({ id }) => id === network.id)

  if (foundIndex < 0) {
    customNetworks.push(network)

    return
  }

  customNetworks[foundIndex] = network

  if (state.data.selectedNetworkByBlockchain[blockchain].id === network.id) {
    state.data.selectedNetworkByBlockchain[blockchain] = network as TSelectedNetworks[T]
  }
}

const deleteCustomNetwork = <T extends TBlockchainServiceKey>(
  state: TSettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { network, blockchain } = action.payload
  const customNetworks = state.data.customNetworksByBlockchain[blockchain]
  const foundIndex = customNetworks.findIndex(currentNetwork => currentNetwork.id === network.id)

  if (foundIndex >= 0) {
    customNetworks.splice(foundIndex, 1)
  }

  if (state.data.selectedNetworkByBlockchain[blockchain].id === network.id) {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    state.data.selectedNetworkByBlockchain[blockchain] = service.defaultNetwork as TSelectedNetworks[T]
  }
}

const dontShowNeo3VoteSupportUsModalAgain: CaseReducer<TSettingsReducer> = ({ data }) => {
  data.canShowNeo3VoteSupportUsModal = false
}

const setIsOnboardingCompleted: CaseReducer<TSettingsReducer, PayloadAction<boolean>> = (state, action) => {
  state.data.isOnboardingCompleted = action.payload
}

export const settingsSliceReducers = {
  setSecurity,
  setCurrency,
  setLanguage,
  setIsFirstTime,
  setSurveyInfo,
  setSelectNetwork,
  saveCustomNetwork,
  deleteCustomNetwork,
  setSelectedNetworkUrl,
  dontShowNeo3VoteSupportUsModalAgain,
  setSelectedNetworkByBlockchain,
  setIsOnboardingCompleted,
}
