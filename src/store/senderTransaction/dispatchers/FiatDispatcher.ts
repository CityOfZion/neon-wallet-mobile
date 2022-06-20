import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction,
  SenderTransactionReducer,
} from '~/src/types/reducers/sendTransaction'

export class FiatDispatcher extends DispatcherWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  readonly type = 'SET_FIAT'

  readonly reducer: SenderTransactionReducer = (state, action) => {
    const { fiat } = action

    return this.set(state, { fiat })
  }
}
