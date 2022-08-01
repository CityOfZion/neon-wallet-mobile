import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import i18n from 'i18n-js'
import React, { useState, useRef, useMemo, useEffect } from 'react'
import { LayoutChangeEvent, NativeSyntheticEvent, NativeTouchEvent, Animated } from 'react-native'
import { useSelector } from 'react-redux'

import { BalanceHelper } from '../helpers/BalanceHelper'
import { RootStackParamList } from '../navigation/AppNavigation'
import { RootState } from '../store/RootStore'
import { UseUniqueBalanceAndExchangeResult } from '../types/query'
import { Skeleton } from './Skeleton'

import { wrapper } from '~src/app/ApplicationWrapper'
import { getBlockchainLogo } from '~src/blockchain'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { Account } from '~src/models/redux/Account'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

type VisibleProps = {
  hideBalance: false
  balanceExchange?: UseUniqueBalanceAndExchangeResult
}

type HiddenProps = {
  hideBalance: true
}

type Props = {
  account: Account
  isCompacted?: boolean
  isInactive?: boolean
  hideQRCode?: boolean
  hideCopy?: boolean
  width?: number
  height?: number
  onLayout?: (event: LayoutChangeEvent) => void
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
} & (VisibleProps | HiddenProps)

type BalanceProps = {
  type: 'small' | 'big'
  unit: number
  balanceExchange?: UseUniqueBalanceAndExchangeResult
}

const Balance = ({ balanceExchange, type, unit }: BalanceProps) => {
  const language = useSelector((state: RootState) => state.settings.language)
  const currency = useSelector((state: RootState) => state.settings.currency)

  const total = useMemo(() => {
    const total = balanceExchange
      ? BalanceHelper.calculateTotalBalances(balanceExchange.balance.data, balanceExchange.exchange.data)
      : undefined

    return FilterHelper.currency(total, currency, language)
  }, [balanceExchange, currency, language])

  return type === 'small' ? (
    <Skeleton
      isLoading={balanceExchange?.isLoading}
      layout={{ width: 60 * unit, height: 32 * unit }}
      withDefaultStyle={false}
    >
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
          {total}
        </TextView>
      </LinearLayout>
    </Skeleton>
  ) : (
    <Skeleton
      isLoading={balanceExchange?.isLoading}
      layout={{ width: '100%', height: 62 * unit }}
      containerStyle={{ paddingHorizontal: 40 * unit }}
    >
      <LinearLayout>
        <TextView px={40 * unit} fontSize={14 * unit} color="white" fontFamily="bold">
          {i18n.t('paymentCard.balance')}
        </TextView>
        <TextView fontSize={48 * unit} color="white" textAlign="center" fontFamily="semibold" numberOfLines={1}>
          {total}
        </TextView>
      </LinearLayout>
    </Skeleton>
  )
}

const AccountCard = ({
  isCompacted = false,
  isInactive = false,
  account,
  hideCopy,
  hideQRCode,
  onPress,
  height,
  width,
  onLayout,
  ...props
}: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()

  const [viewWidth, setViewWidth] = useState<number | undefined>(width ?? undefined)

  const viewHeight = height ? height : viewWidth ? viewWidth * 0.66 : undefined
  const unit = viewWidth ? viewWidth / 340 : 0

  const touchDisabled = useRef(false)
  const opacityValue = useRef(new Animated.Value(0)).current

  const handleLayout = (event: LayoutChangeEvent) => {
    if (width) return

    setViewWidth(event.nativeEvent.layout.width)
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

  useEffect(() => {
    if (!viewWidth) return

    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [viewWidth])

  return (
    <LinearLayout onLayout={onLayout}>
      <Animated.View style={[{ opacity: opacityValue }]}>
        <ButtonView
          onLayout={handleLayout}
          onPress={handlePress}
          width={width ?? '100%'}
          height={viewHeight}
          disabled={isInactive}
          activeOpacity={1}
        >
          <LinearGradient
            colors={[account.backgroundColor, FilterHelper.toDarkerShade(account.backgroundColor, 1, 0.4)]}
            style={{
              borderRadius: 18,
            }}
          >
            <ImageView
              opacity={0.7}
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
                  alignSelf="center"
                />
                <LinearLayout orientation="verti" flex={1} paddingX={10 * unit}>
                  <TextView mb={-4 * unit} fontFamily="semibold" fontSize={22 * unit} color="white" numberOfLines={1}>
                    {account.name ?? i18n.t('paymentCard.accountPlaceholder')}
                  </TextView>
                  <TextView fontFamily="semibold" fontSize={12 * unit} color="white" numberOfLines={1} width="88%">
                    {i18n.t(`blockchainServices.${account.blockchain}.id`)}
                  </TextView>
                </LinearLayout>

                {isCompacted
                  ? !props.hideBalance && <Balance type="small" balanceExchange={props.balanceExchange} unit={unit} />
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

              {!isCompacted && !props.hideBalance ? (
                <Balance type="big" balanceExchange={props.balanceExchange} unit={unit} />
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
          </LinearGradient>
        </ButtonView>
      </Animated.View>
    </LinearLayout>
  )
}

export default AccountCard
