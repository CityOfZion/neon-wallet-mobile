import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useRef, useState} from 'react'
import {TouchableWithoutFeedback, View} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import BalanceList from '~src/components/BalanceList'
import WalletCard from '~src/components/WalletCard'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'
import {TokenAsset} from '~src/models/TokenAsset'
import {Wallet} from '~src/models/redux/Wallet'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

interface WalletProps {
  navigation: StackNavigationProp<
    WalletStackParamList & MoreStackParamList & TabStackParamList
  >
  theme: ApplicationTheme
}

const ListWalletView = (props: WalletProps) => {
  const carouselRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [tokenAssets, setTokenAssets] = useState<TokenAsset[]>([])

  const {wallets, accounts, exchange} = useSelector(
    (state: RootState) => state.app
  )
  const {currency, language} = useSelector((state: RootState) => state.settings)

  useEffect(() => {
    Facade.await.run('populate', populate)
  }, [activeIndex, currency, language])

  const getActiveWallet = (): Wallet | null => {
    return wallets[activeIndex] ?? null
  }

  const isListNotEmpty = () => {
    return Boolean(wallets.length)
  }

  const populate = async () => {
    const wallet = getActiveWallet()

    if (wallet) {
      const tokenAssets = await wallet.generateTokenAssets(accounts)
      setTokenAssets(tokenAssets)
    }
  }

  const selectEvent = async (wallet: Wallet) => {
    if (wallet.walletType !== 'standard') {
      goToFirstAccount(wallet)
    } else {
      goToWallet(wallet)
    }
  }

  const goToFirstAccount = (wallet: Wallet) => {
    const accountsFromWallet = wallet.getAccounts(accounts)

    if (accountsFromWallet.length > 0) {
      props.navigation.navigate(Facade.route.GetAccount.name, {
        account: accountsFromWallet[0],
      })
    } else {
      // Fall back
      goToWallet(wallet)
    }
  }

  const goToWallet = (wallet: Wallet) => {
    props.navigation.navigate(Facade.route.GetWallet.name, {
      wallet,
    })
  }

  const _renderWalletChange = () => {
    const wallet = getActiveWallet()

    if (!wallet) return <View />

    return (
      <>
        <LinearLayout mb={4} orientation="verti" alignItems="center">
          {
            <TextView fontSize="11px" color="text.2">
              {wallet.formattedLastVisitedAt}
            </TextView>
          }

          <LinearLayout orientation="horiz" minHeight={56}>
            <TextView fontSize="36px" color="text.0" fontFamily="medium">
              {wallet.calculateBalanceFormatted(
                tokenAssets,
                currency,
                language,
                exchange
              )}
            </TextView>

            <ImageView
              mt="8px"
              mx="4px"
              source={require('~src/assets/images/info-primary.png')}
            />
            {/*TODO: fix percentage*/}
            {/*<TextView fontSize="36px" color="primary" fontFamily="semibold">*/}
            {/*  {calculateChangePercentage(wallet)}*/}
            {/*</TextView>*/}
          </LinearLayout>
        </LinearLayout>
      </>
    )
  }

  const calculateChangePercentage = (wallet: Wallet) => {
    return null
    // TODO: fix percentage
    // const changePercentage =
    //   ((wallet.currentValue - wallet.previousValue) / wallet.previousValue) *
    //   100
    // return `${changePercentage > 0 ? '+' : ''}${Math.round(changePercentage)}%`
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useStatusBarPadding={true}
      padding={0}
    >
      <>
        <LinearLayout alignSelf={'flex-end'}>
          <ThemedMoreButton
            onPress={() =>
              props.navigation.navigate(Facade.route.Modal.name, {
                screen: Facade.route.WalletContextModal.name,
              })
            }
          />
        </LinearLayout>

        {isListNotEmpty() ? (
          <LinearLayout
            mt="12px"
            orientation="horiz"
            justifyContent="center"
            height={400}
          >
            <Carousel<Wallet>
              layout={'default'}
              ref={carouselRef}
              data={wallets}
              firstItem={0}
              sliderWidth={Facade.app.windowWidth}
              itemWidth={Math.round(Facade.app.windowWidth * 0.7)}
              inactiveSlideScale={0.8}
              inactiveSlideOpacity={1}
              inactiveSlideShift={12}
              lockScrollWhileSnapping={true}
              lockScrollTimeoutDuration={200}
              activeSlideOffset={5}
              swipeThreshold={5}
              enableSnap={true}
              renderItem={({item}) => (
                <WalletCard onPress={() => selectEvent(item)} wallet={item} />
              )}
              onSnapToItem={(index) => setActiveIndex(index)}
            />
          </LinearLayout>
        ) : (
          <LinearLayout alignItems={'center'} mx={3}>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.navigate(Facade.route.More.name, {
                  screen: Facade.route.Step1CreateWallet.name,
                })
              }
            >
              <LinearLayout
                my={6}
                orientation={'horiz'}
                width={Facade.scale(300)}
                maxWidth={'100%'}
                alignItems={'center'}
                justifyContent={'center'}
                borderStyle={'dashed'}
                borderColor={'text.0'}
                borderRadius={17}
                borderWidth={1}
                style={{
                  aspectRatio: 20 / 25,
                }}
              >
                <ImageView
                  source={require('~src/assets/images/icon-plus-white.png')}
                />

                <TextView
                  color="white"
                  fontSize={18}
                  mt={2}
                  ml={3}
                  fontFamily="medium"
                >
                  {Facade.t('screens.listWallets.createFirstWallet')}
                </TextView>
              </LinearLayout>
            </TouchableWithoutFeedback>
          </LinearLayout>
        )}

        <AwaitActivity
          name={'populate'}
          size={'large'}
          style={{minHeight: 100}}
        >
          {_renderWalletChange()}

          <LinearLayout mx={'16px'}>
            {/*TODO: Make this useful*/}
            {/*<LinearLayout my={4}>*/}
            {/*  <Notification*/}
            {/*    text={*/}
            {/*      'Tum dicere exorsus est et dolore magnam aliquam quaerat voluptatem ut de homine.'*/}
            {/*    }*/}
            {/*  />*/}
            {/*</LinearLayout>*/}

            {isListNotEmpty() && (
              <BalanceList
                mb={4}
                tokenAssets={tokenAssets}
                fromAccountView={false}
              />
            )}
          </LinearLayout>
        </AwaitActivity>
      </>
    </ScreenLayout>
  )
}

export default ListWalletView
