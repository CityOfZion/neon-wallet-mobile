import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction,
  SenderTransactionReducer,
} from '~/src/types/reducers/sendTransaction'

export class SenderAddressDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_SENDER_ADDRESS'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const { senderAddress } = action

    return this.set(state, { senderAddress })
  }
}
