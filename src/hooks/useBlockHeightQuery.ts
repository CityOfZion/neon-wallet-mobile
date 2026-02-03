import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkSelector } from './useSettingsSelector'

import type { TBlockchainServiceKey } from '@/types/blockchain'

async function fetchBlockHeight(blockchain: TBlockchainServiceKey) {
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const blockHeight = await blockchainService.blockchainDataService.getBlockHeight()
  return blockHeight
}

export const useBlockHeightQuery = (blockchain: TBlockchainServiceKey) => {
  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)

  return useQuery({
    queryKey: ['block-height', blockchain, selectedNetwork],
    queryFn: fetchBlockHeight.bind(null, blockchain),
    staleTime: 0,
  })
}
