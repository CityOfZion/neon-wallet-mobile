import { createSlice, CaseReducer, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import moment from 'moment'

import { Storage } from '~/src/app/Storage'
import { WCState } from '~src/types/reducers/wcApprovalDate'

export const walletConnectReducerName = 'walletConnectReducer'
const initialState = {} as WCState

const migrateWalletConnectFromStorage = createAsyncThunk('walletConnect/migrateWalletConnectFromStorage', async () => {
  return Storage.wcApprovalDates.load()
})

const updateApprovalDate: CaseReducer<WCState, PayloadAction<string>> = (state, action) => {
  const sessionTopic = action.payload
  if (!('approvalDates' in state)) {
    state.approvalDates = [{ sessionTopic, approvalDate: moment().unix() }]
  } else {
    const indexApprovalDate = state.approvalDates.findIndex(it => it.sessionTopic === sessionTopic)
    if (indexApprovalDate < 0) {
      state.approvalDates = [...state.approvalDates, { sessionTopic, approvalDate: moment().unix() }]
    } else {
      state.approvalDates[indexApprovalDate] = { sessionTopic, approvalDate: moment().unix() }
    }
  }
}

const deleteApprovalDate: CaseReducer<WCState, PayloadAction<string>> = (state, action) => {
  const sessionTopic = action.payload
  if ('approvalDates' in state) {
    state.approvalDates = state.approvalDates.filter(it => it.sessionTopic !== sessionTopic)
  }
}

const WalletConnectReducer = createSlice({
  initialState,
  name: walletConnectReducerName,
  reducers: {
    updateApprovalDate,
    deleteApprovalDate,
  },
  extraReducers(builder) {
    builder.addCase(migrateWalletConnectFromStorage.fulfilled, (state, action) => {
      const approvalDates = action.payload
      if (approvalDates) {
        if ('approvalDates' in state) {
          const appAprovalDates = [...state.approvalDates, ...approvalDates]
          const notRepeatedApprovalDates = new Set<string>()
          state.approvalDates = appAprovalDates.filter(approvalDate => {
            const isRepeated = notRepeatedApprovalDates.has(approvalDate.sessionTopic)
            notRepeatedApprovalDates.add(approvalDate.sessionTopic)
            if (!isRepeated) {
              return true
            } else {
              return false
            }
          })
        } else {
          state.approvalDates = approvalDates
        }
        Storage.wcApprovalDates.erase()
      }
    })
  },
})

export const walletConnectReducerActions = {
  ...WalletConnectReducer.actions,
  migrateWalletConnectFromStorage,
}

export default WalletConnectReducer.reducer
