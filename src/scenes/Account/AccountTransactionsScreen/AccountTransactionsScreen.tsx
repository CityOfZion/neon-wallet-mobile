import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
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

  const pageControl = useRef<number>(1)

  const { isFetchingNextPage, isFetching, fetchNextPage, isLoading, data, isRefetching, refetch } = useInfiniteQuery({
    queryKey: ['transactions', account.blockchain, account.address],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await blockchainService.blockchainDataService.getTransactionsByAddress({
        address: account.address,
        page: pageParam,
      })
      return { pageParam, ...response }
    },
    getNextPageParam: lastPage => {
      const nextPage = lastPage.pageParam + 1
      const totalPages = Math.ceil(lastPage.totalCount / lastPage.limit)

      return pageControl.current < totalPages ? nextPage : undefined
    },
  })

  const transactions = useMemo(() => data?.pages.flatMap(page => page.transactions), [data])

  const handleEndReached = () => {
    if (isFetching) return
    fetchNextPage()
  }

  return (
    <ScreenLayout withoutScrollView>
      <AccountSubTitle account={account} />
      {isLoading ? (
        <ScreenLoader transparent />
      ) : (
        <TransactionsList
          account={account}
          exchange={exchange}
          transactions={transactions ?? []}
          onEndReached={handleEndReached}
          showMoreLoading={isFetchingNextPage}
          isRefetching={isRefetching}
          refetch={refetch}
        />
      )}
    </ScreenLayout>
  )
}

export default AccountTransactionsScreen
