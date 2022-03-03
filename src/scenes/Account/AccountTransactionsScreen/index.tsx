import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import moment from 'moment'
import React, {useCallback, useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {TransactionsListDate} from './TransactionsListDate'

import {blockchainServices} from '~/src/blockchain'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {Account} from '~/src/models/redux/Account'
import {TransactionAddressResponse} from '~/src/models/response/TransactionAddressResponse'
import {RootStackParamList} from '~/src/navigation/AppNavigation'
import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
export interface AccountTransactionsScreenParams {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'AccountTransactionsScreen'>
}

export interface TransfersDataScreen {
  addressFrom: string
  addressTo: string
  amount: string
  asset: string
  symbol?: string
}

export interface TransactionDataScreen {
  txid: string
  time: number | null
  qtyInvocations: number
  qtyNotifications: number
  transfers: TransfersDataScreen[]
}

const AccountTransactionsScreen = (props: Props) => {
  const {account} = props.route.params
  const {accounts: accountsPool, tokens} = useSelector(
    (state: RootState) => state.app
  )
  const [transactionsDataScreen, setTransactionsDataScreen] = useState<{
    [date: string]: TransactionDataScreen[]
  }>({})
  const [
    pendingTransactionsDataScreen,
    setPendingTransactionsDataScreen,
  ] = useState<{[date: string]: TransactionDataScreen[]}>()

  const handleLoadTransactions = useCallback(async () => {
    if (account.address) {
      const transactionsHistory = await blockchainServices[
        account.blockchain
      ].provider.getAddressAbstracts(account.address, tokens)

      handleFormatTransactions(transactionsHistory)
    }
  }, [account])

  const getKeyDateByTimeStamp = useCallback((timestamp: number) => {
    return moment(timestamp).format('YYYY-MM-DD')
  }, [])

  const handleFormatTransactions = useCallback(
    (transactions: TransactionAddressResponse) => {
      const formatedTransactions = new Map<string, TransactionDataScreen>()
      const formatedTransfers = new Map<string, TransfersDataScreen[]>()

      transactions.entries.forEach(
        ({
          txid,
          addressFrom,
          addressTo,
          amount,
          asset,
          time,
          qtyInvocations,
          qtyNotifications,
          symbol,
        }) => {
          if (txid && time && addressFrom && addressTo && amount && asset) {
            let historyTransfer = formatedTransfers.get(txid)
            if (historyTransfer) {
              historyTransfer.push({
                addressFrom,
                addressTo,
                amount,
                asset,
                symbol,
              })
              formatedTransfers.set(txid, historyTransfer)
            } else {
              historyTransfer = []
              historyTransfer.push({
                addressFrom,
                addressTo,
                amount,
                asset,
                symbol,
              })
              formatedTransfers.set(txid, historyTransfer)
            }
            formatedTransactions.set(txid, {
              txid,
              qtyInvocations,
              qtyNotifications,
              time,
              transfers: historyTransfer,
            })
          }
        }
      )

      const formatedTransactionsData: {
        [date: string]: TransactionDataScreen[]
      } = {}

      Array.from(formatedTransactions.values()).forEach((transaction) => {
        const {time} = transaction
        if (time) {
          const keyDate = getKeyDateByTimeStamp(time)
          if (formatedTransactionsData[keyDate]) {
            formatedTransactionsData[keyDate].push(transaction)
          } else {
            formatedTransactionsData[keyDate] = [transaction]
          }
        }
      })

      setTransactionsDataScreen(formatedTransactionsData)
    },
    [transactionsDataScreen, getKeyDateByTimeStamp]
  )

  useEffect(() => {
    populatePendingTransactionList()
    Await.run('populateTransactionsList', handleLoadTransactions)
  }, [accountsPool])

  const populatePendingTransactionList = useCallback(() => {
    const acc = accountsPool.find((acc) => acc.address === account.address)
    if (acc && acc.pendingTransactions.length > 0) {
      const formatedTransactions = new Map<string, TransactionDataScreen>()
      const formatedTransfers = new Map<string, TransfersDataScreen[]>()
      const pendingTransactions = acc.getPendingTransactions()
      pendingTransactions.forEach((it) => {
        let txid: string = ''
        if (it.date) {
          it.transactions.forEach((transaction) => {
            if (
              transaction.sentAt &&
              transaction.transactionHash &&
              transaction.senderAddress &&
              transaction.receiverAddress &&
              transaction.token?.amount
            ) {
              let historyTransfer = formatedTransfers.get(
                transaction.transactionHash
              )
              txid = transaction.transactionHash
              if (historyTransfer) {
                historyTransfer.push({
                  addressFrom: transaction.transactionHash,
                  addressTo: transaction.receiverAddress,
                  amount: String(transaction.token?.amount),
                  asset: transaction.token.hash,
                  symbol: transaction.token.symbol,
                })
                formatedTransfers.set(transaction.sentAt, historyTransfer)
              } else {
                historyTransfer = []
                historyTransfer.push({
                  addressFrom: transaction.transactionHash,
                  addressTo: transaction.receiverAddress,
                  amount: String(transaction.token?.amount),
                  asset: transaction.token.hash,
                  symbol: transaction.token.symbol,
                })
                formatedTransfers.set(
                  transaction.transactionHash,
                  historyTransfer
                )
              }
              formatedTransactions.set(txid, {
                txid,
                qtyInvocations: 0,
                qtyNotifications: 0,
                time: moment(transaction.sentAt).toDate().getTime(),
                transfers: historyTransfer,
              })
            }
          })
        }
      })

      const formatedTransactionsData: {
        [date: string]: TransactionDataScreen[]
      } = {}

      Array.from(formatedTransactions.values()).forEach((transaction) => {
        const {time} = transaction
        if (time) {
          const keyDate = getKeyDateByTimeStamp(time)
          if (formatedTransactionsData[keyDate]) {
            formatedTransactionsData[keyDate].push(transaction)
          } else {
            formatedTransactionsData[keyDate] = [transaction]
          }
        }
      })

      setPendingTransactionsDataScreen(formatedTransactionsData)
    } else {
      setPendingTransactionsDataScreen(undefined)
    }
  }, [accountsPool, account])

  return (
    <AwaitActivity
      name="populateTransactionsList"
      loadingView={<ScreenLoader />}
    >
      <ScreenLayout>
        <AccountSubTitle account={account} />
        {Object.keys(transactionsDataScreen).map((date) => (
          <TransactionsListDate
            key={date}
            date={date}
            transactions={transactionsDataScreen[date]}
            pendingTransactions={
              pendingTransactionsDataScreen
                ? pendingTransactionsDataScreen[date]
                : []
            }
          />
        ))}
      </ScreenLayout>
    </AwaitActivity>
  )
}

export default AccountTransactionsScreen
