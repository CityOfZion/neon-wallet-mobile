import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo, useRef, useState } from 'react'
import { Alert, Animated, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { TabStackParamList } from '../../navigation/TabNavigation'

import { Skeleton } from '~/src/components/Skeleton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import { wrapper } from '~src/app/ApplicationWrapper'
import BalanceList from '~src/components/BalanceList'
import Notification from '~src/components/Notification'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import WalletPicker from '~src/components/misc/WalletPicker'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'
import { Wallet } from '~src/models/redux/Wallet'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { RootState, RootStore } from '~src/store/RootStore'
import { ButtonView, ButtonWithoutFeedbackView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface WalletProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList & TabStackParamList & ModalStackParamList>
  route: RouteProp<WalletStackParamList, 'ListWalletsPage'>
}

interface SelectedWalletInfoProps {
  selectedWallet: Wallet
  balanceExchange: UseMultipleBalanceAndExchangeResult
}

interface FirstWalletModalProps {
  onPress: () => void
}

const FirstWalletModal = ({ onPress }: FirstWalletModalProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <LinearLayout
      backgroundColor={`${theme.colors.black}A6`}
      zIndex={1}
      position="absolute"
      left="50%"
      top="50%"
      width={150}
      height={150}
      borderRadius="14px"
      style={{
        transform: [{ translateX: -75 }, { translateY: -75 }],
      }}
    >
      <ButtonWithoutFeedbackView onPress={onPress}>
        <LinearLayout alignItems="center" justifyContent="space-evenly" flex={1} p="8px">
          <LinearLayout border={1} width={44} height={44} borderColor="primary" p={4} borderRadius={50}>
            <ImageView
              source={require('~src/assets/images/icon-arrow-curve-down-green.png')}
              resizeMode="contain"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </LinearLayout>
          <LinearLayout>
            <TextView fontWeight={500} fontSize="xl" color="primary">
              {i18n.t('screens.listWallets.isFirstWallet.title')}
            </TextView>
            <TextView color="text.0" fontSize="md" textAlign="center" px="8px">
              {i18n.t('screens.listWallets.isFirstWallet.subtitle')}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonWithoutFeedbackView>
    </LinearLayout>
  )
}

const SelectedWalletInfo = ({ selectedWallet, balanceExchange }: SelectedWalletInfoProps) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)

  const totalTokensBalances = useMemo(
    () => BalanceHelper.calculateTotalBalances(balanceExchange.balance.data, balanceExchange.exchange.data),
    [balanceExchange]
  )

  const formattedTotalTokensBalances = useMemo(
    () => FilterHelper.currency(totalTokensBalances, currency, language),
    [totalTokensBalances, currency, language]
  )

  const [notificationIsVisible, setNotificationIsVisible] = useState(
    selectedWallet.showBackupAlert && selectedWallet.walletType === 'standard'
  )

  const handlePressWarning = () =>
    Alert.alert(
      i18n.t('screens.listWallets.incompleteBalanceWarningTitle'),
      i18n.t('screens.listWallets.incompleteBalanceWarningText'),
      [{ text: i18n.t('screens.listWallets.incompleteBalanceWarningButton') }],
      { cancelable: false }
    )

  const handleCloseNotification = () => {
    setNotificationIsVisible(false)
  }

  return (
    <LinearLayout>
      <LinearLayout alignItems="center">
        <TextView fontSize="11px" color="text.2">
          {selectedWallet.formattedLastVisitedAt}
        </TextView>

        <Skeleton isLoading={balanceExchange.isLoading} layout={{ width: 100, height: 36, marginVertical: 12 }}>
          <LinearLayout orientation="horiz" my="12px">
            <TextView fontSize="36px" color="text.0" fontFamily="medium">
              {formattedTotalTokensBalances}
            </TextView>

            {!!totalTokensBalances && totalTokensBalances > 0 && (
              <ButtonView onPress={handlePressWarning}>
                <ImageView mt="8px" mx="4px" source={require('~src/assets/images/icon-warning-green.png')} />
              </ButtonView>
            )}
          </LinearLayout>
        </Skeleton>
      </LinearLayout>

      <LinearLayout mx="16px">
        {notificationIsVisible && (
          <LinearLayout>
            <Notification
              text={i18n.t('screens.listWallets.noBackup')}
              wallet={selectedWallet}
              onClose={handleCloseNotification}
            />
          </LinearLayout>
        )}

        <BalanceList my="24px" balanceExchange={balanceExchange} showBlockchain />
      </LinearLayout>
    </LinearLayout>
  )
}

const ListWalletView = (props: WalletProps) => {
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const isFirstTime = useSelector((state: RootState) => state.settings.isFirstTime)
  const dispatch = useDispatch()

  const fadeValue = useRef(new Animated.Value(1)).current

  const [selectedWallet, setSelectedWallet] = useState(wallets[0])

  const balanceExchange = useBalancesAndExchange(selectedWallet.getAccounts(accounts))

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

  const handlePress = async (wallet: Wallet) => {
    dispatch(RootStore.wallet.actions.selectWallet(wallet.id))
    props.navigation.navigate(wrapper.route.GetWallet.name, { wallet })
  }

  const handlePressFirstTime = () => {
    dispatch(RootStore.settings.actions.setIsFirstTime(false))
    handlePress(wallets[0])
  }

  const handleSelect = async (wallet: Wallet) => {
    fadeIn()
    setSelectedWallet(wallet)
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useStatusBarPadding
      padding={0}
      darkerSolidColorBG
      refreshControl={
        <RefreshControl
          tintColor="#fff"
          refreshing={balanceExchange.isRefetchingByUser}
          onRefresh={balanceExchange.refetch}
        />
      }
    >
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

      <LinearLayout mt={-5} justifyContent="center" height={385}>
        {isFirstTime && <FirstWalletModal onPress={handlePressFirstTime} />}
        <WalletPicker
          wallets={wallets}
          balanceExchange={balanceExchange}
          selectedWallet={selectedWallet}
          onSelect={handleSelect}
          onPress={handlePress}
          onScrollBegin={fadeOutWallet}
        />
      </LinearLayout>

      <Animated.View style={{ opacity: fadeValue }}>
        <SelectedWalletInfo selectedWallet={selectedWallet} balanceExchange={balanceExchange} />
      </Animated.View>
    </ScreenLayout>
  )
}

export default ListWalletView
