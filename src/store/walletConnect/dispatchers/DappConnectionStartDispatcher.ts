import {DispatcherWrapper} from '@simpli/redux-wrapper'

export class DappConnectionStartDispatcher extends DispatcherWrapper<
  WCActionsType,
  WCState,
  WCAction
> {
  readonly type = 'SET_DAPP_CONNECTION_START'
  readonly reducer: WalletConnectReducer = (state, action) => {
    const {dappConnectionStart} = action
    return this.set(state, {dappConnectionStart})
  }
}
