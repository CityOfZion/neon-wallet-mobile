import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {WCApprovalDate} from '~src/models/redux/WCApprovalDate'

export declare global {
  type WCActionsType = 'SET_APPROVAL_DATES' | 'SET_DAPP_CONNECTION_START'

  interface WCState {
    approvalDates: WCApprovalDate[]
    dappConnectionStart: boolean
  }

  type WCAction = WCState & Action<WCActionsType>

  type WalletConnectReducer = ReducerApplied<WCState, WCAction>
}
