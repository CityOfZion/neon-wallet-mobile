import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useRef, useState } from 'react'
import { Animated, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { EmptyList } from './EmptyList'
import { FirstWalletAlert } from './FirstWalletAlert'
import { Header } from './Header'
import { SelectedWalletInfo } from './SelectedWalletInfo'

import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { useRefetchOnFocus } from '~/src/hooks/useRefetchOnFocus'
import { RootState } from '~/src/store/RootStore'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { settingsReducerActions } from '~/src/store/settings/SettingsReducer'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { LinearLayout } from '~/src/styles/styled-components'
import { wrapper } from '~src/app/ApplicationWrapper'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import WalletPicker from '~src/components/misc/WalletPicker'
import { Wallet } from '~src/models/redux/Wallet'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'

export interface ListWalletViewParams {
  wallet?: Wallet
}

interface WalletProps {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList & TabStackParamList & ModalStackParamList>
  route: RouteProp<WalletStackParamList, 'ListWalletsPage'>
}

export const ListWalletView = (props: WalletProps) => {
  const wallets = useSelector(selectWallets)
  const accounts = useSelector(selectAccounts)
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(props.route.params?.wallet ?? wallets[0])
  const isFirstTime = useSelector((state: RootState) => state.settings.isFirstTime)
  const dispatch = useDispatch()

  const fadeValue = useRef(new Animated.Value(1)).current

  const [pressedWallet, setPressedWallet] = useState<Wallet>()

  const selectedWalletBalanceExchange = useBalancesAndExchange(selectedWallet?.getAccounts(accounts) ?? [])
  useRefetchOnFocus(selectedWalletBalanceExchange.refetch)

  const fadeIn = () => {
    Animated.sequence([
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: 400,
      }),
    ]).start()
  }

  const fadeOut = () => {
    Animated.timing(fadeValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const handlePress = async (wallet: Wallet) => {
    dispatch(settingsReducerActions.setIsFirstTime(false))
    props.navigation.navigate(wrapper.route.GetWallet.name, { wallet })
  }

  const handlePressFirstTime = () => {
    dispatch(settingsReducerActions.setIsFirstTime(false))
    setPressedWallet(wallets[0])
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      padding={0}
      darkerSolidColorBG
      refreshControl={
        <RefreshControl
          tintColor="#fff"
          refreshing={selectedWalletBalanceExchange.isLoading ?? selectedWalletBalanceExchange.isRefetchingByUser}
          onRefresh={selectedWalletBalanceExchange.refetch}
        />
      }
    >
      <Header selectedWallet={selectedWallet} />

      {wallets.length > 0 && !!selectedWallet ? (
        <>
          <LinearLayout>
            {isFirstTime && <FirstWalletAlert onPress={handlePressFirstTime} />}
            <WalletPicker
              wallets={wallets}
              selectedWalletBalanceExchange={selectedWalletBalanceExchange}
              selectedWallet={selectedWallet}
              onSelect={setSelectedWallet}
              onPress={handlePress}
              onScrollBegin={fadeOut}
              onScrollEnd={fadeIn}
              scrollEnabled={!isFirstTime}
              pressedWallet={pressedWallet}
            />
          </LinearLayout>

          <SelectedWalletInfo
            selectedWallet={selectedWallet}
            selectedWalletBalanceExchange={selectedWalletBalanceExchange}
            opacity={fadeValue}
          />
        </>
      ) : (
        <EmptyList />
      )}
    </ScreenLayout>
  )
}
