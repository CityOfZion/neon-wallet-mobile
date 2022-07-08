import i18n from 'i18n-js'
import React, { useMemo, useRef, useState } from 'react'
import { Animated, Easing, LayoutChangeEvent } from 'react-native'
import { useSelector } from 'react-redux'

import { getBlockchainLogo } from '../blockchain'
import { BalanceHelper } from '../helpers/BalanceHelper'
import { FilterHelper } from '../helpers/FilterHelper'
import { TokenHelper } from '../helpers/TokenHelper'
import { RootState } from '../store/RootStore'
import { Balance } from '../types/balance'
import { Exchange } from '../types/exchange'

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
  exchange?: Exchange
  balances?: Balance[]
}

type AccountContainerProps = {
  viewHeight: number
  account: Account
  index: number
  isInactive?: boolean
}

type AccountCardProps = {
  account: Account
}

type WalletOverlayProps = { walletType: string }

type WalletLabelProps = { wallet: Wallet; isInactive?: boolean }

type AssetBarFillsProps = { exchange?: Exchange; balances?: Balance[]; isInactive?: boolean }

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
  const currency = useSelector((state: RootState) => state.settings.currency)

  const totalTokensBalances = useMemo(
    () => BalanceHelper.calculateTotalBalances(balances, exchange, currency),
    [balances, exchange, currency]
  )

  const tokensBalancesConverted = useMemo(
    () => BalanceHelper.convertBalancesToCurrency(balances, exchange, currency),
    [balances, exchange, currency]
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
        <AccountCard account={props.account} />
      </RelativeLayout>
    </LinearLayout>
  )
}

const AccountCard = (props: AccountCardProps) => {
  const [viewHeight, setViewHeight] = useState<number>(0)

  const unit = (viewHeight * 0.1) / 24

  const layoutEvent = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setViewHeight(height)
  }

  return (
    <LinearLayout
      onLayout={layoutEvent}
      width="100%"
      style={{
        aspectRatio: 38 / 25,
      }}
      borderRadius="18px"
      overflow="hidden"
      backgroundColor={FilterHelper.toDarkerShade(props.account.backgroundColor, 1, 0.7)} //Arrumar isso
    >
      <ImageView
        opacity={0.15}
        position="absolute"
        source={require('~src/assets/images/placeholder-card.png')}
        resizeMode="contain"
        right="-160px"
        bottom="8px"
        style={{
          height: 160,
        }}
      />
      <LinearLayout orientation="verti" width="100%" height="100%" pl={5 * unit} pr={15 * unit} py={10 * unit}>
        <LinearLayout mt="5px" orientation="horiz" alignItems="flex-end" width="100%" pr={10 * unit}>
          <ImageView
            width={30 * unit}
            height={30 * unit}
            source={getBlockchainLogo(props.account.blockchain, 'white')}
            resizeMode="contain"
            ml={unit * 10}
            mr={unit * 10}
            mt={unit * 7}
            alignSelf="center"
          />
          <LinearLayout weight={1} orientation="verti" height="100%">
            <LinearLayout orientation="horiz" alignItems="center">
              <TextView
                mb={-4 * unit}
                fontFamily="semibold"
                fontSize={22 * unit}
                color="white"
                textAlign="left"
                numberOfLines={1}
                width="88%"
                allowFontScaling
              >
                {props.account.name?.length !== 0 ? props.account.name : i18n.t('paymentCard.accountPlaceholder')}
              </TextView>
            </LinearLayout>
            <LinearLayout mb={3 * unit} orientation="horiz" alignItems="flex-end" width="100%">
              <TextView
                mb={-2 * unit}
                fontFamily="semibold"
                fontSize={13 * unit}
                color="white"
                textAlign="left"
                numberOfLines={1}
                width="88%"
              >
                {i18n.t(`blockchainServices.${props.account.blockchain}.id`)}
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>

        {props.account.address && (
          <LinearLayout
            mt={10 * unit}
            orientation="horiz"
            alignItems="flex-end"
            justifyContent="space-between"
            mb={5 * unit}
            pr={30 * unit}
          >
            <LinearLayout>
              <LinearLayout orientation="horiz">
                {props.account.accountType === 'watch' ? (
                  <ImageView
                    width={21 * unit}
                    height={21 * unit}
                    source={require('~/src/assets/images/icon-watch-white.png')}
                    ml={7 * unit}
                    mt={4 * unit}
                    mb={4 * unit}
                    alignSelf="center"
                    mr={8 * unit}
                  />
                ) : (
                  <LinearLayout ml={10 * unit} />
                )}

                <LinearLayout width={285 * unit}>
                  <TextView fontSize={12 * unit} color="white" textAlign="left" fontFamily="bold">
                    {i18n.t('paymentCard.address')}
                  </TextView>

                  <TextView
                    color="primary"
                    opacity={0.6}
                    textAlign="left"
                    fontFamily="medium"
                    ellipsizeMode="middle"
                    pr="1px"
                    numberOfLines={1}
                    fontSize="14"
                  >
                    {props.account.address}
                  </TextView>
                </LinearLayout>
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        )}
      </LinearLayout>
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
                <AccountContainer viewHeight={viewHeight} account={it} index={i} isInactive={isInactive} />
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
