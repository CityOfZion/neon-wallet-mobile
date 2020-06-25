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

const AccountView: React.FC<object> = () => {
  //region Test
  let listWalletResponse: Array<Account> = []

  let account1 = new Account()
  account1.address = 'oaihgofdhgo~hdõifhgõihsd'
  account1.balance = 1232
  account1.title = 'NEO'
  account1.icon = '~src/assets/images/ovalBlue.png'
  account1.backgroundColor = '#e57670'

  let account2 = new Account()
  account2.address = 'oaihgofdhgo~hdõifhgõihsd'
  account2.balance = 125532
  account2.title = 'MYC'
  account2.icon = '~src/assets/images/ovalGreen.png'
  account2.backgroundColor = '#2db744'

  let account3 = new Account()
  account3.address = 'oaihgof55654654dhgo~hdõifhgõihsd'
  account3.balance = 122
  account3.title = 'POI'
  account3.icon = '~src/assets/images/ovalPurple.png'
  account3.backgroundColor = '#dd278b'

  listWalletResponse.push(account1)
  listWalletResponse.push(account2)
  listWalletResponse.push(account3)

  const [setWalletList] = useState(listWalletResponse)

  //endregion
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const cardSize = 230
  const marginTopForAbsolute = 120
  const addCardSize = 200
  const addCardMb = 20
  const addCardMt = 40

  const listHeightSize =
    cardSize + marginTopForAbsolute * (listWalletResponse.length - 1)
  const scrollViewSize = listHeightSize + addCardSize + addCardMb + addCardMt

  let items = listWalletResponse.map(function (
    account: Account,
    index: number
  ) {
    return (
      <AccountCardView
        key={index}
        account={account}
        index={index}
        marginTopForAbsolute={marginTopForAbsolute}
        cardSize={cardSize}
        lastCard={index == listWalletResponse.length - 1}
      />
    )
  })

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
          {items}

          <LinearLayout />

          <LinearLayout height={listHeightSize} />

          <LinearLayout
            alignItems="center"
            justifyContent="center"
            mb={addCardMb}
            mt={addCardMt}
            orientation="horiz"
            height={addCardSize}
            borderStyle="dashed"
            borderColor="#ffffff"
            borderRadius={17}
            borderWidth={1}
          >
            <ImageView
              source={require('~src/assets/images/add_-_material.png')}
            />
            <TextView color="white" fontSize={18} ml={2} fontFamily="medium">
              {i18n.t('account.AddNewAccount')}
            </TextView>
          </LinearLayout>
        </ScrollView>
      </LinearLayout>
    </LinearGradientLayout>
  )
}

export default AccountView
