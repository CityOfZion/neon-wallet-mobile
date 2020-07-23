import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class BalanceDispatcher extends DispatcherWrapper<
  AccountType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_BALANCE'

  readonly reducer: AccountReducer = (state, action) => {
    const {balance} = action

    return this.set(state, {balance})
  }
}
