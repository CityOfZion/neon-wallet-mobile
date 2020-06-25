import {LinearGradient} from 'expo-linear-gradient'
import React, {useState} from 'react'
import {StyleSheet, ImageBackground} from 'react-native'
import {Account} from '~src/models/Account'

import {FilterHelper} from '~src/helpers/FilterHelper'
import i18n from '~src/i18n'
import styled, {
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  account: Account
  cardSize: number
  index: number
  marginTopForAbsolute: number
  lastCard: boolean
}
const AccountCardView: React.FC<Props> = (props) => {
  const marginTop = props.index * props.marginTopForAbsolute

  return (
    <AccountCard
      mt={marginTop}
      width={'100%'}
      height={props.cardSize}
      style={{
        backgroundColor: props.account.backgroundColor,
        aspectRatio: 38 / 25,
      }}
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

      {props.lastCard && (
        <StampCard
          source={require('~src/assets/images/card-placeholder.png')}
          resizeMode="contain"
        />
      )}

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
            fontSize={21}
            color="white"
            textAlign="left"
            fontFamily="semibold"
            mx={4}
          >
            {props.account.title}
          </TextView>

          <LinearLayout orientation="verti">
            <TextView color="white" fontSize={12} fontFamily="bold">
              {i18n.t('paymentCard.balance')}
            </TextView>
            <TextView color="white" fontSize={21} fontFamily="semibold">
              {FilterHelper.currency(props.account.balance, '$', false, false)}
            </TextView>
          </LinearLayout>
        </LinearLayout>

        {props.lastCard && <LinearLayout weight={1} />}

        <TextView
          mb={2}
          fontSize={12}
          color="white"
          textAlign="left"
          fontFamily="semibold"
        >
          {i18n.t('paymentCard.address')}
        </TextView>

        <TextView
            weight={1}
            fontFamily="medium"
            fontSize="16"
            color="white"
            opacity={0.5}
            textAlign="left"
          >
            {props.account.address}
          </TextView>

      </LinearLayout>
    </AccountCard>
  )
}

const AccountCard = styled(LinearLayout)`
  border-radius: 17px;
  position: absolute;
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

export default AccountCardView
