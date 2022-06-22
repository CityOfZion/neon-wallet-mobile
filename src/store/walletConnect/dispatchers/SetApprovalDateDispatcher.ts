import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class SetApprovalDateDispatcher extends DispatcherWrapper<WCActionsType, WCState, WCAction> {
  readonly type = 'SET_APPROVAL_DATES'
  readonly reducer: WalletConnectReducer = (state, action) => {
    const { approvalDates } = action
    return this.set(state, { approvalDates })
  }
}
