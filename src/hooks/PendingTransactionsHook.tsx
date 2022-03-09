import i18n from 'i18n-js'
import {useCallback} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useDispatch} from 'react-redux'

import {appBus} from '../app/AppBus'
import {blockchainServices} from '../blockchain'
import {Account} from '../models/redux/Account'
import {RootStore} from '../store/RootStore'

export function usePendngTransactions() {
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const checkPendingTransactionsAndUpdateBalance = useCallback(
    async (accountsPool: Account[]) => {
      for (const account of accountsPool) {
        if (account.flattedPendingTransactions.length > 0) {
          for (const pendingTransaction of account.flattedPendingTransactions) {
            if (pendingTransaction.transactionHash) {
              const transaction = await blockchainServices[
                account.blockchain
              ].provider.getTransaction(pendingTransaction.transactionHash)
              if (transaction) {
                await account.removePendingTransactions(
                  pendingTransaction,
                  pendingTransaction.transactionHash
                )
                await updateBalanceAfterPending(account)
                const receiverAcc = accountsPool.find(
                  (it) => it.address === pendingTransaction.receiverAddress
                )
                if (receiverAcc) {
                  await updateBalanceAfterPending(receiverAcc)
                }
                if (
                  pendingTransaction.receiverAddress === 'claim' ||
                  pendingTransaction.receiverAddress === account.address
                ) {
                  showMessage({
                    message: i18n.t('toast.gasClaimSuccess'),
                    type: 'success',
                    duration: 2000,
                  })
                  appBus.emit('claimGasEnd')
                } else {
                  showMessage({
                    duration: 2000,
                    message: i18n.t('toast.transactionCompleted'),
                    type: 'success',
                    onPress: () => {
                      appBus.emit(
                        'navigateTransactionDetails',
                        pendingTransaction
                      )
                    },
                  })
                }
              }
            }
          }
        }
      }
    },
    []
  )

  const updateBalanceAfterPending = useCallback(async (account: Account) => {
    await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
    await dispatchAsync(RootStore.app.actions.fetchBalanceAccounts())
    await dispatchAsync(RootStore.app.actions.syncAccounts())
    await dispatchAsync(RootStore.app.actions.syncWallets())
  }, [])

  return {checkPendingTransactionsAndUpdateBalance}
}
