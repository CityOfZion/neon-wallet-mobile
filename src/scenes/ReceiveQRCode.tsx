import {useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React from 'react'
import {ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {$} from '~/facade'
import NeonQRCode from '~src/components/QRCode'
import ThemedButton from '~src/components/themed/ThemedButton'
import {RootState} from '~src/store/reducers/root'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface ReceiveQRCodeProps {
  tokenName: string
  amount?: string
  formatedValue?: string
  walletName: string
  accountName: string
  address: string
  reference?: string
  tokenLogo: any
}

const buttonWidth = $.app.screenWidth - 76

const ReceiveQRCode = (props: ReceiveQRCodeProps) => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const headerHeight = useHeaderHeight()
  const qrCodeContent = props.address //TODO put tx URI
  props = {
    accountName: 'My Account 1',
    tokenLogo: require('~/src/assets/logos/logo-neo.png'),
    tokenName: 'NEO',
    walletName: 'My First Wallet',
    address: 'AN8iLVt18CKoATdexztCQj923hw5gkc41A',
    reference: 'This is a long reference text using two lines.',
    amount: '25.609809874',
    formatedValue: '$241.56',
  }
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
    >
      <ScrollView style={{flex: 1}}>
        <LinearLayout mt={headerHeight + 20} weight={1} alignItems="center">
          <NeonQRCode content={qrCodeContent} qrCodeWidth={buttonWidth} />
          <LinearLayout width={buttonWidth} height={54} mt={34}>
            <ThemedButton
              label="Copy to clipboard"
              srcIcon={require('~/src/assets/images/icon-copy-green.png')}
              iconSize={[19, 23]}
            />
          </LinearLayout>

          <LinearLayout
            width="90%"
            mt={22}
            flex={1}
            flexWrap="wrap"
            minHeight={400}
          >
            <LinearLayout orientation="horiz">
              <LinearLayout weight={1.4} pl={14} />
              <TextView
                weight={5}
                fontFamily="bold"
                color="white"
                fontSize={14}
                mb={16}
                style={{includeFontPadding: false}}
              >
                {$.t('receive.paymentRequestDetails')}
              </TextView>
            </LinearLayout>
            <LinearLayout
              borderWidth={1}
              borderRadius={7}
              pl={14}
              pt={27}
              borderColor={theme.colors.background[4]}
            >
              <LinearLayout orientation="horiz" width="100%" mb={14}>
                <TextView
                  fontFamily="medium"
                  color={theme.colors.background[3]}
                  weight={1.4}
                  mt={1}
                >
                  {$.t('receive.token')}
                </TextView>
                <LinearLayout orientation="horiz" weight={5}>
                  <ImageView
                    alignSelf="center"
                    width={18}
                    height={18}
                    resizeMode="center"
                    source={props.tokenLogo}
                  />
                  <TextView
                    color="white"
                    ml={2}
                    fontFamily="semibold"
                    fontSize={18}
                    style={{includeFontPadding: false}}
                  >
                    {props.tokenName}
                  </TextView>
                </LinearLayout>
              </LinearLayout>
              <LinearLayout orientation="horiz" width="100%" mb={14}>
                <TextView
                  fontFamily="medium"
                  color={theme.colors.background[3]}
                  weight={1.4}
                  style={{textAlignVertical: 'bottom'}}
                >
                  {$.t('receive.amount')}
                </TextView>
                <TextView
                  color="white"
                  fontFamily="semibold"
                  fontSize={18}
                  weight={5}
                >
                  {props.amount}
                </TextView>
              </LinearLayout>
              <LinearLayout orientation="horiz" width="100%" mb={14}>
                <TextView
                  fontFamily="medium"
                  color={theme.colors.background[3]}
                  weight={1.4}
                  style={{textAlignVertical: 'bottom'}}
                >
                  {$.t('receive.value')}
                </TextView>
                <TextView
                  color="white"
                  fontFamily="semibold"
                  fontSize={18}
                  weight={5}
                >
                  {props.formatedValue}
                </TextView>
              </LinearLayout>
              <LinearLayout orientation="horiz" width="100%" mb={14}>
                <TextView
                  fontFamily="medium"
                  color={theme.colors.background[3]}
                  weight={1.4}
                >
                  {$.t('receive.location')}
                </TextView>
                <TextView
                  color="white"
                  fontFamily="semibold"
                  fontSize={16}
                  weight={5}
                  ml={2}
                  mr={5}
                  style={{includeFontPadding: false}}
                >
                  {`${props.walletName} / ${props.accountName}`}
                </TextView>
              </LinearLayout>
              <LinearLayout orientation="horiz" width="100%" mb={14}>
                <TextView
                  fontFamily="medium"
                  color={theme.colors.background[3]}
                  weight={1.4}
                >
                  {$.t('receive.address')}
                </TextView>
                <TextView
                  color={theme.colors.primary}
                  fontFamily="medium"
                  fontSize={16}
                  weight={5}
                  ml={2}
                  style={{includeFontPadding: false}}
                  mr={5}
                >
                  {props.address}
                </TextView>
              </LinearLayout>
              <LinearLayout orientation="horiz" width="100%" mb={20}>
                <TextView
                  fontFamily="medium"
                  color={theme.colors.background[3]}
                  weight={1.4}
                >
                  {$.t('receive.reference')}
                </TextView>
                <TextView
                  color="white"
                  fontFamily="semibold"
                  fontSize={16}
                  weight={5}
                  ml={2}
                  mr={5}
                  style={{includeFontPadding: false}}
                >
                  {props.reference}
                </TextView>
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
      </ScrollView>
    </LinearGradient>
  )
}

export default ReceiveQRCode
