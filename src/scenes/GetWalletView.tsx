import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useState} from 'react'
import {ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {useRoutePath} from '~src/app/RouteUtils'
import AccountCard from '~src/components/AccountCard'
import {mockWalletAccounts} from '~src/mocks/mockWalletAccounts'
import {Account} from '~src/models/Account'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {RootState} from '~src/store/reducers/root'
import {
  ImageView,
  LinearLayout,
  TextView,
  LinearGradientLayout,
} from '~src/styles/styled-components'

interface GetWalletProps {
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

const GetWalletView = (props: GetWalletProps) => {
  const [accounts, setAccounts] = useState<Account[]>(mockWalletAccounts)
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const path = useRoutePath()

  props.navigation.setOptions({
    headerTransparent: true,
    headerTintColor: theme.colors.text[0],
  })

  const cardHeight = 230
  const marginTopForAbsolute = 120
  const addCardHeight = 200
  const addCardMb = 28
  const addCardMt = 60

  const listHeightSize =
    cardHeight + marginTopForAbsolute * (accounts.length - 1)
  const scrollViewSize = listHeightSize + addCardHeight + addCardMb + addCardMt

  const _renderAccountCards = () => {
    return accounts.map((account: Account, i: number) => {
      const marginTop = i * marginTopForAbsolute

      return (
        <LinearLayout key={i} position="absolute" marginTop={marginTop}>
          <AccountCard
            account={account}
            isCompacted={true}
            isStackMode={i !== accounts.length - 1}
            onPress={() =>
              props.navigation.navigate(path.GetAccount.name, {account})
            }
          />
        </LinearLayout>
      )
    })
  }

  return (
    <LinearGradientLayout
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
      paddingRight={12}
      paddingLeft={12}
      paddingTop={70}
      height="100%"
      width="100%"
    >
      <LinearLayout height="100%" position="relative" pt="48px">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, height: scrollViewSize}}
        >
          {_renderAccountCards()}

          <LinearLayout
            top={listHeightSize}
            orientation="horiz"
            width="100%"
            height={addCardHeight}
            alignItems="center"
            justifyContent="center"
            mb={addCardMb}
            mt={addCardMt}
            borderStyle="dashed"
            borderColor="text.0"
            borderRadius={17}
            borderWidth={1}
          >
            <ImageView
              source={require('~src/assets/images/add_-_material.png')}
            />
            <TextView
              color="white"
              fontSize="18px"
              ml="4px"
              fontFamily="medium"
            >
              {i18n.t('screens.getWallet.addNewAccount')}
            </TextView>
          </LinearLayout>
        </ScrollView>
      </LinearLayout>
    </LinearGradientLayout>
  )
}

export default GetWalletView
