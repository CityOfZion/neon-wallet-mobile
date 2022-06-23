import PropTypes from 'prop-types'
import React from 'react'
import Carousel from 'react-native-snap-carousel'

import { Normalize } from '~/src/app/Normalize'
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

const AccountPicker: React.FC<Props> = (props: Props) => {
  const { accounts } = props

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
      itemWidth={Normalize.scale(applicationConfig.windowWidth - 150) as number}
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
      renderItem={(accountList: { item: Account; index: number }) => {
        const { item } = accountList
        return (
          <LinearLayout justifyContent="center" alignItems="center">
            <AccountCard
              onPress={() => pressEvent(item)}
              account={item}
              isCompacted={props.isCompacted}
              hideCopy
              hideQRCode
            />
          </LinearLayout>
        )
      }}
    />
  )
}

AccountPicker.propTypes = {
  onPress: PropTypes.func,
  onSelect: PropTypes.func,
  accounts: PropTypes.arrayOf(PropTypes.instanceOf(Account).isRequired).isRequired,
  isCompacted: PropTypes.bool,
}

AccountPicker.defaultProps = {
  isCompacted: true,
}

export default AccountPicker
