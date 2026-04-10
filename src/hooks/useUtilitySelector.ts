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
        AccountHelper.predicate(account)(transaction.data)
    )
  })

const selectSwapRecord = (txId: string) =>
  createAppSelector([state => state.utility.data.swapRecords], swapRecords => {
    return swapRecords.find(swapRecord => swapRecord.txFrom === txId)
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

export const useSwapRecordsSelector = () => {
  const { value: swapRecords, ref: swapRecordsRef } = useAppSelector(state => state.utility.data.swapRecords)

  return { swapRecords, swapRecordsRef }
}

export const useSwapRecordSelector = (txId: string) => {
  const { value: swapRecord, ref: swapRecordRef } = useAppSelector(selectSwapRecord(txId))

  return { swapRecord, swapRecordRef }
}
