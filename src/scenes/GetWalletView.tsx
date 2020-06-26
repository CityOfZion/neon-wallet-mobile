import React, {useState} from 'react'
import {
  ImageView,
  LinearLayout,
  TextView,
  LinearGradientLayout,
} from '~src/styles/styled-components'

import {Account} from '~src/models/Account'
import AccountCardView from '~src/components/AccountCardView'
import {ScrollView} from 'react-native'
import i18n from '~src/i18n'
import {useSelector} from 'react-redux'
import {RootState} from '~src/store/reducers/root'
import {mockWalletAccounts} from '~src/mockWalletAccounts'
import {StackNavigationProp} from '@react-navigation/stack'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {ROUTES} from '~/constants'

interface GetWalletProps {
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

const GetWalletView = (props: GetWalletProps) => {
  const [accounts, setAccounts] = useState<Account[]>(mockWalletAccounts)

  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const cardHeight = 230
  const marginTopForAbsolute = 120
  const accCardSize = 200
  const accCardMb = 20
  const accCardMt = 40

  const listHeightSize =
    cardHeight + marginTopForAbsolute * (accounts.length - 1)
  const scrollViewSize = listHeightSize + accCardSize + accCardMb + accCardMt

  const _renderAccountCards = () => {
    return accounts.map((account: Account, i: number) => {
      const marginTop = i * marginTopForAbsolute

      return (
        <AccountCardView
          cardHeight={cardHeight}
          onPress={() => props.navigation.navigate(ROUTES.GET_ACCOUNT.name, {account})}
          account={account}
          position="absolute"
          marginTop={marginTop}
          lastCard={i === accounts.length - 1}
        />
      )
    })
  }

  return (
    <LinearGradientLayout
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
      paddingRight={12}
      paddingLeft={12}
      paddingTop={30}
      height="100%"
      width="100%"
    >
      <LinearLayout height="100%" position="relative">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, height: scrollViewSize}}
        >
          {_renderAccountCards()}

          <LinearLayout />

          <LinearLayout height={listHeightSize} />

          <LinearLayout
            orientation="horiz"
            alignItems="center"
            justifyContent="center"
            mb={accCardMb}
            mt={accCardMt}
            height={accCardSize}
            borderStyle="dashed"
            borderColor="text.0"
            borderRadius={17}
            borderWidth={1}
          >
            <ImageView
              source={require('~src/assets/images/add_-_material.png')}
            />
            <TextView color="white" fontSize={18} ml={2} fontFamily="medium">
              {i18n.t('screens.getWallet.addNewAccount')}
            </TextView>
          </LinearLayout>
        </ScrollView>
      </LinearLayout>
    </LinearGradientLayout>
  )
}

export default GetWalletView
