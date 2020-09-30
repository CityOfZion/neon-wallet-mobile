import {DispatcherWrapper} from '@simpli/redux-wrapper'

import {Model} from '~src/app/Model'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'

export class ClearStateDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'CLEAR_STATE_SENDER_TRANSACTION'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const emptyState = Model.parse<SenderTransactionState>(SenderTransaction)

    return this.set(state, emptyState)
  }
}
