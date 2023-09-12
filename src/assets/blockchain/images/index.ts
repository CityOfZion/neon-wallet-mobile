import { TBlockchainServiceKey } from '~/src/types/blockchain'

export type TBlockchainImageColor = 'white' | 'default'

export const blockchainIconsByBlockchain: Record<TBlockchainServiceKey, Record<TBlockchainImageColor, any>> = {
  neo3: {
    default: require('./neo3_default.png'),
    white: require('./neo3_white.png'),
  },
  neoLegacy: {
    default: require('./neo_legacy_default.png'),
    white: require('./neo_legacy_white.png'),
  },
  ethereum: {
    default: require('./ethereum_default.png'),
    white: require('./ethereum_white.png'),
  },
}
