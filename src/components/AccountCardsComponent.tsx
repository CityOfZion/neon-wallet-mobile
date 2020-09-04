import React, {Fragment} from 'react'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import {Account} from '~src/models/redux/Account'
import {LinearLayout} from '~src/styles/styled-components'

const AccountCardsComponent = (props: {
  accounts: Account[]
  onPress: () => void
}) => {
  return (
    <Fragment>
      {props.accounts.map((account: Account, i: number) => {
        const marginTop = i !== 0 ? Facade.scale(-240) : undefined
        const marginX = i !== 0 ? Facade.scale(-1) : undefined

        return (
          <LinearLayout key={i} marginTop={marginTop} mx={marginX}>
            <AccountCard
              account={account}
              isCompacted={true}
              isStackMode={i !== props.accounts.length - 1}
              onPress={props.onPress}
            />
          </LinearLayout>
        )
      })}
    </Fragment>
  )
}

export default AccountCardsComponent
