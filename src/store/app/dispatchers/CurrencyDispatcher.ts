import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class CurrencyDispatcher extends DispatcherWrapper<
  AppType,
  AppState,
  AppAction
> {
  readonly type = 'SET_CURRENCY'

  readonly reducer: AppReducer = (state, action) => {
    const {currency} = action

    return this.set(state, {currency})
  }
}
