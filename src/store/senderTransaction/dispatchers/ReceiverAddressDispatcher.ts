import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction,
  SenderTransactionReducer,
} from '~/src/types/reducers/sendTransaction'

export class ReceiverAddressDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_RECEIVER_ADDRESS'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const { receiverAddress } = action

    return this.set(state, { receiverAddress })
  }
}
