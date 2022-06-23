import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction,
  SenderTransactionReducer,
} from '~/src/types/reducers/sendTransaction'

export class TokenDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_TOKEN'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const { token } = action

    return this.set(state, { token })
  }
}
