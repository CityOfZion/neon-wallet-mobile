import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'
import { TBlockchainServiceKey } from '../types/blockchain'

type Props = {
  blockchain: TBlockchainServiceKey | 'all'
}

export const useLocalTokensUtils = () => {
  const bsAggregator = useSelector((state: RootState) => state.blockchain.bsAggregator)

  const getTokenBySymbol = useCallback((symbol: string, blockchain: TBlockchainServiceKey) => {
    const service = bsAggregator.getBlockchainByName(blockchain)
    return service.tokens.find(token => token.symbol === symbol)
  }, [])

  return {
    getTokenBySymbol,
  }
}

export const useLocalTokens = ({ blockchain }: Props) => {
  const bsAggregator = useSelector((state: RootState) => state.blockchain.bsAggregator)

  const tokens = useMemo(() => {
    if (blockchain === 'all') {
      return bsAggregator.blockchainServices.map(service => service.tokens).flat()
    }

    return bsAggregator.getBlockchainByName(blockchain).tokens
  }, [blockchain])

  return { tokens }
}
