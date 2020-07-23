import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class IdWalletDispatcher extends DispatcherWrapper<
  AccountType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_ID_WALLET'

  readonly reducer: AccountReducer = (state, action) => {
    const {idWallet} = action

    return this.set(state, {idWallet})
  }
}
