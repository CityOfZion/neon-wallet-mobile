import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {
  ImageBackground,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity,
} from 'react-native'
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

import {Facade} from '~src/app/Facade'
import {Account} from '~src/models/redux/Account'
import styled, {
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
  orientBy?: 'height' | 'width'
}

const AccountCard: React.FC<Props> = (props) => {
  const {language} = useSelector((state: RootState) => state.settings)

  const [viewHeight, setViewHeight] = useState<number>(0)
  const unit = (viewHeight * 0.1) / 24

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)
  }

  return (
    <PaymentCardView
      onLayout={layoutEvent}
      onPress={(e: NativeSyntheticEvent<NativeTouchEvent>) =>
        props.onPress?.(e)
      }
      width={props.orientBy === 'width' ? '100%' : undefined}
      height={props.orientBy === 'height' ? '100%' : undefined}
      style={{
        backgroundColor: props.account.backgroundColor,
        aspectRatio: 38 / 25,
      }}
      borderRadius={17 * unit}
      activeOpacity={1}
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
        px={15 * unit}
        py={10 * unit}
      >
        <LinearLayout
          mb={3 * unit}
          orientation={'horiz'}
          alignItems={'flex-end'}
          width={'100%'}
        >
          <LinearLayout
            weight={1}
            mb={3 * unit}
            orientation={'horiz'}
            alignItems={'center'}
          >
            {props.account.srcIcon && (
              <ImageView
                width={24 * unit}
                height={24 * unit}
                source={props.account.srcIcon}
                mr={10 * unit}
              />
            )}

            <TextView
              weight={1}
              mb={-2 * unit}
              fontFamily={'semibold'}
              fontSize={22 * unit}
              color="white"
              textAlign="left"
              numberOfLines={1}
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
            >
              {props.account.name}
            </TextView>
          </LinearLayout>

          {props.isCompacted ? (
            <LinearLayout ml={10 * unit} alignItems={'flex-start'}>
              <TextView
                fontFamily={'bold'}
                fontSize={12 * unit}
                color="white"
                textAlign="left"
                fontWeight="bold"
              >
                {Facade.t('paymentCard.balance')}
              </TextView>

              <TextView
                mt={-6 * unit}
                fontFamily={'semibold'}
                fontSize={21 * unit}
                color="white"
                textAlign="center"
                fontWeight="bold"
              >
                {Facade.filter.currency(
                  props.account.balanceAmount,
                  props.account.assetSymbol,
                  language
                )}
              </TextView>
            </LinearLayout>
          ) : (
            <ImageView
              ml={10 * unit}
              width={32 * unit}
              height={32 * unit}
              source={require('~src/assets/images/card-qrcode.png')}
            />
          )}
        </LinearLayout>

        {!props.isStackMode && !props.isCompacted && (
          <TextView
            mb={3 * unit}
            fontSize={14 * unit}
            color="white"
            textAlign="left"
            fontWeight="bold"
          >
            {Facade.t('paymentCard.balance')}
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
                fontWeight="bold"
              >
                {Facade.filter.currency(
                  props.account.balanceAmount,
                  props.account.assetSymbol,
                  language
                )}
              </TextView>
            )}
          </LinearLayout>
        )}

        {props.account.address && (
          <LinearLayout orientation={'horiz'} alignItems={'flex-end'}>
            <LinearLayout weight={1}>
              <TextView
                mb={2 * unit}
                fontSize={14 * unit}
                color="white"
                textAlign="left"
                fontWeight="bold"
              >
                {Facade.t('paymentCard.address')}
              </TextView>

              <TextView
                fontSize={14 * unit}
                color="white"
                opacity={0.5}
                textAlign="left"
              >
                {props.account.address}
              </TextView>
            </LinearLayout>

            {!props.isStackMode && (
              <TouchableOpacity
                onPress={() => {
                  if (props.account.address) {
                    Facade.utils.copyToClipboard(props.account.address)
                  }
                }}
                style={{
                  paddingTop: 12 * unit,
                  paddingLeft: 12 * unit,
                  paddingBottom: 6 * unit,
                  paddingRight: 6 * unit,
                }}
              >
                <ImageView
                  width={20 * unit}
                  height={24 * unit}
                  source={require('~src/assets/images/card-copy.png')}
                  style={{opacity: 0.5}}
                />
              </TouchableOpacity>
            )}
          </LinearLayout>
        )}
      </LinearLayout>
    </PaymentCardView>
  )
}

AccountCard.propTypes = {
  onPress: PropTypes.func,
  account: PropTypes.any.isRequired,
  isCompacted: PropTypes.bool.isRequired,
  isStackMode: PropTypes.bool.isRequired,
  orientBy: PropTypes.oneOf(['height', 'width']),
}

AccountCard.defaultProps = {
  account: new Account(),
  isCompacted: false,
  isStackMode: false,
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

export default AccountCard
