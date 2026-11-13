import type { TBSServiceName } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkSelector } from './useSettingsSelector'

async function fetchBlockHeight(blockchain: TBSServiceName) {
  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const blockHeight = await blockchainService.blockchainDataService.getBlockHeight()
  return blockHeight
}

export const useBlockHeightQuery = (blockchain: TBSServiceName) => {
  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)

  return useQuery({
    queryKey: ['block-height', blockchain, selectedNetwork],
    queryFn: fetchBlockHeight.bind(null, blockchain),
    staleTime: 0,
  })
}
