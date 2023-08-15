import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useMemo, useRef, useState } from 'react'
import { Animated, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import OTAHelper from '../../../helpers/OTAHelper'
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
  const paramsWallet = props.route.params?.wallet

  const wallets = useSelector(selectWallets)
  const accounts = useSelector(selectAccounts)
  const isFirstTime = useSelector((state: RootState) => state.settings.isFirstTime)
  const dispatch = useDispatch()

  const defaultWalletIndex = useMemo(() => {
    if (!paramsWallet || wallets.length <= 0) return 0

    const defaultWalletIndex = wallets.findIndex(wallet => wallet.id === paramsWallet.id)
    const hasDefaultWallet = defaultWalletIndex > -1

    return hasDefaultWallet ? defaultWalletIndex : 0
  }, [wallets, paramsWallet])

  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(wallets[defaultWalletIndex])

  const fadeValue = useRef(new Animated.Value(1)).current

  const [pressedWallet, setPressedWallet] = useState<Wallet>()

  const selectedWalletBalanceExchange = useBalancesAndExchange(selectedWallet?.getAccounts(accounts) ?? [])
  useRefetchOnFocus(selectedWalletBalanceExchange.refetch)

  const handleSelectWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet)
  }

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

  const handlePress = async (wallet: Wallet) => {
    dispatch(settingsReducerActions.setIsFirstTime(false))
    props.navigation.navigate(wrapper.route.GetWallet.name, { wallet })
    fadeIn()
  }

  const handlePressFirstTime = () => {
    dispatch(settingsReducerActions.setIsFirstTime(false))
    setPressedWallet(wallets[0])
  }

  const handleRefresh = async () => {
    await selectedWalletBalanceExchange.refetch()
    await OTAHelper.handleOTAUpdates()
  }

  return (
    <ScreenLayout
      testID="scene-list-wallet-view"
      withoutHeader
      contentStyle={{
        padding: 0,
      }}
      refreshControl={
        <RefreshControl
          tintColor="#fff"
          refreshing={selectedWalletBalanceExchange.isLoading ?? selectedWalletBalanceExchange.isRefetchingByUser}
          onRefresh={handleRefresh}
        />
      }
    >
      <Header selectedWallet={selectedWallet} />

      {wallets.length > 0 ? (
        <>
          <LinearLayout>
            {isFirstTime && <FirstWalletAlert onPress={handlePressFirstTime} />}
            <WalletPicker
              wallets={wallets}
              selectedWalletBalanceExchange={selectedWalletBalanceExchange}
              selectedWallet={selectedWallet}
              onSelect={handleSelectWallet}
              onPress={handlePress}
              onScrollBegin={fadeOut}
              onScrollEnd={fadeIn}
              scrollEnabled={!isFirstTime}
              pressedWallet={pressedWallet}
              defaultIndex={defaultWalletIndex}
            />
          </LinearLayout>

          {selectedWallet && (
            <SelectedWalletInfo
              selectedWallet={selectedWallet}
              selectedWalletBalanceExchange={selectedWalletBalanceExchange}
              opacity={fadeValue}
            />
          )}
        </>
      ) : (
        <EmptyList />
      )}
    </ScreenLayout>
  )
}
