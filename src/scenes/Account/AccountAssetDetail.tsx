import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AssetQuoteComponent from '~src/components/AssetQuoteComponent'
import TransactionsList from '~src/components/TransactionsList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {TokenAsset} from '~src/models/TokenAsset'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Account} from '~src/models/redux/Account'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {LinearLayout} from '~src/styles/styled-components'

interface AccountAssetDetailProps {
  route: RouteProp<WalletStackParamList, 'AccountAssetDetail'>
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

export interface AccountAssetDetailParams {
  token: TokenAsset
  address: string
}

const AccountAssetDetail = (props: AccountAssetDetailProps) => {
  const {token, address} = props.route.params

  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const [transactions, setTransactions] = useState<TransactionDateGroup[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const account = accountsPool.find((it) => it.address === address)

  useEffect(() => {
    Facade.await.run('populateTransaction', () => fetchTransaction(1))
  }, [])

  const fetchTransaction = async (currentPage: number, collector = 0) => {
    const model = Facade.utils.clone(account ?? new Account())

    const pagination = await model.populateTransactions(tokensPool, currentPage)
    setCurrentPage(pagination.pageNumber + 1)

    // Apply filter
    const senderTxs = pagination.entries.filter(
      (it) => it.token?.hash === token.hash
    )

    const transactions = TransactionDateGroup.toTransactionDateGroup(senderTxs)
    setTransactions(transactions)

    collector += senderTxs.length
    if (collector < (pagination.pageSize ?? 0)) {
      // handling pagination with post filter
      await fetchTransaction(pagination.pageNumber + 1, collector)
    }
  }

  return (
    <ScreenLayout
      onReachBottom={() => {
        if (Facade.await.inAction('loadMoreTransaction')) return
        Facade.await.run(
          'loadMoreTransaction',
          () => fetchTransaction(currentPage),
          500
        )
      }}
    >
      <AwaitActivity
        name={'populateTransaction'}
        loadingView={<ScreenLoader />}
      >
        <>
          <LinearLayout mb={5}>
            <AssetQuoteComponent token={token} />
          </LinearLayout>

          <TransactionsList
            address={address}
            transactionGroups={transactions}
          />

          <AwaitActivity
            name={'loadMoreTransaction'}
            size={'large'}
            style={{minHeight: 100}}
          />
        </>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default AccountAssetDetail
