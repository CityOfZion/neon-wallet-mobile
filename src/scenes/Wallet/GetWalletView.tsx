import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import moment from 'moment'
import React, { useEffect, useMemo } from 'react'
import { RefreshControl, TouchableWithoutFeedback } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { RootStackParamList } from '../../navigation/AppNavigation'
import { ModalStackParamList } from '../../navigation/ModalStackNavigation'
import { TabStackParamList } from '../../navigation/TabNavigation'

import { AccountCards } from '~/src/components/AccountCards'
import { useBalances } from '~/src/hooks/useBalances'
import { useExchange } from '~/src/hooks/useExchange'
import { wrapper } from '~src/app/ApplicationWrapper'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBar from '~src/components/layout/HeaderBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation'
import { RootState, RootStore } from '~src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

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

  const accounts = useSelector((state: RootState) => state.app.accounts)
  const currency = useSelector((state: RootState) => state.settings.currency)

  const dispatch = useDispatch()

  const walletAccounts = useMemo(() => wallet.getAccounts(accounts), [accounts, wallet])

  const {
    exchange,
    isRefetching: exchangeIsRefetching,
    refetch: exchangeRefetch,
  } = useExchange({ filter: { currencies: currency } })

  const { data: balances, queryResults: balanceQueryResult } = useBalances(wallet.getAccounts(accounts))

  const handlePress = async (account: Account) => {
    dispatch(RootStore.account.actions.selectAccount(account.address))
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

  const isRefetching = () => {
    return exchangeIsRefetching || balanceQueryResult.some(balance => balance.isRefetching)
  }

  const refetch = () => {
    exchangeRefetch()
    balanceQueryResult.map(balance => balance.refetch())
  }

  useEffect(() => {
    wallet.lastVisitedAt = moment().format()
    dispatch(RootStore.app.actions.updateAndSaveWallet(wallet))
  }, [])

  return (
    <ScreenLayout
      refreshControl={<RefreshControl tintColor="#fff" refreshing={isRefetching()} onRefresh={refetch} />}
      darkerSolidColorBG
    >
      <LinearLayout mt={6}>
        <AccountCards exchange={exchange} balances={balances} accounts={walletAccounts} onPress={handlePress} />
      </LinearLayout>

      {wallet.walletType === 'standard' && (
        <TouchableWithoutFeedback onPress={handleCreate}>
          <LinearLayout
            my={6}
            orientation="horiz"
            width="100%"
            alignItems="center"
            justifyContent="center"
            borderStyle="dashed"
            borderColor="text.0"
            borderRadius={17}
            borderWidth={1}
            style={{
              aspectRatio: 38 / 25,
            }}
          >
            <ImageView source={require('~src/assets/images/icon-plus-white.png')} />

            <TextView color="white" fontSize={18} mt={2} ml={3} fontFamily="medium">
              {i18n.t('screens.getWallet.addNewAccount')}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>
      )}
    </ScreenLayout>
  )
}

export default GetWalletView
