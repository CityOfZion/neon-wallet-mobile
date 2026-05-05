import { waitForAccountTransaction } from '@cityofzion/blockchain-service'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ReactQueryHelper } from '@/helpers/ReactQueryHelper'

import { buildQueryKeyBalance } from '@/hooks/useBalances'
import { buildNeo3VoteGetVoteDetailsByAddressQueryKey } from '@/hooks/useNeo3Vote'
import { buildTransactionsQueryKey } from '@/hooks/useTransactionsQuery'

import { notificationReducerActions } from '../reducers/notification'
import { utilityReducerActions } from '../reducers/utility'

import type { TUseTransactionsTransaction } from '@/types/hooks'
import type { TRootState } from '@/types/redux'
import type { TNotification, TSaveNotification } from '@/types/store'

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
    const { txId, blockchain, relatedAddress } = pendingTransaction
    const address = relatedAddress!

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

    ReactQueryHelper.client.removeQueries({
      queryKey: buildQueryKeyBalance(address, blockchain, network),
    })

    ReactQueryHelper.client.removeQueries({
      queryKey: buildTransactionsQueryKey({ blockchain, address, network }),
    })

    ReactQueryHelper.client.removeQueries({
      queryKey: buildNeo3VoteGetVoteDetailsByAddressQueryKey({ neo3Network: network, address }),
      type: 'all',
    })

    dispatch(utilityReducerActions.removePendingTransaction(txId))

    if (notification) dispatch(notificationReducerActions.saveNotification(notification))
  }
)
