import React, { useMemo, useRef, useState } from 'react'
import { Animated, Easing, LayoutChangeEvent } from 'react-native'
import { useSelector } from 'react-redux'

import { BalanceHelper } from '../helpers/BalanceHelper'
import { TokenHelper } from '../helpers/TokenHelper'
import { RootState } from '../store/RootStore'
import { Balance } from '../types/balance'
import { MultiExchange } from '../types/exchange'
import AccountCard from './AccountCard'

import ThemedShadowContainer from '~src/components/themed/ThemedShadowContainer'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { ButtonView, ImageView, LinearLayout, RelativeLayout, TextView } from '~src/styles/styled-components'

interface Props {
  wallet: Wallet
  width?: number
  isInactive?: boolean
  onPress?: () => void
  exchange?: MultiExchange
  balances?: Balance[]
}

type AccountContainerProps = {
  viewHeight: number
  account: Account
  exchange?: MultiExchange
  balances?: Balance[]
  index: number
  isInactive?: boolean
}

type WalletOverlayProps = { walletType: string }

type WalletLabelProps = { wallet: Wallet; isInactive?: boolean }

type AssetBarFillsProps = { exchange?: MultiExchange; balances?: Balance[]; isInactive?: boolean }

const WalletLabel = ({ wallet, isInactive }: WalletLabelProps) => {
  return (
    <RelativeLayout height={58} width="100%" mb={15}>
      {wallet.walletType === 'standard' ? (
        <>
          <ImageView
            resizeMode="contain"
            source={require('~src/assets/images/wallet-card-label.png')}
            style={{
              height: '100%',
              width: '100%',
            }}
          />
          <LinearLayout bottom={40} orientation="horiz" alignItems="center">
            {isInactive ? (
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
              color={isInactive ? 'text.2' : 'text.0'}
              allowFontScaling
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {wallet.name?.toUpperCase()}
            </TextView>
          </LinearLayout>
        </>
      ) : (
        <>
          <ImageView position="absolute" left={0} source={require('~src/assets/images/wallet-icon-label.png')} />
          {wallet.walletType === 'watch' ? (
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

const AssetBarFills = ({ balances, exchange, isInactive }: AssetBarFillsProps) => {
  const totalTokensBalances = useMemo(
    () => BalanceHelper.calculateTotalBalances(balances, exchange),
    [balances, exchange]
  )

  const tokensBalancesConverted = useMemo(
    () => BalanceHelper.convertBalancesToCurrency(balances, exchange),
    [balances, exchange]
  )

  return (
    <RelativeLayout height="12px" width="100%">
      {!!totalTokensBalances && tokensBalancesConverted && !isInactive && (
        <>
          <ImageView
            resizeMode="cover"
            source={require('~src/assets/images/wallet-card-label.png')}
            style={{
              width: '100%',
              height: '100%',
              borderBottomRightRadius: 9999,
              borderTopRightRadius: 9999,
            }}
          />
          <LinearLayout position="absolute" top="3.5px" px="2px" orientation="horiz" width="100%">
            {tokensBalancesConverted.map((tokenBalances, index) => {
              const tokenColor = TokenHelper.getColor(tokenBalances.symbol)

              return (
                <>
                  <LinearLayout
                    height="5px"
                    weight={(tokenBalances.convertedAmount * 100) / totalTokensBalances}
                    borderRadius="2.5px"
                    minWidth="2px"
                    mx="1px"
                    key={index}
                    backgroundColor={tokenColor}
                  />
                </>
              )
            })}
          </LinearLayout>
        </>
      )}
    </RelativeLayout>
  )
}

const WalletOverlay = ({ walletType }: WalletOverlayProps) => {
  const isStandard = walletType === 'standard'

  return (
    <ImageView
      position="absolute"
      bottom="-2px"
      resizeMode="stretch"
      source={
        isStandard
          ? require('~src/assets/images/wallet-card-front.png')
          : require('~src/assets/images/wallet-semi-front.png')
      }
      style={{
        width: '100%',
        height: isStandard ? '100%' : '75%',
      }}
    />
  )
}

const AccountContainer = (props: AccountContainerProps) => {
  const ratio = 38 / 25
  const cardWidth = props.viewHeight - 12
  const cardHeight = cardWidth / ratio

  const balance = useMemo(
    () => BalanceHelper.getBalanceByAccount(props.account, props.balances),
    [props.account, props.balances]
  )

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
        <AccountCard account={props.account} balance={balance} exchange={props.exchange} hideBalance />
      </RelativeLayout>
    </LinearLayout>
  )
}

const WalletCard = ({ wallet, balances, exchange, isInactive, onPress, width }: Props) => {
  const accounts = useSelector((state: RootState) => state.app.accounts)

  const [viewHeight, setViewHeight] = useState<number>(0)

  const limitedWalletAccounts = useMemo(() => wallet.getAccounts(accounts).slice(0, 10), [wallet, accounts])

  const posYFactor = useRef(new Animated.Value(0))

  const layoutEvent = (event: LayoutChangeEvent) => {
    setViewHeight(event.nativeEvent.layout.height)
  }

  const onPressEvent = () => {
    if (!onPress || isInactive) return

    Animated.timing(posYFactor.current, {
      toValue: 1,
      duration: 500,
      easing: Easing.in(val => val ** 2),
      useNativeDriver: true,
    }).start(async () => {
      onPress()

      await UtilsHelper.sleep(500)
      posYFactor.current.setValue(0)
    })
  }

  return (
    <ThemedShadowContainer
      android={{
        width,
        height: 365,
        border: 7,
        radius: 30,
        opacity: 0.18,
        y: 7,
        x: 7,
      }}
    >
      <ButtonView
        position="relative"
        width={width}
        borderRadius="18px"
        bg="background.9"
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
                  viewHeight={viewHeight}
                  account={it}
                  index={i}
                  isInactive={isInactive}
                  balances={balances}
                  exchange={exchange}
                />
              </Animated.View>
            ))}
          </RelativeLayout>
        </LinearLayout>

        <WalletOverlay walletType={wallet.walletType ?? ''} />

        <LinearLayout position="absolute" bottom={40} width="80%">
          <WalletLabel wallet={wallet} isInactive={isInactive} />

          <AssetBarFills exchange={exchange} balances={balances} isInactive={isInactive} />
        </LinearLayout>
      </ButtonView>
    </ThemedShadowContainer>
  )
}

export default WalletCard
