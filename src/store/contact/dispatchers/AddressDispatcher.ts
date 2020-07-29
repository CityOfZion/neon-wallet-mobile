import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class AddressDispatcher extends DispatcherWrapper<
  ContactType,
  ContactState,
  ContactAction
  > {
  readonly type = 'SET_ADDRESS'

  readonly reducer: ContactReducer = (state, action) => {
    const {name} = action

    return this.set(state, {name})
  }
}
