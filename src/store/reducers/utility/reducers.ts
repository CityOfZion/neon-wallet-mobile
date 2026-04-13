import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import cloneDeep from 'lodash/cloneDeep'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { TokenHelper } from '@/helpers/TokenHelper'

import type { TUtilityReducer } from './index'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TUseTransactionsTransaction } from '@/types/hooks'
import type { TSwapRecord } from '@/types/store'

type THiddenTokenParams = {
  hash: string
  blockchain: TBlockchainServiceKey
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

const saveSwapRecord: CaseReducer<TUtilityReducer, PayloadAction<TSwapRecord>> = (state, action) => {
  const swapRecord = cloneDeep(action.payload)

  // We don't want to save this long information in the storage
  swapRecord.log = undefined

  const index = state.data.swapRecords.findIndex(
    ({ swapId, swapProvider }) => swapId === swapRecord.swapId && swapProvider === swapRecord.swapProvider
  )

  if (index === -1) {
    state.data.swapRecords = [...state.data.swapRecords, swapRecord]

    return
  }

  state.data.swapRecords[index] = swapRecord
}

const setUnlockedSkinIds: CaseReducer<TUtilityReducer, PayloadAction<string[]>> = (state, action) => {
  state.data.unlockedSkinIds = action.payload
}

const toggleHiddenToken: CaseReducer<TUtilityReducer, PayloadAction<THiddenTokenParams>> = (state, action) => {
  const { hash, blockchain } = action.payload

  if (TokenHelper.isNativeToken(hash, blockchain)) throw new AppError(t('errors.unexpected'))

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const normalizedHash = service.tokenService.normalizeHash(hash)
  const hiddenTokens = cloneDeep(state.data.hiddenTokensByBlockchain[blockchain] || [])
  const index = hiddenTokens.findIndex(tokenHash => service.tokenService.predicateByHash(normalizedHash, tokenHash))

  if (index < 0) {
    hiddenTokens.push(normalizedHash)
  } else {
    hiddenTokens.splice(index, 1)
  }

  state.data.hiddenTokensByBlockchain = {
    ...state.data.hiddenTokensByBlockchain,
    [blockchain]: hiddenTokens,
  }
}

// Last Indexes By Wallet Reducers
const saveLastIndexByWallet: CaseReducer<
  TUtilityReducer,
  PayloadAction<{
    index: number
    firstAccountAddress: string
    blockchain: TBlockchainServiceKey
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
  saveSwapRecord,
  setUnlockedSkinIds,
  toggleHiddenToken,
  saveLastIndexByWallet,
}
