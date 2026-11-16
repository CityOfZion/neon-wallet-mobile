import { isClaimable } from '@cityofzion/blockchain-service'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { createAppSelector, useAppSelector } from './useRedux'

import type { TAccount } from '@/types/store'

const selectHasClaimPendingTransaction = (account: TAccount) =>
  createAppSelector([state => state.utility.memoryData.pendingTransactions], pendingTransactions => {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

    return pendingTransactions.some(
      transaction =>
        isClaimable(service) &&
        service.claimService.getTransactionData(transaction) &&
        AccountHelper.predicate(account)({ blockchain: transaction.blockchain, address: transaction.relatedAddress! })
    )
  })

export const useIsConnectedSelector = () => {
  const { value } = useAppSelector(state => state.utility.memoryData.isConnected)

  return {
    isConnecting: value === undefined,
    isConnected: value === true,
    isNotConnected: value === false,
  }
}

export const usePendingTransactionsSelector = () => {
  const { value, ref } = useAppSelector(state => state.utility.memoryData.pendingTransactions)

  return {
    pendingTransactions: value,
    pendingTransactionsRef: ref,
  }
}

export const useHasClaimPendingTransactionSelector = (account: TAccount) => {
  const { value, ref } = useAppSelector(selectHasClaimPendingTransaction(account))

  return {
    hasClaimPendingTransaction: value,
    hasClaimPendingTransactionRef: ref,
  }
}

export const useHiddenTokensByBlockchainSelector = () => {
  const { value, ref } = useAppSelector(state => {
    return state.utility.data.hiddenTokensByBlockchain
  })

  return {
    hiddenTokensByBlockchain: value,
    hiddenTokensByBlockchainRef: ref,
  }
}

export const useLastIndexesByWallet = () => {
  const { value, ref } = useAppSelector(state => state.utility.data.lastIndexesByWallet)

  return {
    lastIndexesByWallet: value,
    lastIndexesByWalletRef: ref,
  }
}
