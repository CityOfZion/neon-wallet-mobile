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
  isStack?: boolean
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

const treatSize = (value: number, unit: number): number => {
  return Number(value * unit)
}

const treatSizePx = (value: number, unit: number): string => {
  return `${value * unit}px`
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
      layout={{ width: treatSize(60, unit), height: treatSize(34, unit) }}
      withDefaultStyle={false}
    >
      <LinearLayout alignItems="flex-start" maxWidth={treatSizePx(120, unit)}>
        <TextView fontFamily="bold" fontSize={treatSizePx(12, unit)} color="white" lineHeight={treatSizePx(12, unit)}>
          {i18n.t('paymentCard.balance').toUpperCase()}
        </TextView>
        <TextView
          fontFamily="semibold"
          fontSize={treatSizePx(22, unit)}
          lineHeight={treatSizePx(22, unit)}
          color="white"
          numberOfLines={1}
        >
          {total}
        </TextView>
      </LinearLayout>
    </Skeleton>
  ) : (
    <Skeleton
      isLoading={balanceExchange?.isLoading}
      layout={{ width: '100%', height: treatSize(62, unit) }}
      containerStyle={{ paddingHorizontal: treatSize(40, unit) }}
    >
      <LinearLayout>
        <TextView px={treatSizePx(40, unit)} fontSize={treatSizePx(14, unit)} color="white" fontFamily="bold">
          {i18n.t('paymentCard.balance')}
        </TextView>
        <TextView
          fontSize={treatSizePx(48, unit)}
          color="white"
          textAlign="center"
          fontFamily="semibold"
          numberOfLines={1}
        >
          {total}
        </TextView>
      </LinearLayout>
    </Skeleton>
  )
}

const AccountCard = ({
  isCompacted = false,
  isInactive = false,
  isStack = false,
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

    if (onLayout) onLayout(event)
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
    <Animated.View onLayout={handleLayout} style={[{ opacity: opacityValue }]}>
      <ButtonView
        width={width ?? '100%'}
        height={viewHeight}
        onPress={handlePress}
        disabled={isInactive}
        activeOpacity={1}
      >
        <LinearGradient
          colors={[account.backgroundColor, FilterHelper.toDarkerShade(account.backgroundColor, 1, 0.3)]}
          style={{
            borderRadius: 18,
            overflow: 'hidden',
          }}
        >
          <LinearLayout
            position="absolute"
            width="0"
            left="0"
            borderRadius="18px"
            borderStyle="solid"
            borderLeftWidth={0}
            borderBottomWidth={0}
            borderRightWidth={viewWidth}
            borderTopWidth={viewHeight}
            borderLeftColor="transparent"
            borderRightColor="transparent"
            borderBottomColor="transparent"
            borderTopColor="#FFFFFF"
            opacity={0.05}
          />

          <ImageView
            opacity={0.7}
            position="absolute"
            bottom="7%"
            left="0"
            source={require('~src/assets/images/card-placeholder.png')}
            style={{
              width: '70%',
              height: '70%',
            }}
          />

          <LinearLayout
            orientation="verti"
            width="100%"
            height="100%"
            px={treatSizePx(16, unit)}
            py={treatSizePx(24, unit)}
            justifyContent={!isStack ? 'space-between' : undefined}
          >
            <LinearLayout orientation="horiz" alignItems="center">
              <ImageView
                source={getBlockchainLogo(account.blockchain, 'white')}
                resizeMode="contain"
                alignSelf="center"
                style={{
                  width: treatSize(24, unit),
                  height: treatSize(24, unit),
                }}
              />

              <LinearLayout orientation="verti" flex={1} paddingX={treatSizePx(8, unit)}>
                <TextView
                  fontFamily="semibold"
                  fontSize={treatSizePx(22, unit)}
                  color="white"
                  numberOfLines={1}
                  lineHeight={treatSizePx(22, unit)}
                >
                  {account.name ?? i18n.t('paymentCard.accountPlaceholder')}
                </TextView>
                <TextView
                  fontFamily="semibold"
                  fontSize={treatSizePx(14, unit)}
                  color="white"
                  numberOfLines={1}
                  lineHeight={treatSizePx(16, unit)}
                >
                  {i18n.t(`blockchainServices.${account.blockchain}.id`).toUpperCase()}
                </TextView>
              </LinearLayout>

              {isCompacted || isStack
                ? !props.hideBalance && <Balance type="small" balanceExchange={props.balanceExchange} unit={unit} />
                : !hideQRCode && (
                    <ButtonView onPress={handlePressQRCode}>
                      <ImageView
                        ml={treatSizePx(10, unit)}
                        source={require('~src/assets/images/card-qrcode.png')}
                        style={{
                          width: treatSize(24, unit),
                          height: treatSize(24, unit),
                        }}
                      />
                    </ButtonView>
                  )}
            </LinearLayout>

            {!isCompacted && !isStack && !props.hideBalance && (
              <Balance type="big" balanceExchange={props.balanceExchange} unit={unit} />
            )}

            {account.address && (
              <LinearLayout orientation="horiz" alignItems="center" mt={isStack ? treatSizePx(6, unit) : undefined}>
                <LinearLayout
                  width={treatSizePx(24, unit)}
                  height={treatSizePx(24, unit)}
                  alignItems="center"
                  justifyContent="center"
                >
                  {account.accountType === 'watch' && (
                    <ImageView
                      source={require('~/src/assets/images/icon-watch-white.png')}
                      resizeMode="cover"
                      style={{
                        width: treatSize(18, unit),
                        height: treatSize(18, unit),
                      }}
                    />
                  )}
                </LinearLayout>

                <LinearLayout flex={1} paddingX={treatSizePx(10, unit)}>
                  <TextView fontSize={treatSizePx(12, unit)} color="white" fontFamily="bold">
                    {i18n.t('paymentCard.address')}
                  </TextView>

                  <TextView
                    color="white"
                    opacity={0.6}
                    fontFamily="medium"
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    fontSize={treatSizePx(14, unit)}
                    lineHeight={treatSizePx(14, unit)}
                    mt="2px"
                  >
                    {account.address}
                  </TextView>
                </LinearLayout>

                {!hideCopy && (
                  <ButtonView onPress={handlePressCopy}>
                    <ImageView
                      resizeMode="contain"
                      source={require('~src/assets/images/icon-copy-white.png')}
                      style={{
                        opacity: 0.5,
                        width: treatSize(14, unit),
                        height: treatSize(14, unit),
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
  )
}

export default AccountCard
