import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo'
import { ReducerWrapper } from '@simpli/redux-wrapper'

import { SetIsConnectedDispatcher } from './dispatchers/SetIsConnectedDispatcher'

import { NetworkAction, NetworkActionsType, NetworkState } from '~/src/types/reducers/network'
import { SyncAction } from '~/src/types/reducers/root'

export class NetworkReducer extends ReducerWrapper<NetworkActionsType, NetworkState, NetworkAction> {
  protected initialState: NetworkState = {
    isConnected: undefined,
  }

  protected dispatchers = [SetIsConnectedDispatcher]

  actions = {
    watchConnection: (): SyncAction<NetInfoSubscription> => {
      return dispatch => {
        const unsubscribe = NetInfo.addEventListener(({ isInternetReachable }) => {
          dispatch(this.commit('SET_IS_CONNECTED', { isConnected: isInternetReachable ?? undefined }))
        })

        return unsubscribe
      }
    },
  }
}
