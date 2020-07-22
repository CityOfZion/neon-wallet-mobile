import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class PassphraseDispatcher extends DispatcherWrapper<
  WalletType,
  WalletState,
  WalletAction
> {
  readonly type = 'SET_PASSPHRASE'

  readonly reducer: WalletReducer = (state, action) => {
    const {passphrase} = action

    return this.set(state, {passphrase})
  }
}
