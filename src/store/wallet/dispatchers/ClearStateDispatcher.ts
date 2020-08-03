import {DispatcherWrapper} from '@simpli/redux-wrapper'

import {Model} from '~src/app/Model'
import {Wallet} from '~src/models/redux/Wallet'

export class ClearStateDispatcher extends DispatcherWrapper<
  WalletActionsType,
  WalletState,
  WalletAction
> {
  readonly type = 'CLEAR_STATE'

  readonly reducer: WalletReducer = (state, action) => {
    return this.set(state, Model.parse<WalletState>(Wallet))
  }
}
