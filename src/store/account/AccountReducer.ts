import { waitForTransaction } from '@cityofzion/blockchain-service'
import { CaseReducer, PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { RootState } from '../RootStore'
import { Account } from './Account'

import { appBus } from '~/src/app/AppBus'
import { Storage } from '~/src/app/Storage'
import { AccountState } from '~/src/types/store'

interface IAccountReducer {
  data: AccountState[]
}

type TWatchPendingTransactionParams = { account: Account; transactionHash: string; isClaim?: boolean }

export const accountReducerName = 'accountReducer'

const initialState = {
  data: [],
} as IAccountReducer

const migrateAccountsFromStorage = createAsyncThunk('accounts/migrateAccountsFromStorage', async () => {
  return Storage.accounts.load()
})

const watchPendingTransaction = createAsyncThunk(
  'accounts/watchPendingTransaction',
  async ({ account, transactionHash, isClaim }: TWatchPendingTransactionParams, { getState }) => {
    const state = getState() as RootState
    const service = state.blockchain.bsAggregator.getBlockchainByName(account.blockchain)
    const success = await waitForTransaction(service, transactionHash)

    if (success) {
      appBus.emit(isClaim ? 'pendingClaimConfirmed' : 'pendingTransactionConfirmed', account)
    } else {
      appBus.emit('pendingTransactionFailed')
    }
    account.removePendingTransactions(transactionHash)
    return account.deserialize
  }
)

const removeAllPendingTransactions: CaseReducer<IAccountReducer> = state => {
  state.data = state.data.map(account => ({ ...account, pendingTransactions: [] }))
}

const saveAccount = createAsyncThunk('accounts/save', async (account: Account) => {
  return account.deserialize
})

const deleteAccount: CaseReducer<IAccountReducer, PayloadAction<string>> = (state, action) => {
  if ('data' in state) {
    const address = action.payload
    state.data = state.data.filter(account => account.address !== address)
  }
}

const AccountReducer = createSlice({
  name: accountReducerName,
  initialState,
  reducers: {
    deleteAccount,
    removeAllPendingTransactions,
  },
  extraReducers(builder) {
    builder
      .addCase(migrateAccountsFromStorage.fulfilled, (state, action) => {
        const accounts = action.payload?.map((it: any) => {
          it.adaptToMultichain()
          return it.deserialize
        })
        if (accounts) {
          if ('data' in state) {
            const appAccounts = [...state.data, ...accounts]
            const notRepeatedAccounts = new Set<string | null>()
            state.data = appAccounts.filter((account, index) => {
              const isRepeated = notRepeatedAccounts.has(account.address)
              notRepeatedAccounts.add(account.address)
              if (!isRepeated) {
                return true
              } else {
                return false
              }
            })
          } else {
            // @ts-ignore
            state.data = accounts
          }
          Storage.accounts.erase()
        }
      })
      .addCase(saveAccount.fulfilled, (state, action) => {
        const account = action.payload
        if (!('data' in state)) {
          // @ts-ignore
          state.data = [account]
        } else {
          const findIndex = state.data.findIndex(it => it.address === account.address)
          if (findIndex < 0) {
            state.data = [...state.data, account]
          } else {
            state.data[findIndex] = account
          }
        }
      })
      .addCase(watchPendingTransaction.fulfilled, (state, action) => {
        const account = action.payload
        const findIndex = state.data.findIndex(it => it.address === account.address)
        if (findIndex < 0) {
          return
        }

        state.data[findIndex] = account
      })
  },
})

export const accountReducerActions = {
  ...AccountReducer.actions,
  saveAccount,
  watchPendingTransaction,
  migrateAccountsFromStorage,
}
export default AccountReducer.reducer
