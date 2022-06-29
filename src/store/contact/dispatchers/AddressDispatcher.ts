import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { ContactAction, ContactActionsType, ContactReducer, ContactState } from '~/src/types/reducers/contact'

export class AddressDispatcher extends DispatcherWrapper<ContactActionsType, ContactState, ContactAction> {
  readonly type = 'SET_ADDRESSES'

  readonly reducer: ContactReducer = (state, action) => {
    const { addresses } = action

    return this.set(state, { addresses })
  }
}
