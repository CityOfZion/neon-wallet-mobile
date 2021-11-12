import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useState, useCallback} from 'react'
import {useSelector} from 'react-redux'

import {UtilsHelper} from '~/src/helpers/UtilsHelper'
import {Wallet} from '~/src/models/redux/Wallet'
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
  walletId?: string
}

const AccountAssetDetail = (props: AccountAssetDetailProps) => {
  const {token, address, walletId} = props.route.params

  const tokensPool = useSelector((state: RootState) => state.app.tokens)
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const walletsPool = useSelector((state: RootState) => state.app.wallets)

  const [transactions, setTransactions] = useState<TransactionDateGroup[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const account = accountsPool.find((it) => it.address === address)
  const wallet = walletsPool.find((it) => it.id === walletId)

  useEffect(() => {
    Await.run('populateTransaction', () => fetchTransaction(1))
  }, [])

  const fixStringHashToken = useCallback(
    (hash?: string) => {
      if (!hash?.includes('0x')) {
        return '0x' + hash
      }
      return hash
    },
    [token, wallet]
  )

  const fetchTransactionAccount = useCallback(
    async (account: Account, currentPage: number) => {
      const {entries} = await account.populateTransactions(
        tokensPool,
        currentPage
      )
      const senderTxs = entries.filter((it) => {
        return fixStringHashToken(it.token?.hash) === token.hash
      })
      const transactions = TransactionDateGroup.toTransactionDateGroup(
        senderTxs
      )
      setTransactions(transactions)
      return senderTxs.length
    },
    [account, token]
  )

  const fetchTransactionWallet = useCallback(
    async (wallet: Wallet) => {
      const entries = await wallet.getTransactions(
        accountsPool,
        tokensPool,
        currentPage
      )

      const senderTxs = entries.filter((it) => {
        return fixStringHashToken(it.token?.hash) === token.hash
      })

      const transactions = TransactionDateGroup.toTransactionDateGroup(
        senderTxs
      )

      setTransactions(transactions)
      return senderTxs.length
    },
    [wallet, token]
  )

  const fetchTransaction = async (currentPage: number, collector = 0) => {
    let countCollector: number = 0
    if (wallet) {
      countCollector = await fetchTransactionWallet(wallet)

      collector += countCollector

      return
    } else if (account) {
      countCollector = await fetchTransactionAccount(account, currentPage)
      collector += countCollector
    }

    const model = UtilsHelper.clone(account ?? new Account())

    const pagination = await model.populateTransactions(tokensPool, currentPage)
    setCurrentPage(pagination.pageNumber + 1)

    if (collector < 15) {
      // handling pagination with post filter
      await fetchTransaction(currentPage + 1, collector)
    }
  }

  return (
    <ScreenLayout
      onReachBottom={() => {
        if (Await.inAction('loadMoreTransaction')) return
        Await.run(
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
