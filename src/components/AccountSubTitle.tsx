import React from 'react'

import { Account } from '../store/account/Account'
import { ButtonView, LinearLayout, TextView } from '../styles/styled-components'

interface Props {
  account: Account
}

const AccountSubTitle = ({ account }: Props) => {
  return (
    <LinearLayout orientation="horiz" justifyContent="center" alignItems="center">
      <ButtonView borderRadius={100} disabled width={12} height={12} backgroundColor={account.backgroundColor} mr={3} />

      <TextView color="text.2">{account.name.toUpperCase()}</TextView>
    </LinearLayout>
  )
}

export default AccountSubTitle
