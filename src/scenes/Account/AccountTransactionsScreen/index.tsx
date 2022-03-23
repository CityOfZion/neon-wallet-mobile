import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import moment from 'moment'
import React, {useCallback, useState, useEffect} from 'react'
import {ImageSourcePropType} from 'react-native'
import {useSelector} from 'react-redux'

import {TransactionsListDate} from './TransactionsListDate'

import {blockchainServices} from '~/src/blockchain'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {Loader} from '~/src/components/loader/loader'
import {TransactionDateGroup} from '~/src/models/TransactionDateGroup'
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
  decimals: number
  symbol?: string
}

export type ITransactionType = 'wcTransaction' | 'sendTransaction'

export interface TransactionDataScreen {
  txid: string
  time: number | null
  qtyInvocations: number
  qtyNotifications: number
  transfers: TransfersDataScreen[]
  statusTransaction: string
  iconStatusTransaction: ImageSourcePropType
  transactionType: ITransactionType
}

const AccountTransactionsScreen = (props: Props) => {
  const {account} = props.route.params
  const {tokens, accounts: accountsPool} = useSelector(
    (state: RootState) => state.app
  )
  const [transactionsDataScreen, setTransactionsDataScreen] = useState<{
    [date: string]: TransactionDataScreen[]
  }>({})
  const [
    pendingTransactionsDataScreen,
    setPendingTransactionsDataScreen,
  ] = useState<{[date: string]: TransactionDataScreen[]}>()

  const [pageRequest, setPageRequest] = useState<number>(1)
  const [showLoading, setShowLoading] = useState<boolean>(true)

  const handleLoadTransactions = useCallback(
    async (page?: number) => {
      if (account.address) {
        const transactionsHistory = await blockchainServices[
          account.blockchain
        ].provider.getAddressAbstracts(account.address, tokens, page)

        handleFormatTransactions(transactionsHistory)
        setShowLoading(false)
      }
    },
    [account, accountsPool, pageRequest, showLoading]
  )

  const getKeyDateByTimeStamp = useCallback((timestamp: number) => {
    return moment(timestamp).format('YYYY-MM-DD')
  }, [])

  const getDecimalsToken = useCallback(
    (symbol?: string) => {
      const tokenFound = tokens.find((token) => token.symbol === symbol)
      if (tokenFound?.decimals) {
        return tokenFound.decimals
      } else {
        return 8
      }
    },
    [tokens]
  )

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
                decimals: getDecimalsToken(symbol),
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
                decimals: getDecimalsToken(symbol),
              })
              formatedTransfers.set(txid, historyTransfer)
            }
            formatedTransactions.set(txid, {
              transactionType: 'sendTransaction',
              txid,
              qtyInvocations,
              qtyNotifications,
              time,
              transfers: historyTransfer,
              iconStatusTransaction: require('src/assets/images/icon-check-white.png'),
              statusTransaction: i18n.t(
                'screens.getAccount.completedTransactions'
              ),
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

      setTransactionsDataScreen((prevState) => {
        const data = prevState
        return {...data, ...formatedTransactionsData}
      })
    },
    [transactionsDataScreen, getKeyDateByTimeStamp]
  )

  useEffect(() => {
    const wcPendingTransactions = account
      .getPendingTransactions()
      .filter((it) =>
        it.transactions.filter((it) => it.qtyInvocations !== null)
      )
    const sendPendingTransactions = account.getPendingTransactions()
    if (wcPendingTransactions.length > 0) {
      populatePendingTransactionList(wcPendingTransactions, 'wcTransaction')
    } else if (sendPendingTransactions.length > 0) {
      populatePendingTransactionList(sendPendingTransactions, 'sendTransaction')
    }
    Await.run('populateTransactionsList', handleLoadTransactions)
  }, [account, accountsPool])

  useEffect(() => {
    if (showLoading) {
      Await.init('moreLoadTransaction')
    } else {
      Await.done('moreLoadTransaction')
    }
  }, [showLoading])

  const populatePendingTransactionList = useCallback(
    (
      pendingTransactions: TransactionDateGroup[],
      transactionType: ITransactionType
    ) => {
      if (pendingTransactions.length > 0) {
        const formatedTransactions = new Map<string, TransactionDataScreen>()
        const formatedTransfers = new Map<string, TransfersDataScreen[]>()
        pendingTransactions.forEach((it) => {
          let txid: string = ''
          if (it.date) {
            it.transactions.forEach((transaction) => {
              if (
                transaction.sentAt &&
                transaction.transactionHash &&
                transaction.senderAddress !== null &&
                transaction.receiverAddress !== null
              ) {
                let historyTransfer = formatedTransfers.get(
                  transaction.transactionHash
                )
                txid = transaction.transactionHash
                if (historyTransfer) {
                  historyTransfer.push({
                    addressFrom: transaction.senderAddress,
                    addressTo: transaction.receiverAddress,
                    amount: String(transaction.token?.amount),
                    asset: transaction.token?.hash ?? '',
                    symbol: transaction.token?.symbol ?? '',
                    decimals: getDecimalsToken(transaction.token?.symbol),
                  })
                  formatedTransfers.set(transaction.sentAt, historyTransfer)
                } else {
                  historyTransfer = []
                  historyTransfer.push({
                    addressFrom: transaction.senderAddress,
                    addressTo: transaction.receiverAddress,
                    amount: String(transaction.token?.amount ?? ''),
                    asset: transaction.token?.hash ?? '',
                    symbol: transaction.token?.symbol,
                    decimals: getDecimalsToken(transaction.token?.symbol),
                  })
                  formatedTransfers.set(
                    transaction.transactionHash,
                    historyTransfer
                  )
                }
                formatedTransactions.set(txid, {
                  transactionType,
                  txid,
                  qtyInvocations: 0,
                  qtyNotifications: transaction.qtyInvocations ?? 0,
                  time: moment(transaction.sentAt).toDate().getTime(),
                  transfers: historyTransfer,
                  iconStatusTransaction: require('src/assets/images/icon-pending-white.png'),
                  statusTransaction: i18n.t(
                    'components.transactionsList.title'
                  ),
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

        setPendingTransactionsDataScreen((prevState) => {
          const data = prevState
          return {...data, ...formatedTransactionsData}
        })
      }
    },
    [account, pendingTransactionsDataScreen]
  )

  return (
    <AwaitActivity
      name="populateTransactionsList"
      loadingView={<ScreenLoader />}
    >
      <ScreenLayout
        onScroll={(e) => {
          const paddingToBottom = e.nativeEvent.layoutMeasurement.height
          if (
            e.nativeEvent.contentOffset.y >=
            e.nativeEvent.contentSize.height - paddingToBottom
          ) {
            handleLoadTransactions(pageRequest + 1)
            setShowLoading(true)
            setPageRequest((prevState) => {
              return prevState + 1
            })
          }
        }}
      >
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
        {showLoading && (
          <AwaitActivity name="moreLoadTransaction" loadingView={<Loader />} />
        )}
      </ScreenLayout>
    </AwaitActivity>
  )
}

export default AccountTransactionsScreen
