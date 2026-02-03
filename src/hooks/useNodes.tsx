import { useCallback } from 'react'

import type { TBSNetworkId } from '@cityofzion/blockchain-service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkByBlockchainSelector, useSelectedNetworkSelector } from './useSettingsSelector'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TBaseOptions, TNode } from '@/types/query'

const buildNodesQueryKey = (blockchain: TBlockchainServiceKey, id: TBSNetworkId) => {
  return ['nodes', blockchain, id]
}

const pingNodes = async (blockchain: TBlockchainServiceKey): Promise<TNode[]> => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  const promises = service.rpcNetworkUrls.map(async url => {
    try {
      return await service.pingNode(url)
    } catch {
      return { height: undefined, latency: undefined, url }
    }
  })

  const data = await Promise.all(promises)

  return data.sort((a, b) => {
    // Prioritize successful requests over failed ones
    if (a && !b) return -1
    if (!a && b) return 1

    // If both failed, maintain original order
    if (!a && !b) return 0

    // Both successful - sort by latency (ascending)
    const latencyA = a?.latency ?? Infinity
    const latencyB = b?.latency ?? Infinity

    return latencyA - latencyB
  })
}

export const usePingNodes = (blockchain: TBlockchainServiceKey, queryOptions?: TBaseOptions<TNode[]>) => {
  const { selectedNetwork } = useSelectedNetworkSelector(blockchain)

  return useQuery({
    queryKey: buildNodesQueryKey(blockchain, selectedNetwork.id),
    queryFn: pingNodes.bind(null, blockchain),
    ...queryOptions,
  })
}

export const useLazyPingNodes = () => {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchainRef } = useSelectedNetworkByBlockchainSelector()

  const getPingNodes = useCallback(
    async (blockchain: TBlockchainServiceKey) => {
      const selectedNetwork = selectedNetworkByBlockchainRef.current[blockchain]

      return await queryClient.ensureQueryData({
        queryKey: buildNodesQueryKey(blockchain, selectedNetwork.id),
        queryFn: pingNodes.bind(null, blockchain),
        staleTime: 0,
      })
    },
    [queryClient, selectedNetworkByBlockchainRef]
  )

  return { getPingNodes }
}
