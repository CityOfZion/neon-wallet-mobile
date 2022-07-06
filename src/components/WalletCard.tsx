import PropTypes from 'prop-types'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Animated, Easing, LayoutChangeEvent } from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'
import { Exchange } from '../types/exchange'

import AccountCard from '~src/components/AccountCard'
import ThemedShadowContainer from '~src/components/themed/ThemedShadowContainer'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import styled, { ButtonView, ImageView, LinearLayout, RelativeLayout, TextView } from '~src/styles/styled-components'

interface Props {
  wallet: Wallet
  width?: number
  canBeInactive?: boolean
  onPress?: () => void
  exchange?: Exchange
}

const WalletLabel = (props: { wallet: Wallet; canBeInactive?: boolean }) => {
  return (
    <RelativeLayout height={58} width="100%" mb={15}>
      {props.wallet.walletType === 'standard' ? (
        <>
          <ImageView
            height="100%"
            width="100%"
            resizeMode="contain"
            source={require('~src/assets/images/wallet-card-label.png')}
          />
          <LinearLayout bottom={40} orientation="horiz" alignItems="center">
            {props.wallet.isInactive && props.canBeInactive ? (
              <ImageView
                ml="12px"
                width={28}
                height={24}
                resizeMode="contain"
                source={require('~src/assets/images/wallet-icon-inactive.png')}
              />
            ) : (
              <ImageView
                ml="12px"
                width={28}
                height={24}
                resizeMode="contain"
                source={require('~src/assets/images/wallet-icon.png')}
              />
            )}

            <TextView
              ml="8px"
              width="70%"
              fontSize="lg"
              fontFamily="bold"
              color={props.wallet.isInactive && props.canBeInactive ? 'text.2' : 'text.0'}
              allowFontScaling
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {props.wallet.name?.toUpperCase()}
            </TextView>
          </LinearLayout>
        </>
      ) : (
        <>
          <ImageView position="absolute" left={0} source={require('~src/assets/images/wallet-icon-label.png')} />
          {props.wallet.walletType === 'watch' ? (
            <ImageView
              top={15}
              left={15}
              width={26}
              height={26}
              resizeMode="contain"
              source={require('~src/assets/images/icon-watch-green.png')}
            />
          ) : (
            <ImageView
              top={12}
              left={12}
              width={36}
              height={32}
              resizeMode="contain"
              source={require('~src/assets/images/icon-legacy-grey.png')}
            />
          )}
        </>
      )}
    </RelativeLayout>
  )
}

const AssetBarFillsComponent = (props: { wallet: Wallet; exchange?: Exchange }) => {
  const { currency } = useSelector((state: RootState) => state.settings)
  const totalBalance = props.wallet.calculateBalance(currency, props.exchange) // TODO totalBalance need change

  return (
    <>
      {props.wallet.tokenAssets
        .filter(token => {
          return (Math.round(totalBalance * 100) && token.exchangeToken(currency, props.exchange)) ?? 0
        })
        .map((token, i) => {
          const tokenBalance = token.exchangeToken(currency, props.exchange) ?? 0
          const weight = Math.round((tokenBalance / totalBalance) * 100)

          return (
            <LinearLayout
              height="100%"
              weight={weight}
              minWidth="2px"
              mx="1px"
              borderRadius={9999}
              bg={token.color}
              key={i}
              style={{
                shadowOpacity: 1,
                shadowRadius: 5,
                shadowColor: token.color,
                shadowOffset: { height: 0, width: 0 },
              }}
            />
          )
        })}
    </>
  )
}

const WalletOverlay = (props: { walletType: string }) => {
  const overlayImage =
    props.walletType === 'standard'
      ? require('~src/assets/images/wallet-card-front.png')
      : require('~src/assets/images/wallet-semi-front.png')
  const height = props.walletType === 'standard' ? '100%' : '75%'

  return (
    <ImageView
      width="100%"
      height={height}
      position="absolute"
      bottom="-2px"
      resizeMode="stretch"
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
  exchange?: Exchange
}) => {
  const ratio = 38 / 25
  const cardWidth = props.viewHeight - 12
  const cardHeight = cardWidth / ratio
  return (
    <LinearLayout
      mt={`${props.index * 4}px`}
      position="absolute"
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
          transform: [{ rotate: '90deg' }],
        }}
      >
        <AccountCard
          exchange={props.exchange}
          isInactive={props.wallet.isInactive && props.canBeInactive}
          isVertical
          hideQRCode
          hideBalance
          hasShadow={false}
          account={props.account}
        />
      </RelativeLayout>
    </LinearLayout>
  )
}

const WalletCard: React.FC<Props> = props => {
  const { wallets, accounts } = useSelector((state: RootState) => state.app)

  const [viewHeight, setViewHeight] = useState<number>(0)
  const [walletAccounts, setWalletAccounts] = useState<Account[]>([])

  const limitedWalletAccounts = walletAccounts.slice(0, 10)

  const posYFactor = useRef(new Animated.Value(0))

  useEffect(() => {
    setWalletAccounts(props.wallet.getAccounts(accounts))
  }, [wallets, accounts])

  const layoutEvent = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setViewHeight(height)
  }

  const onPressEvent = () => {
    if (props.onPress) {
      Animated.timing(posYFactor.current, {
        toValue: 1,
        duration: 500,
        easing: Easing.in(val => val ** 2),
        useNativeDriver: true,
      }).start(async () => {
        if (props.onPress) {
          props.onPress()
        }
        await UtilsHelper.sleep(500)
        posYFactor.current.setValue(0)
      })
    }
  }

  return (
    <ThemedShadowContainer
      android={{
        width: props.width,
        height: 365,
        border: 7,
        radius: 30,
        opacity: 0.18,
        y: 7,
        x: 7,
      }}
    >
      <WalletCardRelativeContainer
        position="relative"
        width={props.width}
        bg={colorLimedSpruce}
        activeOpacity={1}
        onPress={onPressEvent}
        onLayout={layoutEvent}
        style={{
          aspectRatio: 25 / 38,
          height: 350,
        }}
      >
        <LinearLayout
          position="absolute"
          bottom={0}
          width="100%"
          height={3 * viewHeight}
          overflow="hidden"
          borderRadius="18px"
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
                        outputRange: [0, -viewHeight * (1.2 + 0.1 * (limitedWalletAccounts.length - i))],
                      }),
                    },
                  ],
                }}
              >
                <AccountContainer
                  exchange={props.exchange}
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

        <LinearLayout position="absolute" bottom={40} width="80%">
          <WalletLabel wallet={props.wallet} canBeInactive={props.canBeInactive} />

          <RelativeLayout height={12} width="100%">
            <AssetsBarBackground
              height="10px"
              width="100%"
              source={require('~src/assets/images/wallet-card-label.png')}
            />
            <AssetsBar bottom="7px" height="5px" width="99.5%" px="2px" orientation="horiz">
              {(!props.wallet.isInactive || !props.canBeInactive) && (
                <AssetBarFillsComponent exchange={props.exchange} wallet={props.wallet} />
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
