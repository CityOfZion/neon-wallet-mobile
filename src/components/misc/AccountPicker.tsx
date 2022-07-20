import React from 'react'
import Carousel from 'react-native-snap-carousel'

import { applicationConfig } from '~/src/config/ApplicationConfig'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { Balance } from '~/src/types/balance'
import { MultiExchange } from '~/src/types/exchange'
import AccountCard from '~src/components/AccountCard'
import { Account } from '~src/models/redux/Account'
import { LinearLayout } from '~src/styles/styled-components'

interface Props {
  onPress?: (account: Account) => void
  onSelect?: (account: Account) => void
  accounts: Account[]
  isCompacted?: boolean
  exchange?: MultiExchange
  balances?: Balance[]
}

interface ItemProps {
  exchange?: MultiExchange
  balance?: Balance
  account: Account
  onPress(): void
  isCompacted?: boolean
}

const Item = React.memo(({ balance, exchange, account, onPress, isCompacted }: ItemProps) => {
  return (
    <LinearLayout justifyContent="center" alignItems="center">
      <AccountCard
        balance={balance}
        exchange={exchange}
        onPress={onPress}
        account={account}
        isCompacted={isCompacted}
        hideCopy
        hideQRCode
      />
    </LinearLayout>
  )
})

const AccountPicker: React.FC<Props> = ({
  isCompacted = true,
  accounts,
  exchange,
  onPress,
  onSelect,
  balances,
}: Props) => {
  const handlePress = async (account: Account) => {
    if (onPress) onPress(account)
  }

  const handleSelect = async (index: number) => {
    if (onSelect) onSelect(accounts[index])
  }

  return (
    <Carousel<Account>
      layout="default"
      data={accounts}
      sliderWidth={applicationConfig.windowWidth}
      itemWidth={applicationConfig.windowWidth - 125}
      inactiveSlideScale={0.9}
      inactiveSlideOpacity={1}
      inactiveSlideShift={12}
      lockScrollWhileSnapping
      lockScrollTimeoutDuration={200}
      activeSlideOffset={5}
      swipeThreshold={5}
      enableSnap
      useScrollView
      onSnapToItem={index => handleSelect(index)}
      renderItem={({ item, index }) => (
        <Item
          account={item}
          isCompacted={isCompacted}
          exchange={exchange}
          balance={BalanceHelper.getBalanceByAccount(item, balances)}
          onPress={() => handlePress(item)}
        />
      )}
    />
  )
}

export default AccountPicker
