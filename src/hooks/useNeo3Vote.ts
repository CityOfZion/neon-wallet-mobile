import { useCallback, useMemo } from 'react'

import type { TBSNeo3Name } from '@cityofzion/bs-neo3'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { NumberHelper } from '@/helpers/NumberHelper'

import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import type { TNetwork } from '@/types/blockchain'
import type { TUseBalanceResult } from '@/types/query'
import type { TAccount } from '@/types/store'

type TBuildNeo3VoteGetCandidatesToVoteQueryKeyParams = {
  neo3Network: TNetwork
}

type TBuildNeo3VoteGetVoteDetailsByAddressQueryKeyParams = {
  neo3Network: TNetwork
  address?: string
}

type TBuildNeo3VoteCalculateVoteFeeQueryKeyParams = {
  neo3Network: TNetwork
  candidatePubKey: string
  neo3Account?: TAccount<TBSNeo3Name>
}

type TCalculateVoteFeeParams = {
  neo3Account?: TAccount<TBSNeo3Name>
  candidatePubKey: string
}

type TValidationsParams = {
  balanceQuery: TUseBalanceResult
  gasFee?: string
}

const buildNeo3VoteGetCandidatesToVoteQueryKey = ({
  neo3Network,
}: TBuildNeo3VoteGetCandidatesToVoteQueryKeyParams): any[] => ['neo3-vote-get-candidates-to-vote', neo3Network]

export const buildNeo3VoteGetVoteDetailsByAddressQueryKey = ({
  neo3Network,
  address,
}: TBuildNeo3VoteGetVoteDetailsByAddressQueryKeyParams) => {
  const key: any[] = ['neo3-vote-get-vote-details-by-address', neo3Network]

  if (address) key.push(address)

  return key
}

const buildNeo3VoteCalculateVoteFeeQueryKey = ({
  neo3Network,
  candidatePubKey,
  neo3Account,
}: TBuildNeo3VoteCalculateVoteFeeQueryKeyParams) => {
  const key: any[] = ['neo3-vote-calculate-vote-fee', neo3Network]

  if (candidatePubKey) key.push(candidatePubKey)
  if (neo3Account) key.push(neo3Account)

  return key
}

const fetchVoteDetailsByAddress = async (address: string) => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3

  return await service.voteService.getVoteDetailsByAddress(address)
}

export const useNeo3VoteGetCandidatesToVote = () => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildNeo3VoteGetCandidatesToVoteQueryKey({ neo3Network }),
    queryFn: async () => {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3

      const candidates = await service.voteService.getCandidatesToVote()
      const cozCandidateIndex = candidates.findIndex(({ pubKey }) => pubKey === ConstantsHelper.neo3VoteCozPubKey)

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

export const useNeo3VoteGetVoteDetailsByAddress = (address?: string) => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildNeo3VoteGetVoteDetailsByAddressQueryKey({ neo3Network, address }),
    queryFn: fetchVoteDetailsByAddress.bind(null, address!),
    enabled: !!address && neo3Network.type === 'mainnet',
  })
}

export const useLazyNeo3VoteGetVoteDetailsByAddress = () => {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  const getVoteDetails = useCallback(
    async (address: string) => {
      const neo3Network = selectedNetworkByBlockchain.neo3
      if (neo3Network.type !== 'mainnet') return

      return await queryClient.ensureQueryData({
        queryKey: buildNeo3VoteGetVoteDetailsByAddressQueryKey({ neo3Network, address }),
        queryFn: fetchVoteDetailsByAddress.bind(null, address),
      })
    },
    [selectedNetworkByBlockchain, queryClient]
  )

  return { getVoteDetails }
}

export const useNeo3VoteCalculateVoteFee = ({ neo3Account, candidatePubKey }: TCalculateVoteFeeParams) => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  return useQuery({
    queryKey: buildNeo3VoteCalculateVoteFeeQueryKey({ neo3Network, candidatePubKey, neo3Account }),
    queryFn: async () => {
      const account = await BlockchainServiceHelper.getServiceAccount(neo3Account!)

      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3

      return await service.voteService.calculateVoteFee({ account, candidatePubKey })
    },
    enabled: !!neo3Account && neo3Account.type !== 'watch' && !!candidatePubKey && neo3Network.type === 'mainnet',
    staleTime: 0,
    gcTime: 0,
  })
}

export const useNeo3VoteValidations = ({ balanceQuery, gasFee }: TValidationsParams) => {
  const hasEnoughGasToPayFee = useMemo(() => {
    const blockchain = balanceQuery.data?.blockchain

    if (!blockchain) return undefined

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3

    const gasAmountNumber = balanceQuery.data?.tokensBalances?.find(({ token }) =>
      service.tokenService.predicateByHash(service.feeToken, token)
    )?.amountNumber

    if (gasAmountNumber === undefined || gasFee === undefined) return undefined

    return gasAmountNumber >= NumberHelper.number(gasFee)
  }, [balanceQuery.data?.blockchain, balanceQuery.data?.tokensBalances, gasFee])

  return { hasEnoughGasToPayFee }
}
