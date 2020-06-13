import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {StyleSheet, ImageBackground} from 'react-native'
import {Asset} from 'react-native-unimodules'

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
  const paymentCardStyle = () => ({
    backgroundColor: props.color,
    aspectRatio: 38 / 25,
  })

  return (
    <PaymentCardView style={paymentCardStyle()}>
      <LinearLayout
        orientation={'verti'}
        width={'100%'}
        height={'100%'}
        p={5}
        style={styles.contentCard}
      >
        <LinearLayout mb={3} orientation={'horiz'} width={'100%'}>
          <ImageView width={24} height={24} my={2} source={{uri: cardNeo}} />

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

          <ImageView width={32} height={32} source={{uri: cardQrCode}} />
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
            source={{uri: cardCopy}}
            style={{opacity: 0.5}}
          />
        </LinearLayout>
      </LinearLayout>

      <ImageBackground
        source={{uri: cardPlaceholderUri}}
        resizeMode="contain"
        style={styles.placeholderCard}
      />

      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.25)',
          'rgba(255, 255, 255, 0.25)',
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 0)',
        ]}
        locations={[0, 0.5, 0.5, 1]}
        start={[0, -0.45]}
        end={[1, 1.45]}
        style={styles.brightCard}
      />

      <LinearGradient
        colors={['rgba(0, 0, 0, 0.15)', 'rgba(32, 32, 32, 0.7)']}
        style={styles.gradientCard}
      />
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

const cardCopy = Asset.fromModule(require('~src/assets/images/card-copy.png'))
  .uri
const cardNeo = Asset.fromModule(require('~src/assets/images/card-neo.png')).uri
const cardQrCode = Asset.fromModule(
  require('~src/assets/images/card-qrcode.png')
).uri
const cardPlaceholderUri = Asset.fromModule(
  require('~src/assets/images/card-placeholder.png')
).uri

const PaymentCardView = styled.View`
  width: 100%;
  border-radius: 17px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.6);
`

const styles = StyleSheet.create({
  contentCard: {
    zIndex: 100,
  },
  placeholderCard: {
    position: 'absolute',
    left: 0,
    right: '30%',
    top: '20%',
    bottom: 0,
    borderRadius: 17,
    zIndex: 30,
  },
  gradientCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 17,
    zIndex: 20,
  },
  brightCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 17,
    zIndex: 10,
  },
})

export default PaymentCard
