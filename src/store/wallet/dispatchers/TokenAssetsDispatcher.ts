import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { WalletAction, WalletActionsType, WalletReducer, WalletState } from '~/src/types/reducers/wallet'

export class TokenAssetsDispatcher extends DispatcherWrapper<WalletActionsType, WalletState, WalletAction> {
  readonly type = 'SET_TOKENASSETS_WALLET'

  readonly reducer: WalletReducer = (state, action) => {
    const { tokenAssets } = action

    return this.set(state, { tokenAssets })
  }
}
