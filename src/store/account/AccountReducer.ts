import { CaseReducer, PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { RootState } from '../RootStore'

import { appBus } from '~/src/app/AppBus'
import { Storage } from '~/src/app/Storage'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { PollingHelper } from '~/src/helpers/PollingHelper'
import { Account } from '~/src/models/redux/Account'
import { AccountState } from '~/src/types/reducers/account'

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

const saveAccount = createAsyncThunk('accounts/save', async (account: Account) => {
  if (!account.address) throw new Error('address is undefined')

  if (!account.idWallet) throw new Error('wallet not found to create account')

  return account.deserialize
})

const watchPendingTransaction = createAsyncThunk(
  'accounts/watchPendingTransaction',
  ({ account, transactionHash, isClaim }: TWatchPendingTransactionParams, { getState }) => {
    const polling = new PollingHelper()
    const state = getState() as RootState

    return new Promise<AccountState>((resolve, reject) => {
      let attemptCounter = 0
      polling.run(async () => {
        attemptCounter++

        const service = BlockchainHelper.getBlockchainService({
          blockchain: account.blockchain,
          network: state.settings.selectedBlockchainNetworks[account.blockchain],
        })
        try {
          await service.provider.getTransaction(transactionHash)

          account.removePendingTransactions(transactionHash)
          appBus.emit(isClaim ? 'claimGasEnd' : 'pendingTransactionConfirmed', account)
          resolve(account.deserialize)
          polling.stop()
        } catch {
          if (attemptCounter > 10) {
            reject(new Error(`transaction ${transactionHash} not found`))
            polling.stop()
          }
        }
      })
    })
  }
)

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
  },
  extraReducers(builder) {
    builder
      .addCase(migrateAccountsFromStorage.fulfilled, (state, action) => {
        const accounts = action.payload?.map(it => {
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
            state.data = accounts
          }
          Storage.accounts.erase()
        }
      })
      .addCase(saveAccount.fulfilled, (state, action) => {
        const account = action.payload
        if (!('data' in state)) {
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
        if (!('data' in state)) {
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
  },
})

export const accountReducerActions = {
  ...AccountReducer.actions,
  saveAccount,
  watchPendingTransaction,
  migrateAccountsFromStorage,
}
export default AccountReducer.reducer
