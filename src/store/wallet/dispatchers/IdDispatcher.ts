import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { WalletActionsType, WalletState, WalletAction, WalletReducer } from '~/src/types/reducers/wallet'

export class IdDispatcher extends DispatcherWrapper<WalletActionsType, WalletState, WalletAction> {
  readonly type = 'SET_ID'

  readonly reducer: WalletReducer = (state, action) => {
    const { id } = action

    return this.set(state, { id })
  }
}
