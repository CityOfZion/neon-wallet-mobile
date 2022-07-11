import { useMemo } from 'react'

import { BlockchainServiceKey, blockchainServices, getAllTokens } from '../blockchain'
import { TokenHelper } from '../helpers/TokenHelper'

type Props = {
  blockchain: BlockchainServiceKey | 'all'
}

export const useTokens = ({ blockchain }: Props) => {
  const tokens = useMemo(() => {
    if (blockchain === 'all') {
      return TokenHelper.toTokenAsset(getAllTokens())
    }

    return TokenHelper.toTokenAsset(blockchainServices[blockchain].tokens)
  }, [blockchain])

  return tokens
}
