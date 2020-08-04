import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class BackgroundDispatcher extends DispatcherWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_BACKGROUND_COLOR'

  readonly reducer: AccountReducer = (state, action) => {
    const {backgroundColor} = action

    return this.set(state, {backgroundColor})
  }
}
