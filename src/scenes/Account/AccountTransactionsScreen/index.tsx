import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import moment from 'moment'
import React, {useCallback, useState, useEffect, useRef} from 'react'
import {ImageSourcePropType} from 'react-native'
import {useSelector} from 'react-redux'

import {TransactionsListDate} from './TransactionsListDate'

import {blockchainServices} from '~/src/blockchain'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {Loader} from '~/src/components/loader/loader'
import {TransactionAddressSummary} from '~/src/models/TransactionAddressSummary'
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
  symbol: string
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

  const decimalsCache = useRef<Map<string, {symbol: string; decimals: number}>>(
    new Map(
      blockchainServices[
        account.blockchain
      ].assets.map(({symbol, decimals, hash}) => [hash, {symbol, decimals}])
    )
  )

  const handleLoadTransactions = useCallback(
    async (page?: number) => {
      if (account.address) {
        const {entries} = await blockchainServices[
          account.blockchain
        ].provider.getAddressAbstracts(account.address, page)

        await handleFormatTransactions(entries)
        setShowLoading(false)
      }
    },
    [account, accountsPool, pageRequest, showLoading]
  )

  const getKeyDateByTimeStamp = useCallback((timestamp: number) => {
    return moment(timestamp).format('YYYY-MM-DD')
  }, [])

  const getDecimalsAndSymbolToken = useCallback(
    async (hash: string) => {
      const cachedAsset = decimalsCache.current.get(hash)

      if (cachedAsset) {
        return cachedAsset
      }

      const tokenAsset = await blockchainServices[
        account.blockchain
      ].provider.getAssetByHash(hash)

      if (tokenAsset) {
        decimalsCache.current.set(hash, tokenAsset)

        return tokenAsset
      }

      return {
        symbol: '',
        decimals: 0,
      }
    },
    [tokens]
  )

  const handleFormatTransactions = useCallback(
    async (entries: TransactionAddressSummary[]) => {
      const formatedTransactions = new Map<string, TransactionDataScreen>()
      const formatedTransfers = new Map<string, TransfersDataScreen[]>()

      for (const entry of entries) {
        const {
          txid,
          addressFrom,
          addressTo,
          amount,
          asset,
          time,
          qtyInvocations,
          qtyNotifications,
        } = entry

        if (!txid || !time || !addressFrom || !addressTo || !amount || !asset) {
          continue
        }

        if (addressFrom !== account.address && addressTo !== account.address) {
          continue
        }

        const {decimals, symbol} = await getDecimalsAndSymbolToken(asset)

        const transfer = {
          addressFrom,
          addressTo,
          amount: String(Number(amount) / 10 ** decimals),
          asset,
          symbol,
          decimals,
        }

        let historyTransfer = formatedTransfers.get(txid)
        if (historyTransfer) {
          historyTransfer.push(transfer)
          formatedTransfers.set(txid, historyTransfer)
        } else {
          historyTransfer = [transfer]
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
          statusTransaction: i18n.t('screens.getAccount.completedTransactions'),
        })
      }

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

  const handleRenderingPendingTransactions = useCallback(
    (
      pendingTransactions: TransactionDataScreen[],
      completedTransactions: TransactionDataScreen[]
    ) => {
      if (pendingTransactions) {
        return pendingTransactions.filter(
          (pending) =>
            !completedTransactions.some(
              (completed) => completed.txid === pending.txid
            )
        )
      } else {
        return pendingTransactions
      }
    },
    [pendingTransactionsDataScreen, transactionsDataScreen]
  )

  const populatePendingTransactionList = useCallback(
    async (
      pendingTransactions: TransactionDateGroup[],
      transactionType: ITransactionType
    ) => {
      if (pendingTransactions.length <= 0) {
        return
      }

      const formatedTransactions = new Map<string, TransactionDataScreen>()
      const formatedTransfers = new Map<string, TransfersDataScreen[]>()

      for (const pendingTransaction of pendingTransactions) {
        if (!pendingTransaction.date) {
          continue
        }

        for (const transaction of pendingTransaction.transactions) {
          if (
            !transaction.sentAt ||
            !transaction.transactionHash ||
            !transaction.senderAddress ||
            !transaction.receiverAddress ||
            !transaction.token
          ) {
            continue
          }

          const tokenAsset = await getDecimalsAndSymbolToken(
            transaction.token.hash
          )

          let historyTransfer = formatedTransfers.get(
            transaction.transactionHash
          )

          const transfer = {
            addressFrom: transaction.senderAddress,
            addressTo: transaction.receiverAddress,
            amount: String(transaction.token.amount),
            asset: transaction.token.hash,
            symbol: transaction.token.symbol,
            decimals: tokenAsset.decimals,
          }

          if (historyTransfer) {
            historyTransfer.push(transfer)
            formatedTransfers.set(transaction.sentAt, historyTransfer)
          } else {
            historyTransfer = [transfer]
            formatedTransfers.set(transaction.transactionHash, historyTransfer)
          }

          formatedTransactions.set(transaction.transactionHash, {
            transactionType,
            txid: transaction.transactionHash,
            qtyInvocations: 0,
            qtyNotifications: transaction.qtyInvocations ?? 0,
            time: moment(transaction.sentAt).toDate().getTime(),
            transfers: historyTransfer,
            iconStatusTransaction: require('src/assets/images/icon-pending-white.png'),
            statusTransaction: i18n.t('components.transactionsList.title'),
          })
        }
      }

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
    },
    [account, pendingTransactionsDataScreen]
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
                ? handleRenderingPendingTransactions(
                    pendingTransactionsDataScreen[date],
                    transactionsDataScreen[date]
                  )
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
