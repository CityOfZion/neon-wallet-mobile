import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class NameDispatcher extends DispatcherWrapper<
  ContactType,
  ContactState,
  ContactAction
> {
  readonly type = 'SET_NAME'

  readonly reducer: ContactReducer = (state, action) => {
    const {name} = action

    return this.set(state, {name})
  }
}
