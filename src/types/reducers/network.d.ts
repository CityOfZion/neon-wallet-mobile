import { ReducerApplied } from '@simpli/redux-wrapper'
import { Action } from 'redux'

export type NetworkActionsType = 'SET_IS_CONNECTED'

export interface NetworkState {
  isConnected?: boolean
}

export type NetworkAction = NetworkState & Action<NetworkActionsType>

export type NetworkReducer = ReducerApplied<NetworkState, NetworkAction>
