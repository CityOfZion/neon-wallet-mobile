import {wallet} from '@cityofzion/neon-core'
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import {StackNavigationOptions} from '~/node_modules/@react-navigation/stack'
import {Fragment} from '~/node_modules/@types/react'
import {
  NativeSyntheticEvent,
  NativeTouchEvent,
} from '~/node_modules/@types/react-native'
import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import InputWithValidation from '~src/components/InputWithValidation'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {LoginStackParamList} from '~src/navigation/LoginStackNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {RootState} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface ImportKeyProps {
  navigation: StackNavigationProp<MoreStackParamList>
}

const validator = (text: string) =>
  wallet.isAddress(text) || wallet.isNEP2(text) || wallet.isWIF(text) || !text

const ImportKey = (props: ImportKeyProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const [inputValue, setInputValue] = useState('')
  const headerHeight = useHeaderHeight()
  const inputIsValid = validator(inputValue)

  const destination = (): NavParam<MoreStackParamList> => {
    if (wallet.isAddress(inputValue)) {
      return [Facade.route.ImportReadAccount.name, undefined]
    } else if (wallet.isNEP2(inputValue)) {
      return [Facade.route.Passphrase.name, {encryptedKey: inputValue}]
    } else if (wallet.isWIF(inputValue)) {
      return [Facade.route.CustomizeAccount.name, undefined]
    }
    return [Facade.route.Passphrase.name, undefined]
  }

  return (
    <ScreenLayout>
      <LinearLayout orientation="verti" width="100%">
        <TextView
          textAlign="center"
          fontSize={18}
          fontFamily="medium"
          color={theme.colors.text[0]}
          alignSelf="center"
          flexWrap="wrap"
          m={40}
        >
          {Facade.t('importKey.enterAnAddress')}
        </TextView>

        <InputWithValidation
          onChangeText={(text) => setInputValue(text)}
          color={theme.colors.text[0]}
          invalidColor={theme.colors.background[3]}
          value={inputValue}
          validator={validator}
          separatorColor={theme.colors.background[5]}
          invalidSeparatorColor={theme.colors.background[4]}
        />

        {inputIsValid && (
          <LinearLayout mt={80} width="90%" alignSelf="center">
            <ThemedButton
              label="Next"
              onPress={(evt) => {
                props.navigation.navigate(...destination())
              }}
            />
          </LinearLayout>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default ImportKey
