import type { TBSServiceName } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkSelector } from './useSettingsSelector'

type TProps = {
  blockchain: TBSServiceName
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
