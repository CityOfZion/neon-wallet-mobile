import { createListenerMiddleware } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { settingsReducerActions } from '../reducers/settings'

import type { TRootState } from '@/types/redux'

export function getNetworkMiddleware() {
  const networkListenerMiddleware = createListenerMiddleware()
  const services = Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName)

  networkListenerMiddleware.startListening({
    predicate: action =>
      settingsReducerActions.setSelectNetwork.match(action) ||
      settingsReducerActions.setSelectedNetworkByBlockchain.match(action) ||
      settingsReducerActions.setSelectedNetworkUrl.match(action) ||
      settingsReducerActions.saveCustomNetwork.match(action) ||
      settingsReducerActions.deleteCustomNetwork.match(action) ||
      (action.type === REHYDRATE && action.key === 'settingsReducer'),
    effect: (_action, listenerApi) => {
      const state = listenerApi.getState() as TRootState
      const selectedNetworkByBlockchain = state.settings?.data?.selectedNetworkByBlockchain

      if (!selectedNetworkByBlockchain) return

      services.forEach(service => {
        service.setNetwork(selectedNetworkByBlockchain[service.name])
      })
    },
  })

  return networkListenerMiddleware.middleware
}
