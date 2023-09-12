import { TransactionResponse } from '@cityofzion/blockchain-service'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useCallback, useState, useEffect, useRef } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { TransactionsList } from './TransactionsList'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import { useExchange } from '~/src/hooks/useExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
export interface AccountTransactionsScreenParams {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'AccountTransactionsScreen'>
}

const AccountTransactionsScreen = (props: Props) => {
  const { account } = props.route.params

  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[account.blockchain]
  )
  const { data: exchange } = useExchange()

  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [showMoreLoading, setShowMoreLoading] = useState(true)

  const pageControl = useRef<number>(1)

  const handleEndReached = async () => {
    loadCompletedTransactions()
  }

  const loadCompletedTransactions = useCallback(async () => {
    if (!showMoreLoading) return

    try {
      const { transactions, totalCount, limit } =
        await blockchainService.blockchainDataService.getTransactionsByAddress({
          address: account.address,
          page: pageControl.current,
        })

      setTransactions(prevState => [...transactions, ...prevState])
      pageControl.current += 1
      const totalPages = Math.ceil(totalCount / limit)

      setShowMoreLoading(pageControl.current < totalPages)
    } catch {
      showMessage({
        message: i18n.t('screens.accountTransaction.errorToGetTransactions'),
        type: 'danger',
      })
      setShowMoreLoading(false)
    }
  }, [account, blockchainService])

  useEffect(() => {
    Await.run('populateTransactions', async () => {
      await loadCompletedTransactions()
    })
  }, [])

  return (
    <ScreenLayout withoutScrollView>
      <AccountSubTitle account={account} />
      <AwaitActivity name="populateTransactions" loadingView={<ScreenLoader />}>
        <TransactionsList
          account={account}
          exchange={exchange}
          transactions={transactions}
          onEndReached={handleEndReached}
          showMoreLoading={showMoreLoading}
        />
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default AccountTransactionsScreen
