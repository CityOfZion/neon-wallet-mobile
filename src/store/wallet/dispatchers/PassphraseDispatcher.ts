import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  WalletAction,
  WalletActionsType,
  WalletReducer,
  WalletState,
} from '~/src/types/reducers/wallet'

export class PassphraseDispatcher extends DispatcherWrapper<
  WalletActionsType,
  WalletState,
  WalletAction
> {
  readonly type = 'SET_PASSPHRASE'

  readonly reducer: WalletReducer = (state, action) => {
    const { passphrase } = action

    return this.set(state, { passphrase })
  }
}
