import PropTypes from 'prop-types'
import React from 'react'
import Carousel from 'react-native-snap-carousel'

import {Facade} from '~src/app/Facade'
import WalletCard from '~src/components/WalletCard'
import {Wallet} from '~src/models/redux/Wallet'
import {LinearLayout} from '~src/styles/styled-components'

interface Props {
  onPress?: (wallet: Wallet) => void
  onSelect?: (wallet: Wallet) => void
  wallets: Wallet[]
}

const WalletPicker: React.FC<Props> = (props: Props) => {
  const {wallets} = props

  const pressEvent = async (wallet: Wallet) => {
    if (props.onPress) {
      props.onPress(wallet)
    }
  }

  const selectEvent = async (index: number) => {
    if (props.onSelect) {
      props.onSelect(wallets[index])
    }
  }

  return (
    <Carousel<Wallet>
      layout={'default'}
      data={wallets}
      sliderWidth={Facade.app.windowWidth}
      itemWidth={240}
      inactiveSlideScale={0.8}
      inactiveSlideOpacity={1}
      inactiveSlideShift={12}
      lockScrollWhileSnapping={true}
      lockScrollTimeoutDuration={200}
      activeSlideOffset={5}
      swipeThreshold={5}
      enableSnap={true}
      firstItem={0}
      onLayout={() => selectEvent(0)}
      onSnapToItem={(index) => selectEvent(index)}
      renderItem={({item}) => (
        <LinearLayout
          weight={1}
          justifyContent={'center'}
          alignItems={'center'}
          py={6}
        >
          <WalletCard
            width={240}
            onPress={() => pressEvent(item)}
            wallet={item}
          />
        </LinearLayout>
      )}
    />
  )
}

WalletPicker.propTypes = {
  onPress: PropTypes.func,
  onSelect: PropTypes.func,
  wallets: PropTypes.arrayOf(PropTypes.instanceOf(Wallet).isRequired)
    .isRequired,
}

export default WalletPicker
