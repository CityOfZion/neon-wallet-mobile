import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { WalletAction, WalletActionsType, WalletReducer, WalletState } from '~/src/types/reducers/wallet'

export class SecurityPhraseDispatcher extends DispatcherWrapper<WalletActionsType, WalletState, WalletAction> {
  readonly type = 'SET_SECURITY_PHRASE'

  readonly reducer: WalletReducer = (state, action) => {
    const { securityPhrase } = action

    return this.set(state, { securityPhrase })
  }
}
