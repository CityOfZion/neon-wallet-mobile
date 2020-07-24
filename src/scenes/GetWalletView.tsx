import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import moment from 'moment'
import React, {useEffect, useState} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {Account} from '~src/models/redux/Account'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface GetWalletProps {
  route: RouteProp<WalletStackParamList, 'GetWallet'>
  navigation: StackNavigationProp<WalletStackParamList>
}

const GetWalletView = (props: GetWalletProps) => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const {wallet} = props.route.params

  const dispatch = useDispatch()

  useEffect(() => {
    Facade.await.run('populate', populate)
  }, [accountsPool])

  const populate = async () => {
    setAccounts(wallet.getAccounts(accountsPool))

    wallet.lastVisitedAt = moment().format()

    await dispatch(RootStore.app.actions.updateWallet(wallet))
    await dispatch(RootStore.app.actions.saveWallets())
  }

  const selectEvent = async (account: Account) => {
    props.navigation.navigate(Facade.route.GetAccount.name, {account})
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

  const _renderAccountCards = () => {
    return accounts.map((account: Account, i: number) => {
      const marginTop = i !== 0 ? Facade.scale(-130) : undefined

      return (
        <LinearLayout key={i} marginTop={marginTop}>
          <AccountCard
            account={account}
            isCompacted={true}
            isStackMode={i !== accounts.length - 1}
            onPress={() => selectEvent(account)}
          />
        </LinearLayout>
      )
    })
  }

  return (
    <ScreenLayout>
      <AwaitActivity name={'populate'} loadingView={<ScreenLoader />}>
        <LinearLayout mt={4}>{_renderAccountCards()}</LinearLayout>

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
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default GetWalletView
