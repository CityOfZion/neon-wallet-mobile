import { useCallback, useMemo } from 'react'

import { BlockchainServiceKey, blockchainServices, getAllTokens } from '../blockchain'

type Props = {
  blockchain: BlockchainServiceKey | 'all'
}

export const useTokens = ({ blockchain }: Props) => {
  const tokens = useMemo(() => {
    if (blockchain === 'all') {
      return getAllTokens()
    }

    return blockchainServices[blockchain].tokens
  }, [blockchain])

  const getTokenBySymbol = useCallback(
    (symbol: string) => {
      return tokens.find(token => token.symbol === symbol)
    },
    [tokens]
  )

  return { tokens, getTokenBySymbol }
}
