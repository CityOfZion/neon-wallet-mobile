import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import BalanceList from '~src/components/BalanceList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Account} from '~src/models/redux/Account'
import {RootStore} from '~src/store/RootStore'
import {TextView, LinearLayout, ButtonView} from '~src/styles/styled-components'

const AccountAssetScreen = () => {
  const dispatchAccount = useDispatch<SyncDispatch<Account>>()

  const [account, setAccount] = useState(
    dispatchAccount(RootStore.account.actions.getFromSelection())
  )
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  useEffect(() => {
    const upAccount =
      accountsPool.find((acc) => acc.address === account.address) ??
      new Account()

    setAccount(upAccount)
  }, [accountsPool])

  return (
    <ScreenLayout>
      <AccountSubTitle account={account} />
      <BalanceList
        my="16px"
        tokenAssets={account.getTokenAssets()}
        address={account.address ?? undefined}
        showHoldingValueColumn={false}
        showBlockchain={true}
        fromAccountView={false}
        fromSendAccountSelectionModal={false}
        zeroBalance={true}
      />
    </ScreenLayout>
  )
}

export default AccountAssetScreen
