import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {ImageBackground} from 'react-native'

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
  return (
    <PaymentCardView
      width={'100%'}
      style={{backgroundColor: props.color, aspectRatio: 38 / 25}}
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
      />

      <ShadowCard colors={['rgba(0, 0, 0, 0.15)', 'rgba(32, 32, 32, 0.7)']} />

      <StampCard
        source={require('~src/assets/images/card-placeholder.png')}
        resizeMode="contain"
      />

      <LinearLayout orientation={'verti'} width={'100%'} height={'100%'} p={5}>
        <LinearLayout mb={3} orientation={'horiz'} width={'100%'}>
          <ImageView
            width={24}
            height={24}
            my={2}
            source={require('~src/assets/images/card-neo.png')}
          />

          <TextView
            weight={1}
            fontSize="2xl"
            color="white"
            textAlign="left"
            fontWeight="bold"
            mx={4}
          >
            {props.name}
          </TextView>

          <ImageView
            width={32}
            height={32}
            source={require('~src/assets/images/card-qrcode.png')}
          />
        </LinearLayout>

        <TextView
          mb={3}
          fontSize="sm"
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
            mb={3}
            fontSize="4xl"
            color="white"
            textAlign="center"
            fontWeight="bold"
          >
            {FilterHelper.currency(props.balance, props.currency, false, false)}
          </TextView>
        </LinearLayout>

        <TextView
          mb={2}
          fontSize="sm"
          color="white"
          textAlign="left"
          fontWeight="bold"
        >
          {i18n.t('paymentCard.address')}
        </TextView>

        <LinearLayout orientation={'horiz'} width={'100%'}>
          <TextView
            weight={1}
            fontSize="sm"
            color="white"
            opacity={0.5}
            textAlign="left"
          >
            {props.address}
          </TextView>

          <ImageView
            mt={-3}
            width={20}
            height={24}
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
  border-radius: 17px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.6);
`

const BrightCard = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 17px;
`

const ShadowCard = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 17px;
`

const StampCard = styled(ImageBackground)`
  position: absolute;
  left: 0;
  right: 30%;
  top: 20%;
  bottom: 0;
  border-radius: 17px;
`

export default PaymentCard
