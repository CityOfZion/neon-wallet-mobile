import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { WalletAction, WalletActionsType, WalletReducer, WalletState } from '~/src/types/reducers/wallet'

export class WalletTypeDispatcher extends DispatcherWrapper<WalletActionsType, WalletState, WalletAction> {
  readonly type = 'SET_WALLET_TYPE'

  readonly reducer: WalletReducer = (state, action) => {
    const { walletType } = action

    return this.set(state, { walletType })
  }
}
