import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import moment from 'moment'
import React, {useCallback, useState, useEffect, useRef} from 'react'
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native'

import {TransactionsListDate} from './TransactionsListDate'

import {blockchainServices} from '~/src/blockchain'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {Loader} from '~/src/components/loader/loader'
import {TransactionAddressSummary} from '~/src/models/TransactionAddressSummary'
import {TransactionDateGroup} from '~/src/models/TransactionDateGroup'
import {Account} from '~/src/models/redux/Account'
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
  hash: string
  decimals: number
  symbol: string
}

export type ITransactionType = 'wcTransaction' | 'sendTransaction'

export interface TransactionDataScreen {
  txid: string
  time: number
  qtyInvocations: number
  qtyNotifications: number
  transfers: TransfersDataScreen[]
  transactionType: ITransactionType
}

const AccountTransactionsScreen = (props: Props) => {
  const {account} = props.route.params

  const [completedTransactions, setCompletedTransactions] = useState<
    TransactionDataScreen[]
  >([])
  const [pendingTransactions, setPendingTransactions] = useState<
    TransactionDataScreen[]
  >([])
  const [hasMoreTransactionsToLoad, setHasMoreTransactionsToLoad] = useState<
    boolean
  >(true)

  const pageControl = useRef<number>(1)
  const requestControl = useRef<boolean>(false)
  const completedTransactionsHash = useRef<string[]>([])
  const decimalsCache = useRef<Map<string, {symbol: string; decimals: number}>>(
    new Map(
      blockchainServices[
        account.blockchain
      ].assets.map(({symbol, decimals, hash}) => [hash, {symbol, decimals}])
    )
  )

  const handleOnScroll = async (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (
      event.nativeEvent.contentOffset.y >=
      event.nativeEvent.contentSize.height * 0.7
    ) {
      handleLoadTransactions()
    }
  }

  const handleLoadTransactions = useCallback(async () => {
    if (
      account.address &&
      !requestControl.current &&
      hasMoreTransactionsToLoad
    ) {
      requestControl.current = true

      const {transactions, totalPages} = await blockchainServices[
        account.blockchain
      ].provider.getAddressAbstracts(account.address, pageControl.current)

      await handleFormatTransactions(transactions)

      pageControl.current += 1
      requestControl.current = false

      if (totalPages && pageControl.current > totalPages) {
        setHasMoreTransactionsToLoad(false)
      }
    }
  }, [account])

  const getDecimalsAndSymbolToken = useCallback(async (hash: string) => {
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
  }, [])

  const handleFormatTransactions = useCallback(
    async (transactions: TransactionAddressSummary[]) => {
      const formatedTransactions: TransactionDataScreen[] = []

      for (const transaction of transactions) {
        const {
          hash,
          time,
          qtyInvocations,
          qtyNotifications,
          transfers,
        } = transaction

        const formatedTransfers: TransfersDataScreen[] = []

        for (const transfer of transfers) {
          const {amount, hash, from, to} = transfer

          if (from !== account.address && to !== account.address) {
            continue
          }

          const {decimals, symbol} = await getDecimalsAndSymbolToken(hash)

          formatedTransfers.push({
            addressFrom: from,
            addressTo: to,
            amount: String(amount / 10 ** decimals),
            hash,
            symbol,
            decimals,
          })
        }

        formatedTransactions.push({
          transactionType: 'sendTransaction',
          txid: hash,
          qtyInvocations,
          qtyNotifications,
          time,
          transfers: formatedTransfers,
        })
      }

      completedTransactionsHash.current = formatedTransactions.map(
        ({txid}) => txid
      )

      setCompletedTransactions((prevState) => [
        ...prevState,
        ...formatedTransactions,
      ])
    },
    [getDecimalsAndSymbolToken]
  )

  const populatePendingTransactionList = useCallback(
    async (
      pendingTransactions: TransactionDateGroup[],
      transactionType: ITransactionType
    ) => {
      if (pendingTransactions.length <= 0) {
        return
      }

      const formatedPendingTransactionsMap = new Map<
        string,
        TransactionDataScreen
      >()

      for (const pendingTransaction of pendingTransactions) {
        if (!pendingTransaction.date) {
          continue
        }

        for (const transaction of pendingTransaction.transactions) {
          const {
            sentAt,
            transactionHash,
            senderAddress,
            receiverAddress,
            token,
          } = transaction

          if (
            !sentAt ||
            !transactionHash ||
            !senderAddress ||
            !receiverAddress ||
            !token
          ) {
            continue
          }

          const {decimals, symbol} = await getDecimalsAndSymbolToken(token.hash)

          const transfer: TransfersDataScreen = {
            addressFrom: senderAddress,
            addressTo: receiverAddress,
            amount: String(token.amount / 10 ** decimals),
            hash: token.hash,
            symbol,
            decimals,
          }

          const exitingTransaction = formatedPendingTransactionsMap.get(
            transactionHash
          )

          if (exitingTransaction) {
            formatedPendingTransactionsMap.set(transactionHash, {
              ...exitingTransaction,
              transfers: [...exitingTransaction.transfers, transfer],
            })
            continue
          }

          const transactionDataScreen: TransactionDataScreen = {
            txid: transactionHash,
            transactionType,
            qtyInvocations: 0,
            qtyNotifications: 0,
            time: moment(sentAt).unix(),
            transfers: [transfer],
          }

          formatedPendingTransactionsMap.set(
            transactionHash,
            transactionDataScreen
          )
        }
      }

      const formatedPendingTransactions = Array.from(
        formatedPendingTransactionsMap.values()
      )

      const filteredTransactions = formatedPendingTransactions.filter(
        (pendingTransaction) =>
          !completedTransactionsHash.current.some(
            (completedTransactionHash) =>
              completedTransactionHash === pendingTransaction.txid
          )
      )

      setPendingTransactions((prevState) => [
        ...prevState,
        ...filteredTransactions,
      ])
    },
    [getDecimalsAndSymbolToken]
  )

  useEffect(() => {
    Await.run('populateTransactionsList', handleLoadTransactions)
  }, [handleLoadTransactions])

  useEffect(() => {
    const wcPendingTransactions = account
      .getPendingTransactions()
      .filter((it) =>
        it.transactions.filter((it) => it.qtyInvocations !== null)
      )
    const sendPendingTransactions = account.getPendingTransactions()

    if (wcPendingTransactions.length > 0) {
      populatePendingTransactionList(wcPendingTransactions, 'wcTransaction')
      return
    }

    if (sendPendingTransactions.length > 0) {
      populatePendingTransactionList(sendPendingTransactions, 'sendTransaction')
    }
  }, [populatePendingTransactionList])

  return (
    <AwaitActivity
      name="populateTransactionsList"
      loadingView={<ScreenLoader />}
    >
      <ScreenLayout onScroll={handleOnScroll}>
        <AccountSubTitle account={account} />
        <TransactionsListDate
          completedTransactions={completedTransactions}
          pendingTransactions={pendingTransactions}
        />

        {hasMoreTransactionsToLoad && <Loader />}
      </ScreenLayout>
    </AwaitActivity>
  )
}

export default AccountTransactionsScreen
