import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import type { ISettingsReducer } from './index'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type {
  TCurrency,
  TCustomNetwork,
  TLanguage,
  TSecurity,
  TSelectedNetworks,
  TSurveyInfoStatus,
} from '@/types/store'

const setSecurity: CaseReducer<ISettingsReducer, PayloadAction<TSecurity>> = (state, action) => {
  state.data.security = action.payload
}

const setCurrency: CaseReducer<ISettingsReducer, PayloadAction<TCurrency>> = (state, action) => {
  state.data.currency = action.payload
}

const setLanguage: CaseReducer<ISettingsReducer, PayloadAction<TLanguage>> = (state, action) => {
  state.data.language = action.payload
}

const setIsFirstTime: CaseReducer<ISettingsReducer, PayloadAction<boolean>> = (state, action) => {
  state.data.isFirstTime = action.payload
}

const setSurveyInfo: CaseReducer<ISettingsReducer, PayloadAction<TSurveyInfoStatus>> = (state, action) => {
  state.data.surveyInfo.status = action.payload
  state.data.surveyInfo.updatedAt = Date.now()
}

const setSelectNetwork = <T extends TBlockchainServiceKey>(
  state: ISettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { blockchain, network } = action.payload
  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)

  cloneSelectedNetworkByBlockchain[blockchain] = network as any

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const setSelectedNetworkByBlockchain = (state: ISettingsReducer, action: PayloadAction<TSelectedNetworks>) => {
  state.data.selectedNetworkByBlockchain = action.payload
}

const setSelectedNetworkUrl: CaseReducer<
  ISettingsReducer,
  PayloadAction<{ blockchain: TBlockchainServiceKey; url: string; isAutomatic?: boolean }>
> = (state, action) => {
  const { blockchain, url, isAutomatic } = action.payload
  const cloneSelectedNetworkByBlockchain = cloneDeep(state.data.selectedNetworkByBlockchain)

  cloneSelectedNetworkByBlockchain[blockchain].url = url
  cloneSelectedNetworkByBlockchain[blockchain].isAutomatic = isAutomatic

  state.data.selectedNetworkByBlockchain = cloneSelectedNetworkByBlockchain
}

const saveCustomNetwork = <T extends TBlockchainServiceKey>(
  state: ISettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { blockchain, network } = action.payload
  const cloneCustomNetworks = cloneDeep(state.data.customNetworksByBlockchain)

  const findIndex = cloneCustomNetworks[blockchain].findIndex(it => it.id === network.id)
  if (findIndex < 0) {
    cloneCustomNetworks[blockchain].push(network)
  } else {
    const cloneSelectedNetworks = cloneDeep(state.data.selectedNetworkByBlockchain)

    cloneCustomNetworks[blockchain][findIndex] = network

    if (cloneSelectedNetworks[blockchain].id === network.id) {
      cloneSelectedNetworks[blockchain] = network as TSelectedNetworks[T]
      state.data.selectedNetworkByBlockchain = cloneSelectedNetworks
    }
  }

  state.data.customNetworksByBlockchain = cloneCustomNetworks
}

const deleteCustomNetwork = <T extends TBlockchainServiceKey>(
  state: ISettingsReducer,
  action: PayloadAction<{ blockchain: T; network: TNetwork }>
) => {
  const { network, blockchain } = action.payload
  const cloneCustomNetworks = cloneDeep(state.data.customNetworksByBlockchain)
  const cloneSelectedNetwork = cloneDeep(state.data.selectedNetworkByBlockchain)
  const filteredNetworks = cloneCustomNetworks[blockchain].filter(currentNetwork => currentNetwork.id !== network.id)

  cloneCustomNetworks[blockchain] = filteredNetworks as TCustomNetwork[T]

  state.data.customNetworksByBlockchain = cloneCustomNetworks

  if (cloneSelectedNetwork[blockchain].id === network.id) {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
    cloneSelectedNetwork[blockchain] = service.defaultNetwork

    state.data.selectedNetworkByBlockchain = cloneSelectedNetwork
  }
}

const dontShowVoteNeo3SupportUsModalAgain: CaseReducer<ISettingsReducer> = ({ data }) => {
  data.canShowVoteNeo3SupportUsModal = false
}

const setIsOnboardingCompleted: CaseReducer<ISettingsReducer, PayloadAction<boolean>> = (state, action) => {
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
  dontShowVoteNeo3SupportUsModalAgain,
  setSelectedNetworkByBlockchain,
  setIsOnboardingCompleted,
}
