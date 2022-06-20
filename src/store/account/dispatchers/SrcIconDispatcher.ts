import { DispatcherWrapper } from '@simpli/redux-wrapper'

import {
  AccountAction,
  AccountActionsType,
  AccountReducer,
  AccountState,
} from '~/src/types/reducers/account'

export class SrcIconDispatcher extends DispatcherWrapper<
  AccountActionsType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_SRC_ICON'

  readonly reducer: AccountReducer = (state, action) => {
    const { srcIcon } = action

    return this.set(state, { srcIcon })
  }
}
