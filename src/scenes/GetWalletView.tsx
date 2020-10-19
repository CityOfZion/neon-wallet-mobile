import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import moment from 'moment'
import React, {useEffect, useState, Fragment, useRef} from 'react'
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import HeaderBar from '~src/components/layout/HeaderBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface GetWalletParams {}

interface GetWalletProps {
  route: RouteProp<WalletStackParamList, 'GetWallet'>
  navigation: StackNavigationProp<WalletStackParamList>
}

const AccountCardsComponent = (props: {
  accounts: Account[]
  onPress: (account: Account) => void
}) => {
  const [viewHeight, setViewHeight] = useState<number>(0)

  const posYFactor = useRef(new Animated.Value(0))

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)

    Animated.timing(posYFactor.current, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out((val) => val ** 2),
    }).start()
  }

  return (
    <Animated.View onLayout={layoutEvent} style={{opacity: posYFactor.current}}>
      {props.accounts.map((account: Account, i: number) => {
        const marginTop = i !== 0 ? Facade.scale(-130) : undefined

        return (
          <Animated.View
            key={i}
            style={{
              transform: [
                {
                  translateY: posYFactor.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-viewHeight * (1 + 0.1 * i), 0],
                  }),
                },
              ],
            }}
          >
            <LinearLayout marginTop={marginTop}>
              <AccountCard
                account={account}
                isCompacted={true}
                isStackMode={i !== props.accounts.length - 1}
                onPress={() => props.onPress(account)}
              />
            </LinearLayout>
          </Animated.View>
        )
      })}
    </Animated.View>
  )
}

const GetWalletView = (props: GetWalletProps) => {
  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const dispatch = useDispatch()
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()

  const [accounts, setAccounts] = useState<Account[]>([])
  const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  useEffect(() => {
    Facade.await.run('populate', populate, 500)
  }, [accountsPool])

  props.navigation.setOptions({
    headerTitle: () =>
      HeaderBar({
        title: wallet.name ?? '-',
      }),
  })

  const populate = async () => {
    wallet.lastVisitedAt = moment().format()

    await dispatch(RootStore.app.actions.updateAndSaveWallet(wallet))

    const accounts = wallet.getAccounts(accountsPool)
    setAccounts(accounts)
  }

  const pressEvent = async (account: Account) => {
    dispatch(RootStore.account.actions.selectAccount(account.address))
    props.navigation.navigate(Facade.route.GetAccount.name)
  }

  const createEvent = async () => {
    if (wallet.id) {
      dispatch(RootStore.account.actions.clearState())
      dispatch(RootStore.account.actions.setIdWallet(wallet.id))

      props.navigation.navigate(Facade.route.Modal.name, {
        screen: Facade.route.CreateAccountModal.name,
      })
    }
  }

  return (
    <ScreenLayout>
      <AwaitActivity name={'populate'} loadingView={<ScreenLoader />}>
        <LinearLayout mt={6}>
          <AccountCardsComponent accounts={accounts} onPress={pressEvent} />
        </LinearLayout>

        {wallet.walletType === 'watch' || wallet.walletType === 'legacy' ? (
          <Fragment />
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
                {Facade.t('screens.getWallet.addNewAccount')}
              </TextView>
            </LinearLayout>
          </TouchableWithoutFeedback>
        )}
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default GetWalletView
