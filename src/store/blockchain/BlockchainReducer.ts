import { BSAggregator, NetworkType } from '@cityofzion/blockchain-service'
import { BSEthereum } from '@cityofzion/bs-ethereum'
import { BSNeoLegacy } from '@cityofzion/bs-neo-legacy'
import { BSNeo3 } from '@cityofzion/bs-neo3'
import { CaseReducer, PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Constants from 'expo-constants'

import { RootState } from '../RootStore'

import { blockchainConfig } from '~/src/config/BlockchainConfig'
import { TBlockchainServiceKey } from '~/src/types/blockchain'
import { BlockchainState } from '~/src/types/store'

type TUpdateBSAggregatorNetwork = {
  type: NetworkType
  url?: string
  blockchain: TBlockchainServiceKey
}

export const blockchainReducerName = 'blockchainReducer'

const initialState = {
  bsAggregator: new BSAggregator<TBlockchainServiceKey>({
    neo3: new BSNeo3('neo3', { type: blockchainConfig.defaultSelectedNetworks.neo3.type }),
    neoLegacy: new BSNeoLegacy('neoLegacy', { type: blockchainConfig.defaultSelectedNetworks.neoLegacy.type }),
    ethereum: new BSEthereum(
      'ethereum',
      { type: blockchainConfig.defaultSelectedNetworks.ethereum.type },
      Constants.manifest?.extra?.BITQUERY_API_KEY ?? ''
    ),
  }),
} as BlockchainState

const setInitialBSAggregator = createAsyncThunk('blockchain/setInitalState', async (_, { getState }) => {
  const state = getState() as RootState
  return state.settings.selectedBlockchainNetworks
})

const updateBSAggregatorNetwork: CaseReducer<BlockchainState, PayloadAction<TUpdateBSAggregatorNetwork>> = (
  state,
  action
) => {
  const { blockchain, type } = action.payload

  const service = state.bsAggregator.getBlockchainByName(blockchain)
  if (service.network.type === type) return

  service.setNetwork({ type })
}

const BlockchainReducer = createSlice({
  name: blockchainReducerName,
  initialState,
  reducers: {
    updateBSAggregatorNetwork,
  },
  extraReducers(builder) {
    builder.addCase(setInitialBSAggregator.fulfilled, (state, action) => {
      const selectedBlockchainNetworks = action.payload
      Object.entries(selectedBlockchainNetworks).forEach(([blockchain, network]) => {
        const service = state.bsAggregator.getBlockchainByName(blockchain as TBlockchainServiceKey)
        service.setNetwork({ type: network.type })
      })
    })
  },
})

export const blockchainReducerActions = {
  ...BlockchainReducer.actions,
  setInitialBSAggregator,
}

export default BlockchainReducer.reducer
