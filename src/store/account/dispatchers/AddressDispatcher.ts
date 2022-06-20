import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  AccountAction,
  AccountActionsType,
  AccountReducer,
  AccountState,
} from '~/src/types/reducers/account'

export class AddressDispatcher extends DispatcherWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_ADDRESS'

  readonly reducer: AccountReducer = (state, action) => {
    const { address } = action

    return this.set(state, { address })
  }
}
