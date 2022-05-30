import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import moment from 'moment'
import React, {useEffect, useState, Fragment, useRef, useMemo} from 'react'
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import AccountCard from '~src/components/AccountCard'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBar from '~src/components/layout/HeaderBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface GetWalletProps {
  route: RouteProp<WalletStackParamList, 'GetWallet'>
  navigation: StackNavigationProp<WalletStackParamList>
}

export const AccountCardsComponent = (props: {
  accounts: Account[]
  onPress: (account: Account) => void
  disableSecondTouch?: boolean
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
        const marginTop = i !== 0 ? Normalize.scale(-130) : undefined
        return (
          <Animated.View
            key={i}
            style={[
              {
                transform: [
                  {
                    translateY: posYFactor.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-viewHeight * (1 + 0.1 * i), 0],
                    }),
                  },
                ],
              },
              {
                zIndex: i,
                marginTop,
              },
            ]}
          >
            <LinearLayout>
              <AccountCard
                account={account}
                isCompacted={true}
                isStackMode={i !== props.accounts.length - 1}
                onPress={() => props.onPress(account)}
                disableSecondTouch={props.disableSecondTouch}
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
  const fromWalletDetailsPage = false

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: i18n.t('app.edit'),
        actionButtonStyle: 'default',
        actionOnPress: () => {
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.EditWalletModal.name,
            params: {
              wallet,
              fromWalletDetailsPage,
            },
          })
        },
      }),
  })

  const dispatch = useDispatch()
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()

  const [accounts, setAccounts] = useState<Account[]>([])
  const wallet = useMemo(
    () => dispatchWallet(RootStore.wallet.actions.getFromSelection()),
    []
  )

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
    <ScreenLayout darkerSolidColorBG={true}>
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
