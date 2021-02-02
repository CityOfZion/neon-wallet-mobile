import PropTypes from 'prop-types'
import React, {Fragment, useEffect, useRef, useState} from 'react'
import {Animated, Easing, LayoutChangeEvent} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ThemedShadowContainer from '~src/components/themed/ThemedShadowContainer'
import {Currency} from '~src/enums/Currency'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'
import {Exchange} from '~src/types/exchange'
interface Props {
  wallet: Wallet
  width?: number
  canBeInactive?: boolean
  onPress?: () => void
}

const WalletLabel = (props: {wallet: Wallet; canBeInactive?: boolean}) => {
  return (
    <RelativeLayout height={58} width={'100%'} mb={15}>
      {props.wallet.walletType === 'standard' ? (
        <Fragment>
          <ImageView
            height={'100%'}
            width={'100%'}
            resizeMode={'contain'}
            source={require('~src/assets/images/wallet-card-label.png')}
          />
          <LinearLayout bottom={40} orientation="horiz" alignItems={'center'}>
            {props.wallet.isInactive && props.canBeInactive ? (
              <ImageView
                ml="12px"
                width={28}
                height={24}
                resizeMode={'contain'}
                source={require('~src/assets/images/wallet-icon-inactive.png')}
              />
            ) : (
              <ImageView
                ml="12px"
                width={28}
                height={24}
                resizeMode={'contain'}
                source={require('~src/assets/images/wallet-icon.png')}
              />
            )}

            <TextView
              ml={'8px'}
              width={'70%'}
              fontSize={'lg'}
              fontFamily={'bold'}
              color={
                props.wallet.isInactive && props.canBeInactive
                  ? 'text.2'
                  : 'text.0'
              }
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
            >
              {props.wallet.name?.toUpperCase()}
            </TextView>
          </LinearLayout>
        </Fragment>
      ) : (
        <Fragment>
          <ImageView
            position={'absolute'}
            left={0}
            source={require('~src/assets/images/wallet-icon-label.png')}
          />
          {props.wallet.walletType === 'watch' ? (
            <ImageView
              top={15}
              left={15}
              width={26}
              height={26}
              resizeMode={'contain'}
              source={require('~src/assets/images/icon-watch-green.png')}
            />
          ) : (
            <ImageView
              top={12}
              left={12}
              width={36}
              height={32}
              resizeMode={'contain'}
              source={require('~src/assets/images/icon-legacy-grey.png')}
            />
          )}
        </Fragment>
      )}
    </RelativeLayout>
  )
}

const AssetBarFillsComponent = (props: {
  wallet: Wallet
  currency: Currency
  exchange: Exchange
}) => {
  const totalBalance = props.wallet.calculateBalance(
    props.currency,
    props.exchange
  )

  return (
    <Fragment>
      {props.wallet.tokenAssets
        .filter((token) => {
          return (
            (Math.round(totalBalance * 100) &&
              token.exchangeToken(props.currency, props.exchange)) ??
            0
          )
        })
        .map((token, i) => {
          const tokenBalance =
            token.exchangeToken(props.currency, props.exchange) ?? 0
          const weight = Math.round((tokenBalance / totalBalance) * 100)

          return (
            <LinearLayout
              height={'100%'}
              weight={weight}
              minWidth={'2px'}
              mx={'1px'}
              borderRadius={9999}
              bg={token.color}
              key={i}
              style={{
                shadowOpacity: 1,
                shadowRadius: 5,
                shadowColor: token.color,
                shadowOffset: {height: 0, width: 0},
              }}
            />
          )
        })}
    </Fragment>
  )
}

const WalletOverlay = (props: {walletType: string}) => {
  const overlayImage =
    props.walletType === 'standard'
      ? require('~src/assets/images/wallet-card-front.png')
      : require('~src/assets/images/wallet-semi-front.png')
  const height = props.walletType === 'standard' ? '100%' : '75%'

  return (
    <ImageView
      width={'100%'}
      height={height}
      position={'absolute'}
      bottom={'-2px'}
      resizeMode={'stretch'}
      source={overlayImage}
    />
  )
}

const AccountContainer = (props: {
  viewHeight: number
  account: Account
  wallet: Wallet
  index: number
  canBeInactive?: boolean
}) => {
  const ratio = 38 / 25
  const cardWidth = props.viewHeight - 12
  const cardHeight = cardWidth / ratio

  return (
    <LinearLayout
      mt={`${props.index * 4}px`}
      position={'absolute'}
      style={{
        top: 3 + cardHeight * ratio * 0.5,
        left: 5 + cardHeight * 0.5,
      }}
    >
      <RelativeLayout
        width={cardWidth}
        style={{
          top: -cardHeight * 0.5,
          left: -(cardHeight * ratio) * 0.5,
          transform: [{rotate: '90deg'}],
        }}
      >
        <AccountCard
          isInactive={props.wallet.isInactive && props.canBeInactive}
          isVertical={true}
          hideQRCode={true}
          hideBalance={true}
          hasShadow={false}
          account={props.account}
        />
      </RelativeLayout>
    </LinearLayout>
  )
}

const WalletCard: React.FC<Props> = (props) => {
  const {wallets, accounts, exchange} = useSelector(
    (state: RootState) => state.app
  )
  const {currency} = useSelector((state: RootState) => state.settings)

  const [viewHeight, setViewHeight] = useState<number>(0)
  const [walletAccounts, setWalletAccounts] = useState<Account[]>([])

  const limitedWalletAccounts = walletAccounts.slice(0, 10)

  const posYFactor = useRef(new Animated.Value(0))

  useEffect(() => {
    setWalletAccounts(props.wallet.getAccounts(accounts))
  }, [wallets, accounts])

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)
  }

  const onPressEvent = () => {
    if (props.onPress) {
      Animated.timing(posYFactor.current, {
        toValue: 1,
        duration: 500,
        easing: Easing.in((val) => val ** 2),
        useNativeDriver: true,
      }).start(async () => {
        if (props.onPress) props.onPress()
        await Facade.utils.sleep(500)
        posYFactor.current.setValue(0)
      })
    }
  }

  return (
    <ThemedShadowContainer radius={25} android={{width: props.width}}>
      <WalletCardRelativeContainer
        position="relative"
        width={props.width}
        bg={colorLimedSpruce}
        activeOpacity={1}
        onPress={onPressEvent}
        onLayout={layoutEvent}
        style={{
          aspectRatio: 25 / 38,
        }}
      >
        <LinearLayout
          position={'absolute'}
          bottom={0}
          width={'100%'}
          height={3 * viewHeight}
          overflow={'hidden'}
          borderRadius={'18px'}
        >
          <RelativeLayout top={2 * viewHeight}>
            {limitedWalletAccounts.map((it, i) => (
              <Animated.View
                key={i}
                style={{
                  transform: [
                    {
                      translateY: posYFactor.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          0,
                          -viewHeight *
                            (1.2 + 0.1 * (limitedWalletAccounts.length - i)),
                        ],
                      }),
                    },
                  ],
                }}
              >
                <AccountContainer
                  viewHeight={viewHeight}
                  account={it}
                  wallet={props.wallet}
                  index={i}
                  canBeInactive={props.canBeInactive}
                />
              </Animated.View>
            ))}
          </RelativeLayout>
        </LinearLayout>

        <WalletOverlay walletType={props.wallet.walletType ?? ''} />

        <LinearLayout position={'absolute'} bottom={40} width={'80%'}>
          <WalletLabel
            wallet={props.wallet}
            canBeInactive={props.canBeInactive}
          />

          <RelativeLayout height={12} width={'100%'}>
            <AssetsBarBackground
              height={'10px'}
              width={'100%'}
              source={require('~src/assets/images/wallet-card-label.png')}
            />
            <AssetsBar
              bottom={'7px'}
              height={'5px'}
              width={'99.5%'}
              px={'2px'}
              orientation={'horiz'}
            >
              {(!props.wallet.isInactive || !props.canBeInactive) && (
                <AssetBarFillsComponent
                  wallet={props.wallet}
                  currency={currency}
                  exchange={exchange}
                />
              )}
            </AssetsBar>
          </RelativeLayout>
        </LinearLayout>
      </WalletCardRelativeContainer>
    </ThemedShadowContainer>
  )
}

WalletCard.propTypes = {
  wallet: PropTypes.instanceOf(Wallet).isRequired,
  width: PropTypes.number,
  canBeInactive: PropTypes.bool,
  onPress: PropTypes.func,
}

const colorLimedSpruce = '#364046'

const AssetsBarBackground = styled(ImageView)`
  resize-mode: cover;
  border-top-right-radius: 9999px;
  border-bottom-right-radius: 9999px;
`

const WalletCardRelativeContainer = styled(ButtonView)`
  border-radius: 18px;
`

const AssetsBar = styled(LinearLayout)``

export default WalletCard
