import {CommonActions} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useRef, useState} from 'react'
import {Alert, AppState, TouchableWithoutFeedback, View} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import Carousel from 'react-native-snap-carousel'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import BalanceList from '~src/components/BalanceList'
import Notification from '~src/components/Notification'
import WalletCard from '~src/components/WalletCard'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Wallet} from '~src/models/redux/Wallet'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'
import {Exchange} from '~src/types/exchange'

interface WalletProps {
  navigation: StackNavigationProp<WalletStackParamList & MoreStackParamList>
  theme: ApplicationTheme
}

const TitleComponent = () => {
  return <AwaitActivity name={'refreshData'} />
}

const WalletChangeComponent = (props: {
  wallet: Wallet | null
  currency: Currency
  language: Lang
  exchange: Exchange
  onPressWarning: () => void
}) => {
  if (!props.wallet) return <View />

  return (
    <>
      <LinearLayout mb={6} orientation="verti" alignItems="center">
        {
          <TextView fontSize="11px" color="text.2">
            {props.wallet.formattedLastVisitedAt}
          </TextView>
        }

        <LinearLayout orientation="horiz" minHeight={56}>
          <TextView fontSize="36px" color="text.0" fontFamily="medium">
            {props.wallet.calculateBalanceFormatted(
              props.currency,
              props.language,
              props.exchange
            )}
          </TextView>

          {props.wallet.hasFunds && (
            <ButtonView onPress={props.onPressWarning}>
              <ImageView
                mt="8px"
                mx="4px"
                source={require('~src/assets/images/icon-warning-green.png')}
              />
            </ButtonView>
          )}

          {/*TODO: fix percentage*/}
          {/*<TextView fontSize="36px" color="primary" fontFamily="semibold">*/}
          {/*  {calculateChangePercentage(wallet)}*/}
          {/*</TextView>*/}
        </LinearLayout>
      </LinearLayout>
    </>
  )
}

const ListWalletView = (props: WalletProps) => {
  const carouselRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const {wallets, accounts, exchange} = useSelector(
    (state: RootState) => state.app
  )

  const {currency, language} = useSelector((state: RootState) => state.settings)

  props.navigation.setOptions({
    headerTitle: TitleComponent,
  })

  const getActiveWallet = (): Wallet | null => {
    return wallets[activeIndex] ?? null
  }

  const isListNotEmpty = () => {
    return Boolean(wallets.length)
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
  const openWarning = () =>
    Alert.alert(
      Facade.t('screens.listWallets.incompleteBalanceWarningTitle'),
      Facade.t('screens.listWallets.incompleteBalanceWarningText'),
      [{text: Facade.t('screens.listWallets.incompleteBalanceWarningButton')}],
      {cancelable: false}
    )

  const calculateChangePercentage = (wallet: Wallet) => {
    return null
    // TODO: fix percentage
    // const changePercentage =
    //   ((wallet.currentValue - wallet.previousValue) / wallet.previousValue) *
    //   100
    // return `${changePercentage > 0 ? '+' : ''}${Math.round(changePercentage)}%`
  }

  const wallet = getActiveWallet()

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
                <LinearLayout
                  weight={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <WalletCard
                    width={240}
                    onPress={() => selectEvent(item)}
                    wallet={item}
                  />
                </LinearLayout>
              )}
              onSnapToItem={(index) => setActiveIndex(index)}
            />
          </LinearLayout>
        ) : (
          <LinearLayout alignItems={'center'} mx={3}>
            <TouchableWithoutFeedback
              onPress={() =>
                CommonActions.navigate(Facade.route.Tab.name, {
                  screen: Facade.route.More.name,
                  params: {
                    screen: Facade.route.Step1CreateWallet.name,
                  },
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
          <WalletChangeComponent
            currency={currency}
            exchange={exchange}
            language={language}
            wallet={getActiveWallet()}
            onPressWarning={openWarning}
          />

          <LinearLayout mx={'16px'}>
            {wallet?.showBackupAlert && wallet.walletType === 'standard' && (
              <LinearLayout mb={6}>
                <Notification
                  text={Facade.t('screens.listWallets.noBackup')}
                  wallet={wallet}
                />
              </LinearLayout>
            )}

            {isListNotEmpty() && (
              <BalanceList
                mb={6}
                tokenAssets={wallet?.tokenAssets ?? []}
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
