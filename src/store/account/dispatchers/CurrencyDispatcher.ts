import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class CurrencyDispatcher extends DispatcherWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_CURRENCY'

  readonly reducer: AccountReducer = (state, action) => {
    const {currency} = action

    return this.set(state, {currency})
  }
}
