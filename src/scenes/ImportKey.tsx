import {wallet} from '@cityofzion/neon-core'
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface ImportKeyProps {
  navigation: StackNavigationProp<MoreStackParamList>
}

const validator = (text: string) => {
  return wallet.isAddress(text) || wallet.isNEP2(text) || wallet.isWIF(text)
}

function nextScreen(text: string): keyof MoreStackParamList {
  if (wallet.isAddress(text)) {
    return Facade.route.ImportReadAccount.name
  } else if (wallet.isNEP2(text)) {
    return Facade.route.Passphrase.name
  } else if (wallet.isWIF(text)) {
    return Facade.route.CustomizeAccount.name
  }
  return Facade.route.Passphrase.name
}

const ImportKey = (props: ImportKeyProps) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const [inputValue, setInputValue] = useState('')
  const headerHeight = useHeaderHeight()
  const inputIsValid = validator(inputValue)

  const screenName = nextScreen(inputValue)

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
                props.navigation.navigate(screenName)
              }}
            />
          </LinearLayout>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default ImportKey
