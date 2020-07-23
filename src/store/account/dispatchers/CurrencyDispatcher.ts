import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class CurrencyDispatcher extends DispatcherWrapper<
  AccountType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_CURRENCY'

  readonly reducer: AccountReducer = (state, action) => {
    const {currency} = action

    return this.set(state, {currency})
  }
}
