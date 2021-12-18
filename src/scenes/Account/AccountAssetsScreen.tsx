import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

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

  console.log(account)

  return (
    <ScreenLayout>
      <LinearLayout
        orientation={'horiz'}
        justifyContent={'center'}
        mb={3}
        alignItems={'center'}
      >
        <ButtonView
          borderRadius={100}
          disabled={true}
          width={12}
          height={12}
          backgroundColor={account.backgroundColor}
          mr={3}
        />

        <TextView color={'text.2'}>{account.name?.toUpperCase()}</TextView>
      </LinearLayout>
      <BalanceList
        my="16px"
        tokenAssets={account.getTokenAssets()}
        address={account.address ?? undefined}
        fromAccountView={true}
        parentScreen={'assets'}
        fromListWalletView={false}
        fromSendAccountSelectionModal={false}
        zeroBalance={true}
      />
    </ScreenLayout>
  )
}

export default AccountAssetScreen
