import {Action} from 'redux'
import {ReducerApplied} from '@simpli/redux-wrapper'
import {WCApprovalDate} from '~src/models/redux/WCApprovalDate'

export declare global {
  type WCActionsType = 'SET_APPROVAL_DATES'

  interface WCState {
    approvalDates: WCApprovalDate[]
  }

  type WCAction = WCState & Action<WCActionsType>

  type WalletConnectReducer = ReducerApplied<WCState, WCAction>
}
