import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class AddressDispatcher extends DispatcherWrapper<
  ContactActionsType,
  ContactState,
  ContactAction
> {
  readonly type = 'SET_ADDRESS'

  readonly reducer: ContactReducer = (state, action) => {
    const {address} = action

    return this.set(state, {address})
  }
}
