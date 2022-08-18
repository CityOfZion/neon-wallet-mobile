import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo, useRef, useState } from 'react'
import { Animated, Easing, LayoutChangeEvent, RefreshControl } from 'react-native'
import { useSelector } from 'react-redux'

import { RootStackParamList } from '../../navigation/AppNavigation'
import { ModalStackParamList } from '../../navigation/ModalStackNavigation'
import { TabStackParamList } from '../../navigation/TabNavigation'

import { AccountCards } from '~/src/components/AccountCards'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { wrapper } from '~src/app/ApplicationWrapper'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBar from '~src/components/layout/HeaderBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { ButtonWithoutFeedbackView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface GetWalletViewParams {
  wallet: Wallet
}

interface GetWalletProps {
  route: RouteProp<WalletStackParamList, 'GetWallet'>
  navigation: StackNavigationProp<WalletStackParamList & ModalStackParamList & TabStackParamList & RootStackParamList>
}

const GetWalletView = (props: GetWalletProps) => {
  const { wallet } = props.route.params

  props.navigation.setOptions({
    headerTitle: () =>
      HeaderBar({
        title: wallet.name ?? '-',
      }),
    headerRight: () =>
      HeaderActionButton({
        actionButtonStyle: 'more',
        actionOnPress: () => {
          props.navigation.navigate(wrapper.route.WalletSettingsView.name, {
            wallet,
          })
        },
      }),
  })

  const accounts = useSelector(selectAccounts)

  const walletAccounts = useMemo(() => wallet.getAccounts(accounts), [accounts, wallet])

  const balanceExchange = useBalancesAndExchange(walletAccounts)

  const [viewHeight, setViewHeight] = useState<number>(0)
  const posYFactor = useRef(new Animated.Value(0)).current
  const opacityValue = useRef(new Animated.Value(0)).current

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setViewHeight(height)

    Animated.parallel([
      Animated.timing(posYFactor, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(val => val ** 2),
      }),

      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handlePress = async (account: Account) => {
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.GetAccount.name,
        params: {
          account,
          wallet,
        },
      },
    })
  }

  const handleCreate = async () => {
    if (!wallet.id) return

    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.BlockchainListModal.name,
      params: {
        wallet,
      },
    })
  }

  return (
    <ScreenLayout
      refreshControl={
        <RefreshControl
          tintColor="#fff"
          refreshing={balanceExchange.isRefetchingByUser}
          onRefresh={balanceExchange.refetch}
        />
      }
      darkerSolidColorBG
      onLayout={handleLayout}
      padding={0}
    >
      <LinearLayout px="10px">
        <Animated.View
          style={{
            opacity: opacityValue,
            transform: [
              {
                translateY: posYFactor.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-viewHeight, 0],
                }),
              },
            ],
          }}
        >
          <Animated.View
            style={[
              {
                transform: [
                  {
                    translateY: posYFactor.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-viewHeight, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <AccountCards balanceExchange={balanceExchange} accounts={walletAccounts} onPress={handlePress} />
          </Animated.View>

          {wallet.walletType === 'standard' && (
            <ButtonWithoutFeedbackView onPress={handleCreate}>
              <LinearLayout
                my="36px"
                orientation="horiz"
                width="100%"
                alignItems="center"
                justifyContent="center"
                borderStyle="dashed"
                borderColor="text.5"
                borderRadius="18px"
                borderWidth="1px"
                height="220px"
              >
                <ImageView
                  source={require('~src/assets/images/icon-plus-white.png')}
                  resizeMode="contain"
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />

                <TextView color="text.0" fontSize="lg" ml={3} fontWeight={500}>
                  {i18n.t('screens.getWallet.addNewAccount')}
                </TextView>
              </LinearLayout>
            </ButtonWithoutFeedbackView>
          )}
        </Animated.View>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default GetWalletView
