import { DispatcherWrapper } from '@simpli/redux-wrapper'

export class AddressDispatcher extends DispatcherWrapper<ContactActionsType, ContactState, ContactAction> {
  readonly type = 'SET_ADDRESSES'

  readonly reducer: ContactReducer = (state, action) => {
    const { addresses } = action

    return this.set(state, { addresses })
  }
}
