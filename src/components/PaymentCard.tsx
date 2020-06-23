import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {ImageBackground, LayoutChangeEvent} from 'react-native'

import {FilterHelper} from '~src/helpers/FilterHelper'
import i18n from '~src/i18n'
import styled, {
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  name?: string
  balance?: number
  currency?: string
  address?: string
  color?: string
}

const PaymentCard: React.FC<Props> = (props) => {
  const [viewHeight, setViewHeight] = useState<number>(0)
  const unit = (viewHeight * 0.1) / 24

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)
  }

  return (
    <PaymentCardView
      onLayout={layoutEvent}
      width={'100%'}
      style={{backgroundColor: props.color, aspectRatio: 38 / 25}}
      borderRadius={17 * unit}
    >
      <BrightCard
        colors={[
          'rgba(255, 255, 255, 0.25)',
          'rgba(255, 255, 255, 0.25)',
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 0)',
        ]}
        locations={[0, 0.5, 0.5, 1]}
        start={[0, -0.6]}
        end={[1, 1.6]}
        style={{borderRadius: 17 * unit}}
      />

      <ShadowCard
        colors={['rgba(0, 0, 0, 0.15)', 'rgba(32, 32, 32, 0.7)']}
        style={{borderRadius: 17 * unit}}
      />

      <StampCard
        source={require('~src/assets/images/card-placeholder.png')}
        resizeMode="contain"
        style={{borderRadius: 17 * unit}}
      />

      <LinearLayout
        orientation={'verti'}
        width={'100%'}
        height={'100%'}
        p={15 * unit}
      >
        <LinearLayout mb={3 * unit} orientation={'horiz'} width={'100%'}>
          <ImageView
            width={24 * unit}
            height={24 * unit}
            my={2 * unit}
            source={require('~src/assets/images/card-neo.png')}
          />

          <TextView
            weight={1}
            fontSize={24 * unit}
            color="white"
            textAlign="left"
            fontWeight="bold"
            mx={10 * unit}
          >
            {props.name}
          </TextView>

          <ImageView
            width={32 * unit}
            height={32 * unit}
            source={require('~src/assets/images/card-qrcode.png')}
          />
        </LinearLayout>

        <TextView
          mb={3 * unit}
          fontSize={14 * unit}
          color="white"
          textAlign="left"
          fontWeight="bold"
        >
          {i18n.t('paymentCard.balance')}
        </TextView>

        <LinearLayout
          orientation={'verti'}
          justifyContent={'center'}
          alignItems={'center'}
          weight={1}
        >
          <TextView
            mb={3 * unit}
            fontSize={48 * unit}
            color="white"
            textAlign="center"
            fontWeight="bold"
          >
            {FilterHelper.currency(props.balance, props.currency, false, false)}
          </TextView>
        </LinearLayout>

        <TextView
          mb={2 * unit}
          fontSize={14 * unit}
          color="white"
          textAlign="left"
          fontWeight="bold"
        >
          {i18n.t('paymentCard.address')}
        </TextView>

        <LinearLayout orientation={'horiz'} width={'100%'}>
          <TextView
            weight={1}
            fontSize={14 * unit}
            color="white"
            opacity={0.5}
            textAlign="left"
          >
            {props.address}
          </TextView>

          <ImageView
            mt={-3 * unit}
            width={20 * unit}
            height={24 * unit}
            source={require('~src/assets/images/card-copy.png')}
            style={{opacity: 0.5}}
          />
        </LinearLayout>
      </LinearLayout>
    </PaymentCardView>
  )
}

PaymentCard.propTypes = {
  name: PropTypes.string,
  balance: PropTypes.number,
  currency: PropTypes.string,
  address: PropTypes.string,
  color: PropTypes.string,
}

PaymentCard.defaultProps = {
  color: '#00aaff',
}

const PaymentCardView = styled(LinearLayout)`
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.6);
  elevation: 8;
`

const BrightCard = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const ShadowCard = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const StampCard = styled(ImageBackground)`
  position: absolute;
  left: 0;
  right: 30%;
  top: 20%;
  bottom: 0;
`

export default PaymentCard
