import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class CurrencyDispatcher extends DispatcherWrapper<
  SettingsType,
  SettingsState,
  SettingsAction
> {
  readonly type = 'SET_CURRENCY'

  readonly reducer: SettingsReducer = (state, action) => {
    const {currency} = action

    return this.set(state, {currency})
  }
}
