import {wallet} from '@cityofzion/neon-core'
import Clipboard from '@react-native-community/clipboard'
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useState} from 'react'
import {
  Keyboard,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {useSelector} from 'react-redux'
import {fontFamily} from 'styled-system'

import {Facade} from '~src/app/Facade'
import InputWithValidation from '~src/components/InputTextWithValidation'
import ThemedButton from '~src/components/themed/ThemedButton'
import {ImportReadAccountProps} from '~src/scenes/ImportReadAccount'
import {RootState} from '~src/store/RootStore'
import {
  LinearLayout,
  TextView,
  ImageView,
  ButtonView,
} from '~src/styles/styled-components'
import {Route} from "~src/app/Route";

const DismissKeyboard: React.FC<{children: React.ReactNode}> = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export interface ImportKeyProps {
  navigation: StackNavigationProp<{
    More: undefined
    Passphrase: undefined
    ImportReadAccount: ImportReadAccountProps | undefined
    CustomizeAccount: undefined
  }>
}

function isValidInput(text: string) {
  return wallet.isAddress(text) || wallet.isNEP2(text) || wallet.isWIF(text)
}

function nextScreen(text: string): RouteName {
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
  const inputIsValid = isValidInput(inputValue)
  const inputStyle = inputIsValid ? 'normal' : 'italic'
  const inputColor = inputIsValid
    ? theme.colors.text[0]
    : theme.colors.background[3]

  const separatorColor =
    !inputIsValid && inputValue.length > 0
      ? theme.colors.background[5]
      : theme.colors.background[4]

  const screenName = nextScreen(inputValue)

  const pasteFromClipboard = () => {
    Clipboard.getString().then((text) => setInputValue(text))
  }

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
    >
      <LinearLayout orientation="verti" width="100%" mt={headerHeight}>
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
          color={inputColor}
          fontStyle={inputStyle}
          value={inputValue}
          inputIsValid={inputIsValid}
          separatorColor={separatorColor}
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
    </LinearGradient>
  )
}

export default ImportKey
