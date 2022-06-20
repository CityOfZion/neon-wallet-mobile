import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  AccountAction,
  AccountActionsType,
  AccountReducer,
  AccountState,
} from '~/src/types/reducers/account'

export class IdWalletDispatcher extends DispatcherWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_ID_WALLET'

  readonly reducer: AccountReducer = (state, action) => {
    const { idWallet } = action

    return this.set(state, { idWallet })
  }
}
