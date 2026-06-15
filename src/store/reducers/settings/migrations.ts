import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { LanguageHelper } from '@/helpers/LanguageHelper'

export function getSettingsMigrations() {
  return {
    0: async (state: any) => {
      return {
        ...state,
        customNetworks: undefined,
        currency: CurrencyHelper.defaultCurrency,
        customNetworksByBlockchain: {
          ...state.customNetworks,
          neox: [],
        },
        selectedNetworkByBlockchain: {
          ...state.selectedNetworkByBlockchain,
          neox: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neox.defaultNetwork,
        },
      }
    },
    1: (state: any) => {
      return {
        ...state,
        customNetworksByBlockchain: {
          polygon: [],
          ...state.customNetworksByBlockchain,
        },
        selectedNetworkByBlockchain: {
          ...state.selectedNetworkByBlockchain,
          polygon: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
        },
      }
    },
    2: (state: any) => {
      return {
        ...state,
        customNetworksByBlockchain: {
          base: [],
          arbitrum: [],
          ...state.customNetworksByBlockchain,
        },
        selectedNetworkByBlockchain: {
          ...state.selectedNetworkByBlockchain,
          base: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.base.defaultNetwork,
          arbitrum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.arbitrum.defaultNetwork,
        },
      }
    },
    3: (state: any) => {
      return {
        data: state,
        _persist: state._persist,
      }
    },
    4: (state: any) => {
      return {
        ...state,
        data: {
          ...state.data,
          selectedNetworkByBlockchain: {
            ...state.data.selectedNetworkByBlockchain,
            polygon: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
          },
        },
      }
    },
    5: (state: any) => {
      const newSecurity = state.data.security === 'Device Default' ? 'device' : state.data.security.toLowerCase()

      return {
        ...state,
        data: {
          ...state.data,
          language: LanguageHelper.defaultLanguage,
          security: { type: newSecurity },
        },
      }
    },
    6: (state: any) => ({
      ...state,
      data: {
        ...state.data,
        canShowVoteNeo3SupportUsModal: true,
      },
    }),
    7: (state: any) => ({
      ...state,
      data: {
        ...state.data,
        selectedNetworkByBlockchain: {
          neo3: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3.defaultNetwork,
          neoLegacy: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neoLegacy.defaultNetwork,
          ethereum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.ethereum.defaultNetwork,
          neox: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neox.defaultNetwork,
          polygon: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
          base: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.base.defaultNetwork,
          arbitrum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.arbitrum.defaultNetwork,
        },
      },
    }),
    8: (state: any) => ({
      ...state,
      data: {
        ...state.data,
        selectedNetworkByBlockchain: {
          ...state.data.selectedNetworkByBlockchain,
          neoLegacy: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neoLegacy.defaultNetwork,
        },
      },
    }),
    9: (state: any) => {
      delete state.data.isFirstTimeInMigrationNeo3Screen

      return state
    },
    10: (state: any) => ({
      ...state,
      data: {
        ...state.data,
        selectedNetworkByBlockchain: {
          ...state.data.selectedNetworkByBlockchain,
          neox: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neox.defaultNetwork,
        },
      },
    }),
    11: (state: any) => ({
      ...state,
      data: {
        ...state.data,
        isOnboardingCompleted: true,
        customNetworksByBlockchain: {
          ...state.data.customNetworksByBlockchain,
          solana: [],
        },
        selectedNetworkByBlockchain: {
          ...state.data.selectedNetworkByBlockchain,
          solana: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.solana.defaultNetwork,
        },
        surveyInfo: { status: 'not-submitted', updatedAt: Date.now() },
      },
    }),
    12: (state: any) => ({
      ...state,
      data: {
        ...state.data,
        customNetworksByBlockchain: {
          ...state.data.customNetworksByBlockchain,
          ethereum: [],
          polygon: [],
          bitcoin: [],
          stellar: [],
        },
        selectedNetworkByBlockchain: {
          ...state.data.selectedNetworkByBlockchain,
          ethereum: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.ethereum.defaultNetwork,
          polygon: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.polygon.defaultNetwork,
          bitcoin: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.bitcoin.defaultNetwork,
          stellar: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar.defaultNetwork,
        },
        canShowNeo3VoteSupportUsModal: true,
      },
    }),
  }
}
