import { waitForAccountTransaction } from '@cityofzion/blockchain-service'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ReactQueryHelper } from '@/helpers/ReactQueryHelper'

import { notificationReducerActions } from '../reducers/notification'
import { utilityReducerActions } from '../reducers/utility'

import type { TRootState } from '@/types/redux'
import type { TNotification, TSaveNotification, TUseTransactionsTransaction } from '@/types/store'

type TParams = {
  pendingTransaction: TUseTransactionsTransaction
  successNotification?: Pick<TNotification, 'title' | 'previewBody'>
  failureNotification?: Pick<TNotification, 'title' | 'previewBody'>
}

export const waitPendingTransaction = createAsyncThunk<void, TParams>(
  'waitPendingTransaction',
  async (params, { getState, dispatch }) => {
    const state = getState() as TRootState
    const { pendingTransaction, successNotification, failureNotification } = params
    const { txId, account } = pendingTransaction
    const { address, blockchain } = account
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
    const network = state.settings.data.selectedNetworkByBlockchain[blockchain]
    const hasNotifications = !!successNotification && !!failureNotification

    let notification: TSaveNotification | undefined

    if (hasNotifications) {
      notification = {
        title: failureNotification.title,
        previewBody: failureNotification.previewBody,
        related: { address, blockchain },
      }
    }

    try {
      dispatch(utilityReducerActions.addPendingTransaction(pendingTransaction))

      const isCompleted = await waitForAccountTransaction({ service, txId, address, maxAttempts: 20 })

      if (isCompleted && notification && hasNotifications) {
        notification.title = successNotification.title
        notification.previewBody = successNotification.previewBody
        notification.action = {
          type: 'navigate',
          payload: { to: 'account-transaction', address, blockchain },
        }
      }
    } catch {
      // Empty block
    }

    ReactQueryHelper.invalidateTransactionQueries(account, network)

    if (notification) dispatch(notificationReducerActions.saveNotification(notification))

    dispatch(utilityReducerActions.removePendingTransaction(txId))
  }
)
