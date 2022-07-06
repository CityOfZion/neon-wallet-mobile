import { DispatcherWrapper } from '@simpli/redux-wrapper'

import { NetworkAction, NetworkActionsType, NetworkState, NetworkReducer } from '~/src/types/reducers/network'

export class SetIsConnectedDispatcher extends DispatcherWrapper<NetworkActionsType, NetworkState, NetworkAction> {
  readonly type = 'SET_IS_CONNECTED'

  readonly reducer: NetworkReducer = (state, action) => {
    const { isConnected } = action

    return this.set(state, { isConnected })
  }
}
