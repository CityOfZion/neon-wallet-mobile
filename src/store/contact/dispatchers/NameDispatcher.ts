import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { ContactAction, ContactActionsType, ContactReducer, ContactState } from '~/src/types/reducers/contact'

export class NameDispatcher extends DispatcherWrapper<ContactActionsType, ContactState, ContactAction> {
  readonly type = 'SET_NAME'

  readonly reducer: ContactReducer = (state, action) => {
    const { name } = action

    return this.set(state, { name })
  }
}
