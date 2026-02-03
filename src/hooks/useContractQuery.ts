import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkSelector } from './useSettingsSelector'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  blockchain: TBlockchainServiceKey
  hash: string
}

export const useContractQuery = ({ blockchain, hash }: TProps) => {
  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)

  const query = useQuery({
    queryKey: ['contract', selectedNetwork, blockchain, hash],
    queryFn: async () => {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
      return service.blockchainDataService.getContract(hash)
    },
    gcTime: Infinity,
    staleTime: Infinity,
  })

  return query
}
