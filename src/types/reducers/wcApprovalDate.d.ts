import { Action } from 'redux'
import { ReducerApplied } from '@simpli/redux-wrapper'
import { WCApprovalDate } from '~src/models/redux/WCApprovalDate'

export type WCActionsType = 'SET_APPROVAL_DATES' | 'SET_DAPP_CONNECTION_START'

export interface WCState {
  approvalDates: WCApprovalDate[]
  dappConnectionStart: boolean
}

export type WCAction = WCState & Action<WCActionsType>

export type WalletConnectReducer = ReducerApplied<WCState, WCAction>
