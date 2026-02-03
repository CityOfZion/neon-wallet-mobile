import { AccountHelper } from '@/helpers/AccountHelper'

import { createAppSelector, useAppSelector } from './useRedux'

import type { IAccountState } from '@/types/store'

const selectHasClaimPendingTransaction = (account: IAccountState) =>
  createAppSelector([state => state.utility.inMemoryData.pendingTransactions], pendingTransactions => {
    return pendingTransactions.some(
      transaction => !!transaction.isClaim && AccountHelper.predicate(account)(transaction.account)
    )
  })

export const useIsConnectedSelector = () => {
  const { value } = useAppSelector(state => state.utility.inMemoryData.isConnected)

  return {
    isConnecting: value === undefined,
    isConnected: value === true,
    isNotConnected: value === false,
  }
}

export const usePendingTransactionsSelector = () => {
  const { value, ref } = useAppSelector(state => state.utility.inMemoryData.pendingTransactions)

  return {
    pendingTransactions: value,
    pendingTransactionsRef: ref,
  }
}

export const useHasClaimPendingTransactionSelector = (account: IAccountState) => {
  const { ref, value } = useAppSelector(selectHasClaimPendingTransaction(account))

  return {
    hasClaimPendingTransaction: value,
    hasClaimPendingTransactionRef: ref,
  }
}

export const useHiddenTokensByBlockchainSelector = () => {
  const { ref, value } = useAppSelector(state => {
    return state.utility.data.hiddenTokensByBlockchain
  })

  return {
    hiddenTokensByBlockchain: value,
    hiddenTokensByBlockchainRef: ref,
  }
}

export const useLastIndexesByWallet = () => {
  const { ref, value } = useAppSelector(state => state.utility.data.lastIndexesByWallet)

  return {
    lastIndexesByWallet: value,
    lastIndexesByWalletRef: ref,
  }
}
