import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, {useState, useRef, useEffect} from 'react'
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
} from 'styled-system'

import {wrapper} from '~src/app/ApplicationWrapper' //@ts-ignore
import CardSvg from '~src/assets/images/card.svg'
import {blockchainServices, getBlockchainLogo} from '~src/blockchain'
import {FilterHelper} from '~src/helpers/FilterHelper'
import {UtilsHelper} from '~src/helpers/UtilsHelper'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
import {orientation, weight} from '~src/styles/styled-system.config'

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
  orientBy?: 'height' | 'width'
  isCustomAccount?: boolean
  disableSecondTouch?: boolean
}

const AccountCard: React.FC<Props> = (props) => {
  const {exchange} = useSelector((state: RootState) => state.app)
  const {language, currency} = useSelector((state: RootState) => state.settings)
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()
  const [viewHeight, setViewHeight] = useState<number>(0)
  const [disableTouch, setDisableTouch] = useState<boolean>(false)

  const unit = (viewHeight * 0.1) / 24
  const bright = 'rgba(255, 255, 255, 0.2)'
  const dark = 'rgba(0, 0, 0, 0.2)'

  const bg = () => {
    return props.isInactive ? '#4A5861' : props.account.backgroundColor
  }

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)
  }
  const fadeAnim = useRef(new Animated.Value(0)).current
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }
  useEffect(() => {
    if (viewHeight !== 0) {
      fadeIn()
    }
  }, [viewHeight])

  return (
    <PaymentCardView
      onLayout={layoutEvent}
      onPress={(e: NativeSyntheticEvent<NativeTouchEvent>) => {
        props.onPress?.(e)
        setDisableTouch(true)
      }}
      width={props.orientBy === 'width' ? '100%' : undefined}
      height={props.orientBy === 'height' ? '100%' : undefined}
      style={{
        aspectRatio: 38 / 25,
      }}
      activeOpacity={1}
      disabled={props.disableSecondTouch ? disableTouch : false}
    >
      {props.hasShadow && (
        <ShadowView pointerEvents={'none'}>
          <ImageView
            source={require('~src/assets/images/card-shadow.png')}
            width={'112%'}
            height={'112%'}
            resizeMode="contain"
          />
        </ShadowView>
      )}

      <SvgView pointerEvents={'none'}>
        <CardSvg
          width={'115%'}
          height={'115%'}
          fill={bg()}
          fillSecondary={FilterHelper.toDarkerShade(bg(), 1, 0.4)}
        />
      </SvgView>

      <BevelView
        pointerEvents={'none'}
        style={{
          borderWidth: unit,
          borderRadius: 16 * unit,
          borderLeftColor: bright,
          borderRightColor: dark,
          borderTopColor: props.isVertical ? dark : bright,
          borderBottomColor: props.isVertical ? bright : dark,
        }}
      />
      <Animated.View style={{opacity: fadeAnim}}>
        {!props.isInactive && (
          <LinearLayout
            orientation={'verti'}
            width={'100%'}
            height={'100%'}
            pl={5 * unit}
            pr={15 * unit}
            py={10 * unit}
          >
            <LinearLayout
              mb={3 * unit}
              orientation={'horiz'}
              alignItems={'flex-end'}
              width={'100%'}
            >
              <ImageView
                width={35 * unit}
                height={35 * unit}
                source={getBlockchainLogo(props.account.blockchain, 'white')}
                resizeMode={'contain'}
                ml={unit * 10}
                mr={unit * 10}
                mt={unit * 7}
                alignSelf={'center'}
              />
              <LinearLayout weight={1} orientation={'verti'} height={'100%'}>
                <LinearLayout orientation={'horiz'} alignItems={'center'}>
                  <TextView
                    mb={-4 * unit}
                    fontFamily={'semibold'}
                    fontSize={22 * unit}
                    color="white"
                    textAlign="left"
                    numberOfLines={1}
                    width={'88%'}
                    allowFontScaling={true}
                  >
                    {props.account.name?.length !== 0
                      ? props.account.name
                      : i18n.t('paymentCard.accountPlaceholder')}
                  </TextView>
                </LinearLayout>
                <LinearLayout
                  mb={3 * unit}
                  orientation={'horiz'}
                  alignItems={'flex-end'}
                  width={'100%'}
                >
                  <TextView
                    mb={-2 * unit}
                    fontFamily={'semibold'}
                    fontSize={13 * unit}
                    color="white"
                    textAlign="left"
                    numberOfLines={1}
                    width={'88%'}
                  >
                    {i18n.t(
                      `blockchainServices.${props.account.blockchain}.id`
                    )}
                  </TextView>
                </LinearLayout>
              </LinearLayout>

              {props.isCompacted ? (
                <LinearLayout ml={10 * unit} alignItems={'flex-start'}>
                  <TextView
                    fontFamily={'bold'}
                    fontSize={12 * unit}
                    color="white"
                    textAlign="left"
                    fontWeight="bold"
                    includeFontPadding={true}
                  >
                    {(!props.hideBalance && i18n.t('paymentCard.balance')) ||
                      ''}
                  </TextView>

                  <TextView
                    mt={-6 * unit}
                    fontFamily={'semibold'}
                    fontSize={21 * unit}
                    color="white"
                    textAlign="center"
                    fontWeight="bold"
                    allowFontScaling={true}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                  >
                    {!props.hideBalance
                      ? props.account.formattedBalanceAmount(
                          currency,
                          language,
                          exchange[props.account.blockchain]
                        )
                      : ''}
                  </TextView>
                </LinearLayout>
              ) : (
                !props.hideQRCode && (
                  <ButtonView
                    onPress={() => {
                      navigation.navigate(wrapper.route.Modal.name, {
                        screen: wrapper.route.AccountQRCode.name,
                        params: {
                          account: props.account,
                        },
                      })
                    }}
                  >
                    <ImageView
                      ml={10 * unit}
                      mb={5 * unit}
                      width={30 * unit}
                      height={30 * unit}
                      source={require('~src/assets/images/card-qrcode.png')}
                    />
                  </ButtonView>
                )
              )}
            </LinearLayout>

            {!props.isStackMode && !props.isCompacted && (
              <TextView
                mb={3 * unit}
                fontSize={14 * unit}
                color="white"
                fontFamily="bold"
                mt={20 * unit}
                ml={45 * unit}
              >
                {(!props.hideBalance && i18n.t('paymentCard.balance')) || ''}
              </TextView>
            )}

            {!props.isStackMode && (
              <LinearLayout
                orientation={'verti'}
                justifyContent={'center'}
                alignItems={'center'}
                weight={1}
              >
                {!props.isCompacted && (
                  <TextView
                    mb={3 * unit}
                    fontSize={48 * unit}
                    color="white"
                    textAlign="center"
                    fontFamily="semibold"
                    allowFontScaling={true}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                  >
                    {!props.hideBalance
                      ? props.account.formattedBalanceAmount(
                          currency,
                          language,
                          exchange[props.account.blockchain]
                        )
                      : ''}
                  </TextView>
                )}
              </LinearLayout>
            )}

            {props.account.address && (
              <LinearLayout
                mt={10 * unit}
                orientation={'horiz'}
                alignItems={'flex-end'}
                justifyContent={'space-between'}
                mb={5}
              >
                <LinearLayout>
                  <LinearLayout orientation={'horiz'}>
                    {props.account.accountType === 'watch' ? (
                      <ImageView
                        width={21 * unit}
                        height={21 * unit}
                        source={require('~/src/assets/images/icon-watch-white.png')}
                        ml={7 * unit}
                        mt={4 * unit}
                        mb={4 * unit}
                        alignSelf={'center'}
                        mr={8 * unit}
                      />
                    ) : (
                      <LinearLayout ml={10 * unit} />
                    )}

                    <LinearLayout width={285 * unit}>
                      <TextView
                        fontSize={12 * unit}
                        color="white"
                        textAlign="left"
                        fontFamily="bold"
                      >
                        {i18n.t('paymentCard.address')}
                      </TextView>

                      <TextView
                        color={'primary'}
                        opacity={0.6}
                        textAlign="left"
                        fontFamily={'medium'}
                        ellipsizeMode={'middle'}
                        pr={'1px'}
                        numberOfLines={1}
                        fontSize={'14'}
                      >
                        {props.account.address}
                      </TextView>
                    </LinearLayout>
                  </LinearLayout>
                </LinearLayout>

                {!props.hideCopy && (
                  <TouchableOpacity
                    onPress={() => {
                      if (props.account.address) {
                        UtilsHelper.copyToClipboard(props.account.address)
                        showMessage({
                          message: i18n.t('toast.copiedToClipboard'),
                          type: 'success',
                        })
                      }
                    }}
                    style={
                      !props.isCustomAccount
                        ? {
                            paddingTop: 12 * unit,
                            paddingLeft: 5 * unit,
                            paddingRight: 14 * unit,
                          }
                        : {
                            marginBottom: 15 * unit,
                            marginRight:
                              Platform.OS !== 'ios' ? 24 * unit : 38 * unit,
                          }
                    }
                  >
                    <ImageView
                      width={!props.isCustomAccount ? 14 * unit : 10}
                      height={!props.isCustomAccount ? 18 * unit : 14}
                      resizeMode={'contain'}
                      source={require('~src/assets/images/icon-copy-green.png')}
                      style={
                        !props.isCustomAccount
                          ? {opacity: 0.5}
                          : {
                              opacity: 0.5,
                              width: 10,
                              height: 12,
                            }
                      }
                    />
                  </TouchableOpacity>
                )}
              </LinearLayout>
            )}
          </LinearLayout>
        )}
      </Animated.View>
    </PaymentCardView>
  )
}

AccountCard.propTypes = {
  onPress: PropTypes.func,
  account: PropTypes.any.isRequired,
  isCompacted: PropTypes.bool.isRequired,
  isStackMode: PropTypes.bool.isRequired,
  isVertical: PropTypes.bool.isRequired,
  isInactive: PropTypes.bool.isRequired,
  hasShadow: PropTypes.bool.isRequired,
  hideQRCode: PropTypes.bool,
  hideBalance: PropTypes.bool,
  hideCopy: PropTypes.bool,
  orientBy: PropTypes.oneOf(['height', 'width']),
  isCustomAccount: PropTypes.any.isRequired,
  disableSecondTouch: PropTypes.any.isRequired,
}

AccountCard.defaultProps = {
  account: new Account(),
  isCompacted: false,
  isStackMode: false,
  isVertical: false,
  isInactive: false,
  hasShadow: true,
  orientBy: 'width',
}

const PaymentCardView = styled.TouchableOpacity<
  ColorProps &
    FlexboxProps &
    SpaceProps &
    BorderProps &
    LayoutProps &
    OrientationProps &
    PositionProps &
    WeightProps
>`
  ${layout}
  ${color}
  ${flexbox}
  ${space}
  ${border}
  ${orientation}
  ${position}
  ${weight}
`

const ShadowView = styled.View`
  position: absolute;
  top: -16%;
  left: -17%;
  bottom: 0;
  right: 0;
`

const SvgView = styled.View`
  position: absolute;
  top: -17%;
  left: -18%;
  bottom: 0;
  right: 0;
`

const BevelView = styled.View`
  position: absolute;
  top: 0.5%;
  left: 0.4%;
  bottom: -0.2%;
  right: 0.85%;
`

export default AccountCard
