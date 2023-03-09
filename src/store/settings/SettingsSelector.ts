import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../RootStore'

export const hasCustomSelector = createSelector(
  (state: RootState) => state.settings.selectedBlockchainNetworks,
  state => Object.values(state).some(network => network.type === 'custom')
)
