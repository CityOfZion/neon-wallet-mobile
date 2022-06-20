import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  AccountAction,
  AccountActionsType,
  AccountReducer,
  AccountState,
} from '~/src/types/reducers/account'

export class BlockchainDispatcher extends DispatcherWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_BLOCKCHAIN_ACCOUNT'

  readonly reducer: AccountReducer = (state, action) => {
    const { blockchain } = action

    return this.set(state, { blockchain })
  }
}
