import {CommonActions, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import moment from 'moment'
import React, {useEffect, useRef, useState} from 'react'
import {Alert, TouchableWithoutFeedback, View, Animated} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import BalanceList from '~src/components/BalanceList'
import Notification from '~src/components/Notification'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import WalletPicker from '~src/components/misc/WalletPicker'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Wallet} from '~src/models/redux/Wallet'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'
import {Exchange} from '~src/types/exchange'
export interface ListWalletParams {}

interface WalletProps {
  navigation: StackNavigationProp<WalletStackParamList & MoreStackParamList>
  route: RouteProp<WalletStackParamList, 'ListWalletsPage'>
  theme: ApplicationTheme
}

const WalletChangeComponent = (props: {
  wallet?: Wallet
  currency: Currency
  language: Lang
  exchange: Exchange
  onPressWarning: () => void
}) => {
  const {currency, language} = useSelector((state: RootState) => state.settings)
  const {exchange} = useSelector((state: RootState) => state.app)
  const [variationInPercent, setVariationInPercent] = useState<number>()

  if (!props.wallet) return <View />

  useEffect(() => {
    setVariationInPercent(undefined)
    populate()
  }, [props.wallet])

  const populate = async () => {
    const pastOneDay = moment().add(-1, 'day')

    const variation =
      (await props.wallet?.getBalanceVariationFromPastExchange(
        currency,
        exchange,
        pastOneDay
      )) ?? 0

    const balance = props.wallet?.calculateBalance(currency, exchange) ?? 0

    if (balance !== 0) {
      setVariationInPercent((variation / balance) * 100)
    } else {
      setVariationInPercent(0)
    }
  }

  return (
    <>
      <LinearLayout mb={6} alignItems={'center'}>
        <TextView fontSize={'11px'} color={'text.2'}>
          {props.wallet.formattedLastVisitedAt}
        </TextView>

        <LinearLayout orientation={'horiz'} minHeight={56}>
          <TextView fontSize={'36px'} color={'text.0'} fontFamily={'medium'}>
            {props.wallet.calculateBalanceFormatted(
              props.currency,
              props.language,
              props.exchange
            )}
          </TextView>

          {props.wallet.hasFunds && (
            <ButtonView onPress={props.onPressWarning}>
              <ImageView
                mt={'8px'}
                mx={'4px'}
                source={require('~src/assets/images/icon-warning-green.png')}
              />
            </ButtonView>
          )}
        </LinearLayout>

        <AwaitActivity name={'populateVariation'}>
          <LinearLayout orientation={'horiz'}>
            <TextView
              mr={2}
              fontSize={'sm'}
              color={'text.2'}
              fontFamily={'semibold'}
            >
              {Facade.t('screens.listWallets.changeInLast24hours')}
            </TextView>

            {variationInPercent !== undefined && (
              <TextView
                fontSize={'sm'}
                color={variationInPercent >= 0 ? 'success' : 'danger'}
                fontFamily={'semibold'}
              >
                {variationInPercent > 0 ? '+' : ''}
                {Facade.filter.decimal(variationInPercent, language, 2)}%
              </TextView>
            )}
          </LinearLayout>
        </AwaitActivity>
      </LinearLayout>
    </>
  )
}

const EmptyListComponent = () => {
  return (
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
  )
}

const ListWalletView = (props: WalletProps) => {
  const {wallets, accounts, exchange} = useSelector(
    (state: RootState) => state.app
  )

  const {currency, language} = useSelector((state: RootState) => state.settings)
  const {id} = useSelector((state: RootState) => state.wallet)

  const [selectedWallet, setSelectedWallet] = useState<Wallet>()

  const dispatch = useDispatch()
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()

  useEffect(() => {
    if (id) {
      const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())
      setSelectedWallet(wallet)
    } else {
      dispatch(RootStore.wallet.actions.selectWallet(wallets[0]?.id ?? null))
    }
    fadeIn()
  }, [id])

  const isListNotEmpty = () => {
    return Boolean(wallets.length)
  }

  const selectEvent = async (wallet: Wallet) => {
    dispatch(RootStore.wallet.actions.selectWallet(wallet.id))
  }

  const pressEvent = async (wallet: Wallet) => {
    if (wallet.walletType === 'standard') {
      props.navigation.navigate(Facade.route.GetWallet.name, {})
    } else {
      goToFirstAccount(wallet)
    }
  }

  const goToFirstAccount = (wallet: Wallet) => {
    const accountsFromWallet = wallet.getAccounts(accounts)

    if (accountsFromWallet.length > 0) {
      dispatch(
        RootStore.account.actions.selectAccount(accountsFromWallet[0].address)
      )

      props.navigation.navigate(Facade.route.GetAccount.name, {
        key: Facade.route.GetAccount.name,
      })
    } else {
      // Fall back
      props.navigation.navigate(Facade.route.GetWallet.name, {})
    }
  }

  const fadeValue = useRef(new Animated.Value(1)).current
  const fadeIn = () => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }
  const fadeOut = () => {
    Animated.timing(fadeValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const fadeOutWallet = () => {
    if (wallets.length > 1) {
      fadeOut()
    }
  }

  const openWarning = () =>
    Alert.alert(
      Facade.t('screens.listWallets.incompleteBalanceWarningTitle'),
      Facade.t('screens.listWallets.incompleteBalanceWarningText'),
      [{text: Facade.t('screens.listWallets.incompleteBalanceWarningButton')}],
      {cancelable: false}
    )

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

        <AwaitActivity name={'populateWallet'}>
          <>
            <LinearLayout mt={4} justifyContent={'center'} height={400}>
              {isListNotEmpty() ? (
                <WalletPicker
                  wallets={wallets}
                  onSelect={selectEvent}
                  onPress={pressEvent}
                  onScrollBegin={fadeOutWallet}
                />
              ) : (
                <EmptyListComponent />
              )}
            </LinearLayout>

            {selectedWallet && (
              <Animated.View style={{opacity: fadeValue}}>
                <WalletChangeComponent
                  currency={currency}
                  exchange={exchange}
                  language={language}
                  wallet={selectedWallet}
                  onPressWarning={openWarning}
                />
                <LinearLayout mx={'16px'}>
                  {selectedWallet.showBackupAlert &&
                    selectedWallet.walletType === 'standard' && (
                      <LinearLayout mb={6}>
                        <Notification
                          text={Facade.t('screens.listWallets.noBackup')}
                          wallet={selectedWallet}
                          propsNavigation={props.navigation}
                        />
                      </LinearLayout>
                    )}

                  {isListNotEmpty() && (
                    <BalanceList
                      mb={6}
                      tokenAssets={selectedWallet.tokenAssets ?? []}
                      walletId={selectedWallet.id ?? undefined}
                      fromAccountView={false}
                      fromListWalletView={true}
                      fromSendAccountSelectionModal={false}
                    />
                  )}
                </LinearLayout>
              </Animated.View>
            )}
          </>
        </AwaitActivity>
      </>
    </ScreenLayout>
  )
}

export default ListWalletView
