import { useMemo } from 'react'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type Props = {
  blockchain: TBlockchainServiceKey | 'all'
}

export const useLocalTokens = ({ blockchain }: Props) => {
  const tokens = useMemo(() => {
    if (blockchain === 'all') {
      return Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).flatMap(service =>
        service.tokens.map(token => ({ ...token, blockchain: service.name }))
      )
    }

    return BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain].tokens.map(token => ({
      ...token,
      blockchain,
    }))
  }, [blockchain])

  return { tokens }
}
