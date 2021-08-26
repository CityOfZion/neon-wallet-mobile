import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class TokenAssetsDispatcher extends DispatcherWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_TOKENASSETS_ACCOUNT'

  readonly reducer: AccountReducer = (state, action) => {
    const {tokenAssets} = action

    return this.set(state, {tokenAssets})
  }
}
