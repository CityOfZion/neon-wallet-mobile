import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, TouchableWithoutFeedback, View, Animated, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { TabStackParamList } from '../../navigation/TabNavigation'

import SkeletonContainer from '~/src/components/SkeletonContainer'
import { useExchange } from '~/src/hooks/useExchange'
import { Exchange } from '~/src/types/exchange'
import { SyncDispatch } from '~/src/types/reducers/root'
import { wrapper } from '~src/app/ApplicationWrapper'
import { Normalize } from '~src/app/Normalize'
import BalanceList from '~src/components/BalanceList'
import Notification from '~src/components/Notification'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import WalletPicker from '~src/components/misc/WalletPicker'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'
import { Lang } from '~src/enums/Lang'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { TokenAsset } from '~src/models/TokenAsset'
import { Wallet } from '~src/models/redux/Wallet'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { RootState, RootStore } from '~src/store/RootStore'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
import { ApplicationTheme } from '~src/themes/ApplicationTheme'

type Props = WalletStackParamList & RootStackParamList & TabStackParamList & ModalStackParamList

interface WalletProps {
  navigation: StackNavigationProp<Props>
  route: RouteProp<WalletStackParamList, 'ListWalletsPage'>
  theme: ApplicationTheme
}

interface EmptyListProps {
  navigation: StackNavigationProp<Props>
}

const WalletChangeComponent = (props: {
  wallet: Wallet
  language: Lang
  tokenAssets: TokenAsset[]
  onPressWarning: () => void
  exchange?: Exchange
}) => {
  const { currency, language } = useSelector((state: RootState) => state.settings)
  const { accounts } = useSelector((state: RootState) => state.app)
  const [variationInPercent, setVariationInPercent] = useState<number>()

  const formattedBalance = props.exchange
    ? props.wallet.calculateBalanceFormatted(
        currency,
        language,
        props.exchange,
        props.wallet.calculateBalance(currency, props.exchange) ?? 0
      )
    : '-'

  const populate = async () => {
    const { exchange } = props
    if (exchange) {
      const pastOneDay = moment().add(-1, 'day')

      const variation = (await props.wallet.getBalanceVariationFromPastExchange(currency, pastOneDay, exchange)) ?? 0

      props.wallet.populateTokenAssets(accounts)

      const balance = props.wallet.calculateBalance(currency, exchange) ?? 0

      if (balance !== 0) {
        setVariationInPercent((variation / balance) * 100)
      } else {
        setVariationInPercent(0)
      }
    }
  }

  const showListTokenAssets = (tokenAssets: TokenAsset[]) => {
    return tokenAssets.some(token => token.amount > 0)
  }

  useEffect(() => {
    populate()
  }, [props.wallet, props.exchange, formattedBalance])

  return (
    <LinearLayout mb={6} alignItems="center">
      {showListTokenAssets(props.tokenAssets) ? (
        <TextView fontSize="11px" color="text.2">
          {props.wallet.formattedLastVisitedAt}
        </TextView>
      ) : (
        <View />
      )}
      <SkeletonContainer isLoading={!props.exchange} skeletonType="balanceWallet">
        <LinearLayout orientation="horiz" minHeight={56}>
          <TextView fontSize="36px" color="text.0" fontFamily="medium">
            {formattedBalance}
          </TextView>
          {props.wallet.hasFunds && (
            <ButtonView onPress={props.onPressWarning}>
              <ImageView mt="8px" mx="4px" source={require('~src/assets/images/icon-warning-green.png')} />
            </ButtonView>
          )}
        </LinearLayout>
      </SkeletonContainer>

      <AwaitActivity name="populateVariation">
        <LinearLayout orientation="horiz">
          <TextView mr={2} fontSize="sm" color="text.2" fontFamily="semibold">
            {i18n.t('screens.listWallets.changeInLast24hours')}
          </TextView>

          {variationInPercent !== undefined && (
            <TextView
              fontSize="sm"
              color={variationInPercent > 0 ? 'success' : variationInPercent === 0 ? 'text.2' : 'danger'}
              fontFamily="semibold"
            >
              {variationInPercent > 0 ? '+' : variationInPercent === 0 ? '-' : ''}
              {variationInPercent === 0 ? '' : `${FilterHelper.decimal(variationInPercent, language, 2)}%`}
            </TextView>
          )}
        </LinearLayout>
      </AwaitActivity>
    </LinearLayout>
  )
}

const EmptyListComponent: React.FC<EmptyListProps> = props => {
  const { navigation } = props
  return (
    <LinearLayout alignItems="center" mx={3}>
      <TouchableWithoutFeedback
        onPress={() => {
          props.navigation.reset({
            index: 0,
            routes: [
              { name: wrapper.route.Tab.name },
              { name: wrapper.route.Step1CreateWallet.name },
              { name: wrapper.route.MorePage.name },
            ],
          })
          navigation.navigate(wrapper.route.Tab.name, {
            screen: wrapper.route.More.name,
            params: {
              screen: wrapper.route.Step1CreateWallet.name,
              initial: false,
              params: {
                source: wrapper.route.WalletContextModal.name,
              },
            },
          })
        }}
      >
        <LinearLayout
          my={6}
          orientation="horiz"
          width={Normalize.scale(300)}
          maxWidth="100%"
          alignItems="center"
          justifyContent="center"
          borderStyle="dashed"
          borderColor="text.0"
          borderRadius={17}
          borderWidth={1}
          style={{
            aspectRatio: 20 / 25,
          }}
        >
          <ImageView source={require('~src/assets/images/icon-plus-white.png')} />

          <TextView color="white" fontSize={18} mt={2} ml={3} fontFamily="medium">
            {i18n.t('screens.listWallets.createFirstWallet')}
          </TextView>
        </LinearLayout>
      </TouchableWithoutFeedback>
    </LinearLayout>
  )
}

const ListWalletView = (props: WalletProps) => {
  const { wallets, accounts } = useSelector((state: RootState) => state.app)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const { language, currency } = useSelector((state: RootState) => state.settings)
  const { id } = useSelector((state: RootState) => state.wallet)
  const dispatch = useDispatch()
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()
  const { exchange, isRefetching, refetch } = useExchange({ filter: { currencies: currency } })

  const selectedWallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  useEffect(() => {
    if (!id) {
      dispatch(RootStore.wallet.actions.selectWallet(wallets[0]?.id ?? null))
    }
    fadeIn()
  }, [id, wallets, accounts])

  const isListNotEmpty = () => {
    return Boolean(wallets.length)
  }

  const selectEvent = async (wallet: Wallet) => {
    fadeIn()
    dispatch(RootStore.wallet.actions.selectWallet(wallet.id))
  }

  const pressEvent = async () => {
    props.navigation.navigate(wrapper.route.GetWallet.name)
  }

  const fadeValue = useRef(new Animated.Value(1)).current
  const fadeIn = () => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
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
    setTimeout(() => {
      fadeIn()
    }, 3000)
  }

  const openWarning = () =>
    Alert.alert(
      i18n.t('screens.listWallets.incompleteBalanceWarningTitle'),
      i18n.t('screens.listWallets.incompleteBalanceWarningText'),
      [{ text: i18n.t('screens.listWallets.incompleteBalanceWarningButton') }],
      { cancelable: false }
    )

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useStatusBarPadding
      padding={0}
      darkerSolidColorBG
      refreshControl={<RefreshControl tintColor="#fff" refreshing={isRefetching} onRefresh={refetch} />}
    >
      <>
        <LinearLayout alignSelf="flex-end" style={{ marginTop: !isConnected ? 14 : undefined }}>
          <ThemedMoreButton
            onPress={() =>
              props.navigation.navigate(wrapper.route.Modal.name, {
                screen: wrapper.route.WalletContextModal.name,
                params: { wallets },
              })
            }
          />
        </LinearLayout>

        <AwaitActivity name="populateWallet">
          <>
            <LinearLayout mt={-5} justifyContent="center" height={385}>
              {isListNotEmpty() ? (
                <WalletPicker
                  exchange={exchange}
                  wallets={wallets}
                  onSelect={selectEvent}
                  onPress={pressEvent}
                  onScrollBegin={fadeOutWallet}
                />
              ) : (
                <EmptyListComponent navigation={props.navigation} />
              )}
            </LinearLayout>

            {selectedWallet && (
              <Animated.View style={{ opacity: fadeValue }}>
                <WalletChangeComponent
                  exchange={exchange}
                  language={language}
                  wallet={selectedWallet}
                  tokenAssets={selectedWallet.tokenAssets ?? []}
                  onPressWarning={openWarning}
                />
                <LinearLayout mx="16px">
                  {selectedWallet.showBackupAlert && selectedWallet.walletType === 'standard' && (
                    <LinearLayout mb={6}>
                      <Notification
                        text={i18n.t('screens.listWallets.noBackup')}
                        wallet={selectedWallet}
                        propsNavigation={props.navigation}
                      />
                    </LinearLayout>
                  )}

                  {isListNotEmpty() && (
                    <BalanceList
                      exchange={exchange}
                      mb={6}
                      tokenAssets={selectedWallet.tokenAssets ?? []}
                      showBlockchain
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

EmptyListComponent.propTypes = {
  navigation: PropTypes.any.isRequired,
}

export default ListWalletView
