import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import type { TBlockchainServiceKey } from '@/types/blockchain'

export function getUtilityMigrations() {
  return {
    1: (state: any) => {
      return {
        ...state,
        data: {
          ...state.data,
          lastIndexesByWallet: {},
        },
      }
    },
    2: async (state: any) => {
      const neoLegacyService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neoLegacy

      const migrationsNeo3 = Object.entries(state.data.migrationsNeo3 || {}).reduce((previous, actual) => {
        const key = neoLegacyService.tokenService.normalizeHash(actual[0])

        previous[key] = actual[1]

        return previous
      }, {} as any)

      const hiddenTokensByBlockchain = Object.entries(state.data.hiddenTokensByBlockchain).reduce(
        (previous, actual) => {
          const blockchain = actual[0] as TBlockchainServiceKey
          const tokens = actual[1] as string[] | undefined
          const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

          previous[blockchain] = tokens?.map(token => service.tokenService.normalizeHash(token)) || []

          return previous
        },
        {} as any
      )

      return {
        ...state,
        data: {
          ...state.data,
          migrationsNeo3,
          hiddenTokensByBlockchain,
        },
      }
    },
    3: (state: any) => {
      delete state.data.migrationsNeo3

      return state
    },
  }
}
