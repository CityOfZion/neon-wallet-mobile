import {useNavigation, useRoute} from '@react-navigation/native'
import {useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useState} from 'react'
import {ScrollView, TouchableHighlight, View} from 'react-native'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ColorSelector from '~src/components/ColorSelector'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputTextWithValidation'
import {Account} from '~src/models/Account'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState} from '~src/store/RootStore'
import {
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
import ScreenLayout from '~src/components/layout/ScreenLayout'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
  address: string
}

export default function CustomizeAccount(props: Props) {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const account = new Account()

  account.srcIcon = require('~src/assets/images/card-neo.png')
  account.name = 'My First Account'
  account.currency = '$'
  account.balance = 24985
  account.address = 'AN8iLVt18CKoATdexztCQj923hw5gkc41A'
  account.backgroundColor = '#0DD5B3'

  const [name, setName] = useState<string>('')

  function persistAccount() {
    // TODO: NW-197
  }

  const headerSize = useHeaderHeight()
  return (
    <ScreenLayout>
      <LinearLayout width="100%" height="100%" pl={20} pr={20}>
        <TextView
          mt={6}
          pl={40}
          pr={40}
          mb={24}
          color={theme.colors.text[0]}
          fontSize={18}
          fontFamily="medium"
          textAlign="center"
        >
          {Facade.t('screens.customizeAccount.subtitle')}
        </TextView>
        <InputLabel
          title={Facade.t('screens.customizeAccount.preview')}
          textAlignVertical={'top'}
          marginBottom={4}
        />
        <AccountCard account={account} isStackMode={true} />
        <InputLabel title="Account Name" marginTop={4} />
        <InputWithValidation
          onChangeText={setName}
          color={theme.colors.text[0]}
          fontStyle={'normal'}
          value={name}
          inputIsValid={true}
          sideMargins={0}
          separatorColor={theme.colors.background[3]}
          hidePaste={true}
          hideScan={true}
        />
        <InputLabel
          title={Facade.t('screens.customizeAccount.selectAColor')}
          textAlignVertical={'top'}
          marginBottom={4}
        />

        <ColorSelector />
      </LinearLayout>
    </ScreenLayout>
  )
}
