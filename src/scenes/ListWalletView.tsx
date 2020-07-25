import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useRef, useState} from 'react'
import {TouchableWithoutFeedback, View} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import BalanceList from '~src/components/BalanceList'
import Notification from '~src/components/Notification'
import WalletCard from '~src/components/WalletCard'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

interface WalletProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  theme: ApplicationTheme
}

const ListWalletView = (props: WalletProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef(null)

  const wallets = useSelector((state: RootState) => state.app.wallets)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const getActiveWallet = (): Wallet | null => {
    return wallets[activeIndex] ?? null
  }

  const isListNotEmpty = () => {
    return Boolean(wallets.length)
  }

  const selectEvent = async (wallet: Wallet) => {
    props.navigation.navigate(Facade.route.GetWallet.name, {
      wallet,
      headerTitle: wallet.name ?? '-',
    })
  }

  const _renderWalletChange = () => {
    const wallet = getActiveWallet()

    if (!wallet) return <View />

    return (
      <>
        <LinearLayout orientation="verti" alignItems="center">
          {
            <TextView fontSize="11px" color="text.2">
              {wallet.formattedLastVisitedAt}
            </TextView>
          }
          <LinearLayout orientation="horiz">
            <TextView fontSize="36px" color="text.0" fontFamily="medium">
              {Facade.filter.currency(
                wallet.currentValue ?? 0,
                currency,
                language
              )}
            </TextView>
            <ImageView
              mt="8px"
              mx="4px"
              source={require('~src/assets/images/info-primary.png')}
            />
            {wallet.previousValue ? (
              <TextView fontSize="36px" color="primary" fontFamily="semibold">
                {calculateChangePercentage(wallet)}
              </TextView>
            ) : null}
          </LinearLayout>
        </LinearLayout>
      </>
    )
  }

  const calculateChangePercentage = (wallet: Wallet) => {
    const changePercentage =
      ((wallet.currentValue - wallet.previousValue) / wallet.previousValue) *
      100
    return `${changePercentage > 0 ? '+' : ''}${Math.round(changePercentage)}%`
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useStatusBarPadding={true}
      padding={0}
    >
      <AwaitActivity name={'populate'} loadingView={<ScreenLoader />}>
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

          {_renderWalletChange()}

          <LinearLayout mx="16px" mt="16px">
            <Notification
              text={
                'Tum dicere exorsus est et dolore magnam aliquam quaerat voluptatem ut de homine.'
              }
            />
          </LinearLayout>

          {isListNotEmpty() && (
            <BalanceList
              my="16px"
              mx="16px"
              tokenAssets={getActiveWallet()?.currentAssets}
            />
          )}
        </>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default ListWalletView
