import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import i18n from 'i18n-js'
import React, { useState, useRef, useMemo } from 'react'
import { LayoutChangeEvent, NativeSyntheticEvent, NativeTouchEvent, Animated } from 'react-native'
import { useSelector } from 'react-redux'

import { BalanceHelper } from '../helpers/BalanceHelper'
import { RootStackParamList } from '../navigation/AppNavigation'
import { RootState } from '../store/RootStore'
import { Balance } from '../types/balance'
import { MultiExchange } from '../types/exchange'

import { wrapper } from '~src/app/ApplicationWrapper'
import { getBlockchainLogo } from '~src/blockchain'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { Account } from '~src/models/redux/Account'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
  account: Account
  isCompacted?: boolean
  isStackMode?: boolean
  isVertical?: boolean
  isInactive?: boolean
  hasShadow?: boolean
  hideQRCode?: boolean
  hideBalance?: boolean
  hideCopy?: boolean
  balance?: Balance
  exchange?: MultiExchange
}

const AccountCard = ({
  isCompacted = false,
  isStackMode = false,
  isVertical = false,
  isInactive = false,
  hasShadow = true,
  account,
  balance,
  exchange,
  hideBalance,
  hideCopy,
  hideQRCode,
  onPress,
}: Props) => {
  const language = useSelector((state: RootState) => state.settings.language)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()

  const [viewHeight, setViewHeight] = useState<number>(0)

  const totalTokenBalance = useMemo(() => {
    const total = BalanceHelper.calculateTotalBalances(balance, exchange)

    return FilterHelper.currency(total, currency, language)
  }, [balance, exchange, currency, language])

  const unit = (viewHeight * 0.1) / 24

  const fadeAnim = useRef(new Animated.Value(0))
  const touchDisabled = useRef(false)

  const fadeIn = () => {
    Animated.timing(fadeAnim.current, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    setViewHeight(event.nativeEvent.layout.height)
    fadeIn()
  }

  const handlePress = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    touchDisabled.current = true

    if (onPress && touchDisabled.current) onPress(event)

    touchDisabled.current = false
  }

  const handlePressQRCode = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.AccountQRCode.name,
      params: {
        account,
      },
    })
  }

  const handlePressCopy = () => {
    if (!account.address) return

    UtilsHelper.copyToClipboard(account.address)
  }

  return (
    <ButtonView onLayout={handleLayout} onPress={handlePress} width="100%" disabled={isInactive} activeOpacity={1}>
      <LinearGradient
        colors={[account.backgroundColor, FilterHelper.toDarkerShade(account.backgroundColor, 1, 0.4)]}
        style={{
          opacity: isInactive ? 0.5 : 1,
          borderRadius: 18,
          aspectRatio: 38 / 25,
          shadowOffset: { width: 7, height: 7 },
          shadowColor: '#000000',
          shadowOpacity: 0.2,
          elevation: 7,
        }}
      >
        <Animated.View style={{ opacity: fadeAnim.current }}>
          <ImageView
            position="absolute"
            bottom="0"
            left="0"
            source={require('~src/assets/images/card-placeholder.png')}
            style={{
              width: '80%',
              height: '80%',
            }}
          />
          <LinearLayout orientation="verti" width="100%" height="100%" p={16 * unit} justifyContent="space-between">
            <LinearLayout orientation="horiz" alignItems="center">
              <ImageView
                width={30 * unit}
                height={30 * unit}
                source={getBlockchainLogo(account.blockchain, 'white')}
                resizeMode="contain"
                mr={unit * 10}
                alignSelf="center"
              />
              <LinearLayout orientation="verti" flex={1}>
                <TextView mb={-4 * unit} fontFamily="semibold" fontSize={22 * unit} color="white" numberOfLines={1}>
                  {account.name ?? i18n.t('paymentCard.accountPlaceholder')}
                </TextView>
                <TextView fontFamily="semibold" fontSize={12 * unit} color="white" numberOfLines={1} width="88%">
                  {i18n.t(`blockchainServices.${account.blockchain}.id`)}
                </TextView>
              </LinearLayout>

              {isCompacted
                ? !hideBalance && (
                    <LinearLayout ml={10 * unit} alignItems="flex-start">
                      <TextView fontFamily="bold" fontSize={12 * unit} color="white">
                        {i18n.t('paymentCard.balance')}
                      </TextView>
                      <TextView
                        mt={-6 * unit}
                        fontFamily="semibold"
                        fontSize={21 * unit}
                        color="white"
                        textAlign="center"
                        fontWeight="bold"
                        numberOfLines={1}
                      >
                        {totalTokenBalance}
                      </TextView>
                    </LinearLayout>
                  )
                : !hideQRCode && (
                    <ButtonView onPress={handlePressQRCode}>
                      <ImageView
                        ml={10 * unit}
                        width={25 * unit}
                        height={25 * unit}
                        source={require('~src/assets/images/card-qrcode.png')}
                      />
                    </ButtonView>
                  )}
            </LinearLayout>

            {!isStackMode && !isCompacted && !hideBalance ? (
              <LinearLayout>
                <TextView px={40 * unit} fontSize={14 * unit} color="white" fontFamily="bold">
                  {i18n.t('paymentCard.balance')}
                </TextView>
                <TextView fontSize={48 * unit} color="white" textAlign="center" fontFamily="semibold" numberOfLines={1}>
                  {totalTokenBalance}
                </TextView>
              </LinearLayout>
            ) : (
              <LinearLayout />
            )}

            {account.address && (
              <LinearLayout orientation="horiz" alignItems="center">
                {account.accountType === 'watch' && (
                  <ImageView
                    source={require('~/src/assets/images/icon-watch-white.png')}
                    resizeMode="contain"
                    mr={8 * unit}
                    style={{
                      width: 21 * unit,
                      height: 21 * unit,
                    }}
                  />
                )}

                <LinearLayout flex={1}>
                  <TextView fontSize={12 * unit} color="white" fontFamily="bold">
                    {i18n.t('paymentCard.address')}
                  </TextView>

                  <TextView
                    color="primary"
                    opacity={0.6}
                    fontFamily="medium"
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    fontSize={14 * unit}
                  >
                    {account.address}
                  </TextView>
                </LinearLayout>

                {!hideCopy && (
                  <ButtonView onPress={handlePressCopy} ml={8 * unit}>
                    <ImageView
                      resizeMode="contain"
                      source={require('~src/assets/images/icon-copy-green.png')}
                      style={{
                        opacity: 0.5,
                        width: 14,
                        height: 14,
                      }}
                    />
                  </ButtonView>
                )}
              </LinearLayout>
            )}
          </LinearLayout>
        </Animated.View>
      </LinearGradient>
    </ButtonView>
  )
}

export default AccountCard
