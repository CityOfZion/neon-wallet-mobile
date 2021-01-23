import PropTypes from 'prop-types'
import React from 'react'
import Carousel from 'react-native-snap-carousel'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import {Account} from '~src/models/redux/Account'
import {LinearLayout} from '~src/styles/styled-components'

interface Props {
  onPress?: (account: Account) => void
  onSelect?: (account: Account) => void
  accounts: Account[]
}

const AccountPicker: React.FC<Props> = (props: Props) => {
  const {accounts} = props

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
      layout={'default'}
      data={accounts}
      sliderWidth={Facade.app.windowWidth}
      itemWidth={Facade.scale(Facade.app.windowWidth) as number}
      inactiveSlideScale={0.9}
      inactiveSlideOpacity={1}
      inactiveSlideShift={12}
      lockScrollWhileSnapping={true}
      lockScrollTimeoutDuration={200}
      activeSlideOffset={5}
      swipeThreshold={5}
      enableSnap={true}
      useScrollView={true}
      firstItem={0}
      onSnapToItem={(index) => selectEvent(index)}
      renderItem={(accountList: {item: Account; index: number}) => {
        const {item} = accountList
        return (
          <LinearLayout
            weight={1}
            justifyContent={'center'}
            alignItems={'center'}
            py={6}
          >
            <AccountCard
              onPress={() => pressEvent(item)}
              account={item}
              isCompacted={true}
              hideCopy={true}
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
  accounts: PropTypes.arrayOf(PropTypes.instanceOf(Account).isRequired)
    .isRequired,
}

export default AccountPicker
