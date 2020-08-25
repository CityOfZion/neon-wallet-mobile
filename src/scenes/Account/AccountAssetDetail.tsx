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
import {AddressPaginatedRequest} from '~src/models/request/AddressPaginatedRequest'
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
  const {tokens} = useSelector((state: RootState) => state.app)
  const {token, address} = props.route.params

  const [transactions, setTransactions] = useState<TransactionDateGroup[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    Facade.await.run('populateTransaction', () => fetchTransaction(1))
  }, [])

  const fetchTransaction = async (currentPage: number, collector = 0) => {
    const request = new AddressPaginatedRequest(address, currentPage)
    const response = await request.getAddressAbstracts()

    if (currentPage > (response.totalPages ?? 0)) return

    response.entries = response.entries.filter((it) => it.asset === token.hash)

    setTransactions((val) =>
      val.concat(response.toTransactionDateGroup(tokens))
    )
    setCurrentPage(currentPage + 1)

    collector += response.entries.length
    if (collector < (response.pageSize ?? 0)) {
      // handling pagination with post filter
      await fetchTransaction(currentPage + 1, collector)
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
