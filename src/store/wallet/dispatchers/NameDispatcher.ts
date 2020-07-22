import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class NameDispatcher extends DispatcherWrapper<
  WalletType,
  WalletState,
  WalletAction
> {
  readonly type = 'SET_NAME'

  readonly reducer: WalletReducer = (state, action) => {
    const {name} = action

    return this.set(state, {name})
  }
}
