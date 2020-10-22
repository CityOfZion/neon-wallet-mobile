import PropTypes from 'prop-types'
import React, {useState} from 'react'
import Carousel from 'react-native-snap-carousel'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import WalletCard from '~src/components/WalletCard'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout} from '~src/styles/styled-components'

interface Props {
  onPress?: (wallet: Wallet) => void
  onSelect?: (wallet: Wallet) => void
  wallets: Wallet[]
  canBeInactive?: boolean
}

const WalletPicker: React.FC<Props> = (props: Props) => {
  const {wallets} = props
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()

  const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  const [index, setIndex] = useState<number>(
    wallet ? wallets.findIndex((it) => it.id === wallet.id) : 0
  )

  const pressEvent = async (wallet: Wallet) => {
    if (props.onPress) {
      props.onPress(wallet)
    }
  }

  const selectEvent = async (index: number) => {
    setIndex(index)
    if (props.onSelect) {
      props.onSelect(wallets[index])
    }
  }

  const isInactive = (wallet: Wallet) => {
    return Boolean(wallet.isInactive && props.canBeInactive)
  }

  return (
    <Carousel<Wallet>
      layout={'default'}
      containerCustomStyle={{overflow: 'visible'}}
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
      useScrollView={true}
      firstItem={index > 0 ? index : 0}
      onLayout={() => selectEvent(0)}
      onSnapToItem={(index) => selectEvent(index)}
      renderItem={(wallet) => (
        <LinearLayout
          weight={1}
          justifyContent={'center'}
          alignItems={'center'}
          py={6}
          pointerEvents={wallet.index !== index ? 'none' : undefined}
        >
          <WalletCard
            width={240}
            onPress={
              !isInactive(wallet.item)
                ? () => pressEvent(wallet.item)
                : undefined
            }
            wallet={wallet.item}
            canBeInactive={props.canBeInactive}
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
  canBeInactive: PropTypes.bool,
}

export default WalletPicker
