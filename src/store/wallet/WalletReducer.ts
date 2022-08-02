import { CaseReducer, PayloadAction, createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

import { Storage } from '~/src/app/Storage'
import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { Wallet } from '~/src/models/redux/Wallet'
import { WalletState } from '~/src/types/reducers/wallet'

export const walletReducerName = 'walletReducer'

export interface IWalletReducer {
  data: WalletState[]
  selectedWallet: Wallet
  error: SerializedError
}

const initialState = {
  data: [] as WalletState[],
} as IWalletReducer

const migrateWalletsFromStorage = createAsyncThunk('wallets/migrateWalletsFromStorage', async () => {
  return await Storage.wallets.load()
})

const saveWallet = createAsyncThunk('wallets/save', async (wallet: Wallet) => {
  if (!wallet.id) throw new Error('the wallet needs have id')
  if (wallet.walletType !== 'standard') {
    return wallet.deserialize
  } else if (wallet.securityPhrase) {
    await SecurityHelper.saveMnemonic(wallet.id, wallet.securityPhrase)
    return wallet.deserialize
  }
  throw new Error('missing informations in wallet')
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
        const wallets = action.payload?.map(it => it.deserialize)
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
            state.data = wallets
          }
          Storage.wallets.erase()
        }
      })
      .addCase(saveWallet.fulfilled, (state, action) => {
        const wallet = action.payload
        if (!('data' in state)) {
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
      .addCase(saveWallet.rejected, (state, action) => {
        state.error = action.error
      })
      .addCase(PURGE, state => {
        state.error = {} as SerializedError
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
