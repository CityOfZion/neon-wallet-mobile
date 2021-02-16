import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class NameDispatcher extends DispatcherWrapper<
  WalletActionsType,
  WalletState,
  WalletAction
> {
  readonly type = 'SET_NAME_WALLET'

  readonly reducer: WalletReducer = (state, action) => {
    const {name} = action
    return this.set(state, {name})
  }
}
