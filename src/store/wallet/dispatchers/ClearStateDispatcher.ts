import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { WalletActionsType, WalletState, WalletAction, WalletReducer } from '~/src/types/reducers/wallet'
import { Model } from '~src/app/Model'
import { Wallet } from '~src/models/redux/Wallet'

export class ClearStateDispatcher extends DispatcherWrapper<WalletActionsType, WalletState, WalletAction> {
  readonly type = 'CLEAR_STATE_WALLET'

  readonly reducer: WalletReducer = (state, action) => {
    const emptyState = Model.parse<WalletState>(Wallet)
    emptyState.securityPhrase = null // it must be forced because securityPhrase is excluded

    return this.set(state, emptyState)
  }
}
