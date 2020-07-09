import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {mockWalletAccounts} from '~src/mocks/mockWalletAccounts'
import {Account} from '~src/models/Account'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {RootState} from '~src/store/reducers/root'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface GetWalletProps {
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

const GetWalletView = (props: GetWalletProps) => {
  const [accounts, setAccounts] = useState<Account[]>(mockWalletAccounts)
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  props.navigation.setOptions({
    headerTransparent: true,
    headerTintColor: theme.colors.text[0],
  })

  const _renderAccountCards = () => {
    return accounts.map((account: Account, i: number) => {
      const marginTop = i !== 0 ? Facade.space(-130) : undefined

      return (
        <LinearLayout key={i} marginTop={marginTop}>
          <AccountCard
            account={account}
            isCompacted={true}
            isStackMode={i !== accounts.length - 1}
            onPress={() =>
              props.navigation.navigate(Facade.path.GetAccount.name, {account})
            }
          />
        </LinearLayout>
      )
    })
  }

  return (
    <ScreenLayout padding={15}>
      {_renderAccountCards()}

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
          {Facade.t('screens.getWallet.addNewAccount')}
        </TextView>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default GetWalletView
