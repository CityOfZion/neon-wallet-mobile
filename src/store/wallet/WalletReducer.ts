import { CaseReducer, PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { Wallet } from './Wallet'

import { Storage } from '~/src/app/Storage'
import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { WalletState } from '~/src/types/store'

export const walletReducerName = 'walletReducer'

export interface IWalletReducer {
  data: WalletState[]
}

const initialState = {
  data: [] as WalletState[],
} as IWalletReducer

const migrateWalletsFromStorage = createAsyncThunk('wallets/migrateWalletsFromStorage', async () => {
  return await Storage.wallets.load()
})

const saveWallet = createAsyncThunk('wallets/save', async (wallet: Wallet) => {
  if (!wallet.id) throw new Error('the wallet needs have id')

  return wallet.deserialize
})

const deleteWallet: CaseReducer<IWalletReducer, PayloadAction<string>> = (state, action) => {
  if ('data' in state) {
    const idWallet = action.payload
    state.data = state.data.filter(it => it.id !== idWallet)
    SecurityHelper.removeMnemonic(idWallet)
  }
}

const reorder: CaseReducer<IWalletReducer, PayloadAction<number[]>> = (state, action) => {
  if ('data' in state) {
    const order = action.payload
    const newWalletList: WalletState[] = []
    order.forEach(i => newWalletList.push(state.data[i]))
    state.data = newWalletList
  }
}

const WalletReducer = createSlice({
  initialState,
  name: walletReducerName,
  reducers: {
    deleteWallet,
    reorder,
  },
  extraReducers(builder) {
    builder
      .addCase(migrateWalletsFromStorage.fulfilled, (state, action) => {
        const wallets = action.payload?.map((it: any) => it.deserialize)
        if (wallets) {
          if ('data' in state) {
            const appWallets = [...state.data, ...wallets]
            const notRepeatedWallets = new Set<string | null>()
            state.data = appWallets.filter(wallet => {
              const isRepeated = notRepeatedWallets.has(wallet.id)
              notRepeatedWallets.add(wallet.id)
              if (!isRepeated) {
                return true
              } else {
                return false
              }
            })
          } else {
            // @ts-ignore
            state.data = wallets
          }
          Storage.wallets.erase()
        }
      })
      .addCase(saveWallet.fulfilled, (state, action) => {
        const wallet = action.payload
        if (!('data' in state)) {
          // @ts-ignore
          state.data = [wallet]
        } else {
          const indexWallet = state.data.findIndex(it => it.id === wallet.id)
          if (indexWallet < 0) {
            state.data = [...state.data, wallet]
          } else {
            state.data[indexWallet] = wallet
          }
        }
      })
  },
})

export const WalletReducerSlice = WalletReducer

export const walletReducerActions = {
  ...WalletReducer.actions,
  migrateWalletsFromStorage,
  saveWallet,
}
export default WalletReducer.reducer
