import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo, useRef, useState } from 'react'
import { Alert, Animated, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { TabStackParamList } from '../../navigation/TabNavigation'

import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useBalances } from '~/src/hooks/useBalances'
import { useExchange } from '~/src/hooks/useExchange'
import { Balance } from '~/src/types/balance'
import { MultiExchange } from '~/src/types/exchange'
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
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface WalletProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList & TabStackParamList & ModalStackParamList>
  route: RouteProp<WalletStackParamList, 'ListWalletsPage'>
}

interface SelectedWalletInfoProps {
  selectedWallet: Wallet
  selectedWalletBalances: Balance[]
  exchange?: MultiExchange
}

const SelectedWalletInfo = ({ selectedWallet, selectedWalletBalances, exchange }: SelectedWalletInfoProps) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)

  const totalTokensBalances = useMemo(
    () => BalanceHelper.calculateTotalBalances(selectedWalletBalances, exchange),
    [selectedWalletBalances, exchange]
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

        <LinearLayout orientation="horiz" minHeight={56}>
          <TextView fontSize="36px" color="text.0" fontFamily="medium">
            {formattedTotalTokensBalances}
          </TextView>

          {!!totalTokensBalances && totalTokensBalances > 0 && (
            <ButtonView onPress={handlePressWarning}>
              <ImageView mt="8px" mx="4px" source={require('~src/assets/images/icon-warning-green.png')} />
            </ButtonView>
          )}
        </LinearLayout>

        <LinearLayout orientation="horiz">
          <TextView mr={2} fontSize="sm" color="text.2" fontFamily="semibold">
            {i18n.t('screens.listWallets.changeInLast24hours')}
          </TextView>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout mx="16px">
        {notificationIsVisible && (
          <LinearLayout mt="24px">
            <Notification
              text={i18n.t('screens.listWallets.noBackup')}
              wallet={selectedWallet}
              onClose={handleCloseNotification}
            />
          </LinearLayout>
        )}

        <BalanceList my="24px" exchange={exchange} balances={selectedWalletBalances} showBlockchain />
      </LinearLayout>
    </LinearLayout>
  )
}

const ListWalletView = (props: WalletProps) => {
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const dispatch = useDispatch()

  const fadeValue = useRef(new Animated.Value(1)).current

  const [selectedWallet, setSelectedWallet] = useState(wallets[0])

  const { exchange, isRefetching: exchangeIsRefetching, refetch: exchangeRefetch } = useExchange()

  const { balances: selectedWalletBalances, queryResults: balanceQueryResult } = useBalances(
    selectedWallet.getAccounts(accounts)
  )

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

  const pressEvent = async (wallet: Wallet) => {
    dispatch(RootStore.wallet.actions.selectWallet(wallet.id))
    props.navigation.navigate(wrapper.route.GetWallet.name, { wallet })
  }

  const selectEvent = async (wallet: Wallet) => {
    fadeIn()
    setSelectedWallet(wallet)
  }

  const isRefetching = () => {
    return exchangeIsRefetching || balanceQueryResult.some(balance => balance.isRefetching)
  }

  const handleRefetch = () => {
    exchangeRefetch()
    balanceQueryResult.map(balance => balance.refetch())
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useStatusBarPadding
      padding={0}
      darkerSolidColorBG
      refreshControl={<RefreshControl tintColor="#fff" refreshing={isRefetching()} onRefresh={handleRefetch} />}
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
        <WalletPicker
          wallets={wallets}
          exchange={exchange}
          selectedWallet={selectedWallet}
          selectedWalletBalances={selectedWalletBalances}
          onSelect={selectEvent}
          onPress={pressEvent}
          onScrollBegin={fadeOutWallet}
        />
      </LinearLayout>

      <Animated.View style={{ opacity: fadeValue }}>
        <SelectedWalletInfo
          exchange={exchange}
          selectedWallet={selectedWallet}
          selectedWalletBalances={selectedWalletBalances}
        />
      </Animated.View>
    </ScreenLayout>
  )
}

export default ListWalletView
