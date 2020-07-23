import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class SrcIconDispatcher extends DispatcherWrapper<
  AccountType,
  AccountState,
  AccountAction
> {
  readonly type = 'SET_SRC_ICON'

  readonly reducer: AccountReducer = (state, action) => {
    const {srcIcon} = action

    return this.set(state, {srcIcon})
  }
}
