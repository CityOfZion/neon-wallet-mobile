import { waitForAccountTransaction } from '@cityofzion/blockchain-service'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ReactQueryHelper } from '@/helpers/ReactQueryHelper'

import { notificationReducerActions } from '../reducers/notification'
import { utilityReducerActions } from '../reducers/utility'

import type { TRootState } from '@/types/redux'
import type { TNotification, TSaveNotification, TUseTransactionsTransaction } from '@/types/store'

type TWaitTransactionParams = {
  transaction: TUseTransactionsTransaction
  successNotification?: Pick<TNotification, 'title' | 'previewBody'>
  failureNotification?: Pick<TNotification, 'title' | 'previewBody'>
}

export const waitTransaction = createAsyncThunk<void, TWaitTransactionParams>(
  'waitTransaction',
  async (params, { getState, dispatch }) => {
    const { transaction, successNotification, failureNotification } = params

    const state = getState() as TRootState
    const network = state.settings.data.selectedNetworkByBlockchain[transaction.account.blockchain]

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[transaction.account.blockchain]

    transaction.isPending = true

    const withNotification = successNotification && failureNotification
    let notification: TSaveNotification | undefined

    if (withNotification) {
      notification = {
        title: failureNotification.title,
        previewBody: failureNotification.previewBody,
        related: {
          address: transaction.account.address,
          blockchain: transaction.account.blockchain,
        },
      }
    }

    try {
      dispatch(utilityReducerActions.addPendingTransaction(transaction))

      const response = await waitForAccountTransaction({
        service,
        txId: transaction.txId,
        address: transaction.account.address,
        maxAttempts: 20,
      })

      if (response && withNotification && notification) {
        notification.title = successNotification.title
        notification.previewBody = successNotification.previewBody
        notification.action = {
          type: 'navigate',
          payload: {
            to: 'account-transaction',
            address: transaction.account.address,
            blockchain: transaction.account.blockchain,
          },
        }
      }
    } catch {
      // Empty block
    }

    ReactQueryHelper.invalidateTransactionQueries(transaction.account, network)

    if (withNotification && notification) {
      dispatch(notificationReducerActions.saveNotification(notification))
    }

    dispatch(utilityReducerActions.removePendingTransaction(transaction.txId))
  }
)
