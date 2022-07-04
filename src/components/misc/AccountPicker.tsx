import React from 'react'
import Carousel from 'react-native-snap-carousel'

import { applicationConfig } from '~/src/config/ApplicationConfig'
import AccountCard from '~src/components/AccountCard'
import { Account } from '~src/models/redux/Account'
import { LinearLayout } from '~src/styles/styled-components'

interface Props {
  onPress?: (account: Account) => void
  onSelect?: (account: Account) => void
  accounts: Account[]
  initialAccount?: number
  isCompacted?: boolean
}

const AccountPicker: React.FC<Props> = ({ isCompacted = true, accounts, ...props }: Props) => {
  const pressEvent = async (account: Account) => {
    if (props.onPress) {
      props.onPress(account)
    }
  }

  const selectEvent = async (index: number) => {
    if (props.onSelect) {
      props.onSelect(accounts[index])
    }
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
      firstItem={props.initialAccount ? props.initialAccount : 0}
      onSnapToItem={index => selectEvent(index)}
      renderItem={({ item }) => (
        <LinearLayout justifyContent="center" alignItems="center">
          <AccountCard onPress={() => pressEvent(item)} account={item} isCompacted={isCompacted} hideCopy hideQRCode />
        </LinearLayout>
      )}
    />
  )
}

export default AccountPicker
