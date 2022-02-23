import i18n from 'i18n-js'
import {useState, useCallback, useEffect} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {appBus} from '../app/AppBus'
import {blockchainServices} from '../blockchain'
import {Account} from '../models/redux/Account'
import {SenderTransaction} from '../models/redux/SenderTransaction'
import {RootStore} from '../store/RootStore'

export function usePendngTransactions() {
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const [isClaim, setIsClaim] = useState<boolean>()
  const [lastTransaction, setLastTransaction] = useState<SenderTransaction>()

  const checkPendingTransactions = useCallback(
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
                pendingTransaction.receiverAddress === 'claim' ||
                pendingTransaction.receiverAddress === account.address
                  ? setIsClaim(true)
                  : setLastTransaction(pendingTransaction)
              }
            }
          }
        }
      }
    },
    [isClaim, lastTransaction]
  )

  const updateBalanceAfterPending = useCallback(
    async (account: Account) => {
      await account.populateTokenAssets()
      await account.populateTransactions(tokensPool)
      await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
      await dispatchAsync(RootStore.app.actions.syncAccounts())
      await dispatchAsync(RootStore.app.actions.syncWallets())
    },
    [tokensPool, isClaim, lastTransaction]
  )

  useEffect(() => {
    if (isClaim) {
      showMessage({
        message: i18n.t('toast.gasClaimSuccess'),
        type: 'success',
      })
      setIsClaim(undefined)
      appBus.emit('claimGasEnd')
    } else if (lastTransaction) {
      showMessage({
        duration: 7000,
        message: i18n.t('toast.transactionCompleted'),
        type: 'success',
        onPress: () => {
          appBus.emit('navigateTransactionDetails', lastTransaction)
        },
      })
      setLastTransaction(undefined)
    }
  }, [isClaim, lastTransaction])

  return {checkPendingTransactions, claimHasUpdated: isClaim}
}
