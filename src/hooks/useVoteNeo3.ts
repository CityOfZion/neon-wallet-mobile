import { useCallback, useMemo } from 'react'

import type { BSNeo3 } from '@cityofzion/bs-neo3'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { NumberHelper } from '@/helpers/NumberHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'

import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import type { TUseBalanceResult } from '@/types/query'
import type { TAccount } from '@/types/store'

type TBuildVoteNeo3GetCandidatesToVoteQueryKeyParams = {
  neo3Network: TNetwork
}

type TBuildVoteNeo3GetVoteDetailsByAddressQueryKeyParams = {
  neo3Network: TNetwork
  address?: string
}

type TBuildVoteNeo3CalculateVoteFeeQueryKeyParams = {
  neo3Network: TNetwork
  candidatePubKey: string
  neo3Account?: TAccount
}

type TCalculateVoteFeeParams = {
  neo3Account?: TAccount
  candidatePubKey: string
}

type TValidationsParams = {
  balanceQuery: TUseBalanceResult
  gasFee?: string
}

const buildVoteNeo3GetCandidatesToVoteQueryKey = ({
  neo3Network,
}: TBuildVoteNeo3GetCandidatesToVoteQueryKeyParams): any[] => ['vote-neo3-get-candidates-to-vote', neo3Network]

export const buildVoteNeo3GetVoteDetailsByAddressQueryKey = ({
  neo3Network,
  address,
}: TBuildVoteNeo3GetVoteDetailsByAddressQueryKeyParams) => {
  const key: any[] = ['vote-neo3-get-vote-details-by-address', neo3Network]

  if (address) key.push(address)

  return key
}

const buildVoteNeo3CalculateVoteFeeQueryKey = ({
  neo3Network,
  candidatePubKey,
  neo3Account,
}: TBuildVoteNeo3CalculateVoteFeeQueryKeyParams) => {
  const key: any[] = ['vote-neo3-calculate-vote-fee', neo3Network]

  if (candidatePubKey) key.push(candidatePubKey)
  if (neo3Account) key.push(neo3Account)

  return key
}

const fetchVoteDetailsByAddress = async (address: string) => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3<TBlockchainServiceKey>

  return await service.voteService.getVoteDetailsByAddress(address)
}

export const useVoteNeo3GetCandidatesToVote = () => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildVoteNeo3GetCandidatesToVoteQueryKey({ neo3Network }),
    queryFn: async () => {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName
        .neo3 as BSNeo3<TBlockchainServiceKey>

      const candidates = await service.voteService.getCandidatesToVote()
      const cozCandidateIndex = candidates.findIndex(({ pubKey }) => pubKey === ConstantsHelper.voteNeo3CozPubKey)

      if (cozCandidateIndex !== -1) {
        const cozCandidate = cloneDeep(candidates[cozCandidateIndex])

        candidates.splice(cozCandidateIndex, 1)
        candidates.unshift(cozCandidate)
      }

      return candidates
    },
    enabled: neo3Network.type === 'mainnet',
  })
}

export const useVoteNeo3GetVoteDetailsByAddress = (address?: string) => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildVoteNeo3GetVoteDetailsByAddressQueryKey({ neo3Network, address }),
    queryFn: fetchVoteDetailsByAddress.bind(null, address!),
    enabled: !!address && neo3Network.type === 'mainnet',
  })
}

export const useLazyVoteNeo3GetVoteDetailsByAddress = () => {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  const getVoteDetails = useCallback(
    async (address: string) => {
      const neo3Network = selectedNetworkByBlockchain.neo3
      if (neo3Network.type !== 'mainnet') return

      return await queryClient.ensureQueryData({
        queryKey: buildVoteNeo3GetVoteDetailsByAddressQueryKey({ neo3Network, address }),
        queryFn: fetchVoteDetailsByAddress.bind(null, address),
      })
    },
    [selectedNetworkByBlockchain, queryClient]
  )

  return { getVoteDetails }
}

export const useVoteNeo3CalculateVoteFee = ({ neo3Account, candidatePubKey }: TCalculateVoteFeeParams) => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildVoteNeo3CalculateVoteFeeQueryKey({ neo3Network, candidatePubKey, neo3Account }),
    queryFn: async () => {
      const key = await SecureStoreHelper.getKey(neo3Account!)

      if (!key) return

      const account = await BlockchainServiceHelper.getServiceAccount({ account: neo3Account!, key })

      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName
        .neo3 as BSNeo3<TBlockchainServiceKey>

      return await service.voteService.calculateVoteFee({ account, candidatePubKey })
    },
    enabled: !!neo3Account && neo3Account.type !== 'watch' && !!candidatePubKey && neo3Network.type === 'mainnet',
    staleTime: 0,
    gcTime: 0,
  })
}

export const useVoteNeo3Validations = ({ balanceQuery, gasFee }: TValidationsParams) => {
  const hasEnoughGasToPayFee = useMemo(() => {
    const blockchain = balanceQuery.data?.blockchain

    if (!blockchain) return undefined

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3<TBlockchainServiceKey>

    const gasAmountNumber = balanceQuery.data?.tokensBalances?.find(({ token }) =>
      service.tokenService.predicateByHash(service.feeToken, token)
    )?.amountNumber

    if (gasAmountNumber === undefined || gasFee === undefined) return undefined

    return gasAmountNumber >= NumberHelper.number(gasFee)
  }, [balanceQuery.data?.blockchain, balanceQuery.data?.tokensBalances, gasFee])

  return { hasEnoughGasToPayFee }
}
