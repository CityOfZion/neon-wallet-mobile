import {DispatcherWrapper} from '@simpli/redux-wrapper'

import {Model} from '~src/app/Model'
import {Account} from '~src/models/redux/Account'

export class ClearStateDispatcher extends DispatcherWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  readonly type = 'CLEAR_STATE_ACCOUNT'

  readonly reducer: AccountReducer = (state, action) => {
    return this.set(state, Model.parse<AccountState>(Account))
  }
}
