import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class TokenAssetsDispatcher extends DispatcherWrapper<
  WalletActionsType,
  WalletState,
  WalletAction
> {
  readonly type = 'SET_TOKENASSETS_WALLET'

  readonly reducer: WalletReducer = (state, action) => {
    const {tokenAssets} = action

    return this.set(state, {tokenAssets})
  }
}
