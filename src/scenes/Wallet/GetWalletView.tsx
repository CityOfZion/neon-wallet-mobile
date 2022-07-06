import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import moment from 'moment'
import React, { useEffect, useState, useMemo } from 'react'
import { RefreshControl, TouchableWithoutFeedback } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { RootStackParamList } from '../../navigation/AppNavigation'
import { ModalStackParamList } from '../../navigation/ModalStackNavigation'
import { TabStackParamList } from '../../navigation/TabNavigation'

import { AccountCards } from '~/src/components/AccountCards'
import { useExchange } from '~/src/hooks/useExchange';
import { AsyncDispatch, SyncDispatch } from '~/src/types/reducers/root';
import { wrapper } from '~src/app/ApplicationWrapper';
import HeaderActionButton from '~src/components/layout/HeaderActionButton';
import HeaderBar from '~src/components/layout/HeaderBar';
import ScreenLayout from '~src/components/layout/ScreenLayout';
import ScreenLoader from '~src/components/loader/ScreenLoader';
import { Account } from '~src/models/redux/Account';
import { Wallet } from '~src/models/redux/Wallet';
import { WalletStackParamList } from '~src/navigation/WalletsStackNavigation';
import { RootState, RootStore } from '~src/store/RootStore';
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components';

interface GetWalletProps {
  route: RouteProp<WalletStackParamList, 'GetWallet'>
  navigation: StackNavigationProp<WalletStackParamList & ModalStackParamList & TabStackParamList & RootStackParamList>
}

const GetWalletView = (props: GetWalletProps) => {
  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const dispatch = useDispatch()
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()
  const dispatchAsync = useDispatch<AsyncDispatch>()

  const [accounts, setAccounts] = useState<Account[]>([])

  const currency = useSelector((state: RootState) => state.settings.currency)
  const { exchange, isRefetching, refetch } = useExchange({ filter: { currencies: currency } })

  const wallet = useMemo(() => dispatchWallet(RootStore.wallet.actions.getFromSelection()), [])

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

  const populate = async () => {
    wallet.lastVisitedAt = moment().format()

    await dispatchAsync(RootStore.app.actions.updateAndSaveWallet(wallet))
    const accounts = wallet.getAccounts(accountsPool)
    setAccounts(accounts)
  }

  const pressEvent = async (account: Account) => {
    dispatch(RootStore.account.actions.selectAccount(account.address))
    dispatch(RootStore.account.actions.setBlockchain(account.blockchain))
    props.navigation.navigate(wrapper.route.GetAccount.name)
  }

  const createEvent = async () => {
    if (wallet.id) {
      dispatch(RootStore.account.actions.setIdWallet(wallet.id))

      props.navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.BlockchainListModal.name,
        params: {
          walletOrAccount: 'account',
        },
      })
    }
  }

  useEffect(() => {
    Await.run('populate', populate, 500)
  }, [accountsPool])

  return (
    <ScreenLayout
      refreshControl={<RefreshControl tintColor="#fff" refreshing={isRefetching} onRefresh={refetch} />}
      darkerSolidColorBG
    >
      <AwaitActivity name="populate" loadingView={<ScreenLoader />}>
        <LinearLayout mt={6}>
          <AccountCards exchange={exchange} accounts={accounts} onPress={pressEvent} />
        </LinearLayout>

        {wallet.walletType === 'watch' || wallet.walletType === 'legacy' ? (
          <></>
        ) : (
          <TouchableWithoutFeedback onPress={() => createEvent()}>
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
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default GetWalletView
