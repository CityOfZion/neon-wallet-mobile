import type { TBSServiceName } from '@cityofzion/bs-multichain'
import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'

import type { TUtilityReducer } from './index'

import type { TUseTransactionsTransaction } from '@/types/hooks'

type THiddenTokenParams = {
  hash: string
  blockchain: TBSServiceName
}

const { t } = I18nextHelper.get()

const setIsConnected: CaseReducer<TUtilityReducer, PayloadAction<boolean>> = (state, action) => {
  state.memoryData.isConnected = action.payload
}

const addPendingTransaction: CaseReducer<TUtilityReducer, PayloadAction<TUseTransactionsTransaction>> = (
  state,
  action
) => {
  state.memoryData.pendingTransactions = [...state.memoryData.pendingTransactions, action.payload]
}

const removePendingTransaction: CaseReducer<TUtilityReducer, PayloadAction<string>> = (state, action) => {
  state.memoryData.pendingTransactions = state.memoryData.pendingTransactions.filter(
    transaction => transaction.txId !== action.payload
  )
}

const setUnlockedSkinIds: CaseReducer<TUtilityReducer, PayloadAction<string[]>> = (state, action) => {
  state.data.unlockedSkinIds = action.payload
}

const toggleHiddenToken: CaseReducer<TUtilityReducer, PayloadAction<THiddenTokenParams>> = (state, action) => {
  const { hash, blockchain } = action.payload
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

  if (service.tokenService.isNativeToken(hash)) throw new AppError(t('errors.unexpected'))

  const normalizedHash = service.tokenService.normalizeHash(hash)
  const hiddenTokens = (state.data.hiddenTokensByBlockchain[blockchain] ||= [])
  const index = hiddenTokens.findIndex(tokenHash => service.tokenService.predicateByHash(normalizedHash, tokenHash))

  if (index < 0) {
    hiddenTokens.push(normalizedHash)
  } else {
    hiddenTokens.splice(index, 1)
  }
}

// Last Indexes By Wallet Reducers
const saveLastIndexByWallet: CaseReducer<
  TUtilityReducer,
  PayloadAction<{
    index: number
    firstAccountAddress: string
    blockchain: TBSServiceName
  }>
> = (state, action) => {
  const { firstAccountAddress, index, blockchain } = action.payload

  state.data.lastIndexesByWallet[blockchain] = {
    ...state.data.lastIndexesByWallet[blockchain],
    [firstAccountAddress]: index,
  }
}

export const utilitySliceReducers = {
  setIsConnected,
  addPendingTransaction,
  removePendingTransaction,
  setUnlockedSkinIds,
  toggleHiddenToken,
  saveLastIndexByWallet,
}
