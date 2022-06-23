import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class SecurityDispatcher extends DispatcherWrapper<SettingsActionsType, SettingsState, SettingsAction> {
  readonly type = 'SET_SECURITY'

  readonly reducer: SettingsReducer = (state, action) => {
    const { security } = action
    return this.set(state, { security })
  }
}
