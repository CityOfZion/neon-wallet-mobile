import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { WalletActionsType, WalletState, WalletAction, WalletReducer } from '~/src/types/reducers/wallet'

export class NameDispatcher extends DispatcherWrapper<WalletActionsType, WalletState, WalletAction> {
  readonly type = 'SET_NAME_WALLET'

  readonly reducer: WalletReducer = (state, action) => {
    const { name } = action
    return this.set(state, { name })
  }
}
