import { useCallback } from 'react'

import type { TBSNetworkId } from '@cityofzion/blockchain-service'
import type { TBSServiceName } from '@cityofzion/bs-multichain'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkByBlockchainSelector, useSelectedNetworkSelector } from './useSettingsSelector'

import type { TBaseOptions, TPingNetwork } from '@/types/query'

const buildPingNetworksQueryKey = (blockchain: TBSServiceName, id: TBSNetworkId) => {
  return ['ping-networks', blockchain, id]
}

const pingNetworks = async (blockchain: TBSServiceName): Promise<TPingNetwork[]> => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  const promises = service.networkUrls.map(async url => {
    try {
      return await service.pingNetwork(url)
    } catch {
      return { height: undefined, latency: undefined, url }
    }
  })

  const data = await Promise.all(promises)

  return data.sort((a, b) => {
    const latencyA = a.latency
    const latencyB = b.latency
    const isLatencyAInvalid = typeof latencyA !== 'number' || isNaN(latencyA)
    const isLatencyBInvalid = typeof latencyB !== 'number' || isNaN(latencyB)

    if (isLatencyAInvalid && isLatencyBInvalid) return 0
    if (isLatencyAInvalid) return 1
    if (isLatencyBInvalid) return -1

    return latencyA - latencyB
  })
}

export const usePingNetworks = (blockchain: TBSServiceName, queryOptions?: TBaseOptions<TPingNetwork[]>) => {
  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)

  return useQuery({
    queryKey: buildPingNetworksQueryKey(blockchain, selectedNetwork.id),
    queryFn: pingNetworks.bind(null, blockchain),
    ...queryOptions,
  })
}

export const useLazyPingNetworks = () => {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchainRef } = useSelectedNetworkByBlockchainSelector()

  const getPingNetworks = useCallback(
    async (blockchain: TBSServiceName) => {
      const selectedNetwork = selectedNetworkByBlockchainRef.current[blockchain]

      return await queryClient.ensureQueryData({
        queryKey: buildPingNetworksQueryKey(blockchain, selectedNetwork.id),
        queryFn: pingNetworks.bind(null, blockchain),
        staleTime: 0,
      })
    },
    [queryClient, selectedNetworkByBlockchainRef]
  )

  return { getPingNetworks }
}
