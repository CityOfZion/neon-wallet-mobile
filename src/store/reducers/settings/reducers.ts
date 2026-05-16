import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import type { TSettingsReducer } from './index'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type {
  TCurrency,
  TCustomNetworks,
  TLanguage,
  TSecurity,
  TSelectedNetworks,
  TSurveyInfoStatus,
} from '@/types/store'

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
  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)

  cloneSelectedNetworkByBlockchain[blockchain] = network as any

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const setSelectedNetworkByBlockchain = (state: TSettingsReducer, action: PayloadAction<TSelectedNetworks>) => {
  state.data.selectedNetworkByBlockchain = action.payload
}

const setSelectedNetworkUrl: CaseReducer<
  TSettingsReducer,
  PayloadAction<{ blockchain: TBlockchainServiceKey; url: string; isAutomatic?: boolean }>
> = (state, action) => {
  const { blockchain, url, isAutomatic } = action.payload
  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)

  cloneSelectedNetworkByBlockchain[blockchain].url = url
  cloneSelectedNetworkByBlockchain[blockchain].isAutomatic = isAutomatic

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const saveCustomNetwork = <T extends TBlockchainServiceKey>(
  state: TSettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { blockchain, network } = action.payload
  const cloneCustomNetworks = cloneDeep(state.data.customNetworksByBlockchain)
  const foundIndex = cloneCustomNetworks[blockchain].findIndex(({ id }) => id === network.id)

  if (foundIndex < 0) {
    cloneCustomNetworks[blockchain].push(network)
  } else {
    const cloneSelectedNetworks = cloneDeep(state.data.selectedNetworkByBlockchain)

    cloneCustomNetworks[blockchain][foundIndex] = network

    if (cloneSelectedNetworks[blockchain].id === network.id) {
      cloneSelectedNetworks[blockchain] = network as TSelectedNetworks[T]

      state.data.selectedNetworkByBlockchain = cloneSelectedNetworks
    }
  }

  state.data.customNetworksByBlockchain = cloneCustomNetworks
}

const deleteCustomNetwork = <T extends TBlockchainServiceKey>(
  state: TSettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { network, blockchain } = action.payload
  const cloneCustomNetworks = cloneDeep(state.data.customNetworksByBlockchain)
  const cloneSelectedNetwork = cloneDeep(state.data.selectedNetworkByBlockchain)
  const filteredNetworks = cloneCustomNetworks[blockchain].filter(currentNetwork => currentNetwork.id !== network.id)

  cloneCustomNetworks[blockchain] = filteredNetworks as TCustomNetworks[T]

  state.data.customNetworksByBlockchain = cloneCustomNetworks

  if (cloneSelectedNetwork[blockchain].id === network.id) {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    cloneSelectedNetwork[blockchain] = service.defaultNetwork

    state.data.selectedNetworkByBlockchain = cloneSelectedNetwork
  }
}

const dontShowNeo3VoteSupportUsModalAgain: CaseReducer<TSettingsReducer> = ({ data }) => {
  data.canShowNeo3VoteSupportUsModal = false
}

const setIsOnboardingCompleted: CaseReducer<TSettingsReducer, PayloadAction<boolean>> = (state, action) => {
  state.data.isOnboardingCompleted = action.payload
}

const setShouldConfirmAction: CaseReducer<TSettingsReducer, PayloadAction<boolean>> = (state, action) => {
  state.data.shouldConfirmAction = action.payload
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
  setShouldConfirmAction,
}
