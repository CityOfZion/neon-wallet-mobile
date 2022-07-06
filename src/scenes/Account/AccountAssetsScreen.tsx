import React, { useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import { useExchange } from '~/src/hooks/useExchange'
import { SyncDispatch } from '~/src/types/reducers/root'
import BalanceList from '~src/components/BalanceList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { Account } from '~src/models/redux/Account'
import { RootState, RootStore } from '~src/store/RootStore'

const AccountAssetScreen = () => {
  const dispatchAccount = useDispatch<SyncDispatch<Account>>()

  const [account, setAccount] = useState(dispatchAccount(RootStore.account.actions.getFromSelection()))
  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const currency = useSelector((state: RootState) => state.settings.currency)
  const { exchange, isRefetching, refetch } = useExchange({ filter: { currencies: currency } })

  useEffect(() => {
    const upAccount = accountsPool.find(acc => acc.address === account.address) ?? new Account()

    setAccount(upAccount)
  }, [accountsPool])

  return (
    <ScreenLayout
      refreshControl={<RefreshControl tintColor="#fff" refreshing={isRefetching} onRefresh={refetch} />}
      darkerSolidColorBG
    >
      <AccountSubTitle account={account} />
      <BalanceList
        exchange={exchange}
        my="16px"
        tokenAssets={account.getTokenAssets()}
        showHoldingValue={false}
        showBlockchain
      />
    </ScreenLayout>
  )
}

export default AccountAssetScreen
