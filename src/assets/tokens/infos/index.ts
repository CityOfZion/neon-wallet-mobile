import { merge } from 'lodash'

import neo3CommonToken from './neo3/common.json'
import neo3MainnetToken from './neo3/mainnet.json'
import neoLegacyCommonToken from './neoLegacy/common.json'
import neoLegacyMainnetToken from './neoLegacy/mainnet.json'

import { BlockchainServiceKey, IToken, TNetworkType } from '~/src/blockchain'

type TokenByNetwork = Record<TNetworkType, IToken[]>

const castNeo3CommonToken = neo3CommonToken as IToken[]
const castNeo3MainnetToken = neo3MainnetToken as IToken[]
const castNeoLegacyCommonToken = neoLegacyCommonToken as IToken[]
const castNeoLegacyMainnetToken = neoLegacyMainnetToken as IToken[]

const neoLegacyTokensByNetwork: TokenByNetwork = {
  mainnet: merge(castNeoLegacyCommonToken, castNeoLegacyMainnetToken),
  testnet: castNeoLegacyCommonToken,
  custom: [],
}

const neo3TokensByNetwork: TokenByNetwork = {
  mainnet: merge(castNeo3CommonToken, castNeo3MainnetToken),
  testnet: castNeo3CommonToken,
  custom: castNeo3CommonToken,
}

export const tokensByBlockchain: Record<BlockchainServiceKey, TokenByNetwork> = {
  neoLegacy: neoLegacyTokensByNetwork,
  neo3: neo3TokensByNetwork,
}
