import React from 'react'
import Carousel from 'react-native-snap-carousel'

import { applicationConfig } from '~/src/config/ApplicationConfig'
import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import AccountCard from '~src/components/AccountCard'
import { Account } from '~src/models/redux/Account'
import { LinearLayout } from '~src/styles/styled-components'

interface Props {
  onPress?: (account: Account) => void
  onSelect?: (account: Account) => void
  accounts: Account[]
  isCompacted?: boolean
  balancesExchange: UseMultipleBalanceAndExchangeResult
}

const AccountPicker: React.FC<Props> = ({
  isCompacted = true,
  accounts,
  onPress,
  onSelect,
  balancesExchange,
}: Props) => {
  const handlePress = async (account: Account) => {
    if (onPress) onPress(account)
  }

  const handleSelect = async (index: number) => {
    if (onSelect) onSelect(accounts[index])
  }

  const getAccountBalanceExchange = (account: Account) => {
    if (!account.address) return

    return balancesExchange.findByBalanceKey(account.address)
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
        <LinearLayout justifyContent="center" alignItems="center">
          <AccountCard
            balanceExchange={getAccountBalanceExchange(item)}
            hideBalance={false}
            onPress={() => handlePress(item)}
            account={item}
            isCompacted={isCompacted}
            hideCopy
            hideQRCode
          />
        </LinearLayout>
      )}
    />
  )
}

export default AccountPicker
