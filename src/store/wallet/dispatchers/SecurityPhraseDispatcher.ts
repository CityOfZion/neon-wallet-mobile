import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class SecurityPhraseDispatcher extends DispatcherWrapper<
  WalletType,
  WalletState,
  WalletAction
> {
  readonly type = 'SET_SECURITY_PHRASE'

  readonly reducer: WalletReducer = (state, action) => {
    const {securityPhrase} = action

    return this.set(state, {securityPhrase})
  }
}
