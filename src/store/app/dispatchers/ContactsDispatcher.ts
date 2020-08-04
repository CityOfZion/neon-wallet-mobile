import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class ContactsDispatcher extends DispatcherWrapper<
  AppActionsType,
  AppState,
  AppAction
> {
  readonly type = 'SET_CONTACTS'

  readonly reducer: AppReducer = (state, action) => {
    const {contacts} = action

    return this.set(state, {contacts})
  }
}
