import { useMemo } from 'react'

import type { TBSServiceName } from '@cityofzion/bs-multichain'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

type Props = {
  blockchain: TBSServiceName | 'all'
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
