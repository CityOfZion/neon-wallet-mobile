import { createSlice, CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { NetworkState } from '~/src/types/reducers/network'

export const networkReducername = 'networkReducer'

interface INetworkReducer extends NetworkState {}

const initialState: INetworkReducer = {
  isConnected: undefined,
} as INetworkReducer

const setIsConnected: CaseReducer<INetworkReducer, PayloadAction<boolean>> = (state, action) => {
  const isConnected = action.payload
  state.isConnected = isConnected
}

const NetworkReducer = createSlice({
  initialState,
  name: networkReducername,
  reducers: {
    setIsConnected,
  },
})

export const networkReducerActions = NetworkReducer.actions
export default NetworkReducer.reducer
