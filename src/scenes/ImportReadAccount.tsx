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
import {RootState} from '~src/store/RootStore'
import {
  LinearLayout,
  TextView,
  ImageView,
  ButtonView,
} from '~src/styles/styled-components'

export interface ImportReadAccountProps {
  navigation: StackNavigationProp<{
    More: undefined
    Passphrase: undefined
    CustomizeReadAccount: undefined
    CustomizeAccount: undefined
  }>
  allowChanges: boolean
  address: string
}

function isValidInput(text: string) {
  return wallet.isAddress(text)
}

const ImportReadAccount = (props: ImportReadAccountProps) => {
  const initialInputValue = props.address
    ? props.address
    : 'Ad83tfsuWxxexhefPzXVpn5vv6oCbLKFEx'
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const allowChanges = true
  const [inputValue, setInputValue] = useState(initialInputValue)
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
          ml={40}
          mr={40}
          mt={4}
          mb={6}
        >
          {Facade.t('importReadAccount.headerText')}
        </TextView>
        <LinearLayout orientation="horiz" ml={20} mr={20} alignSelf="center">
          <ImageView
            source={require('~/src/assets/images/icon-disabled-green.png')}
            resizeMode="center"
            mr={2}
          />
          <TextView
            textAlign="center"
            fontSize={16}
            color={theme.colors.text[0]}
            style={{includeFontPadding: false}}
          >
            {Facade.t('importReadAccount.disabledFeature')}
          </TextView>
        </LinearLayout>
        <LinearLayout
          orientation="horiz"
          ml={20}
          mr={20}
          alignSelf="center"
          mt={5}
        >
          <ImageView
            source={require('~/src/assets/images/icon-disabled-green.png')}
            resizeMode="center"
            mr={2}
          />
          <TextView
            textAlign="center"
            fontSize={16}
            color={theme.colors.text[0]}
            style={{includeFontPadding: false}}
          >
            {Facade.t('importReadAccount.disabledFeature')}
          </TextView>
        </LinearLayout>
        <LinearLayout
          orientation="horiz"
          ml={20}
          mr={20}
          alignSelf="center"
          mt={5}
        >
          <ImageView
            source={require('~/src/assets/images/icon-disabled-green.png')}
            resizeMode="center"
            mr={2}
          />
          <TextView
            textAlign="center"
            fontSize={16}
            color={theme.colors.text[0]}
            style={{includeFontPadding: false}}
          >
            {Facade.t('importReadAccount.disabledFeature')}
          </TextView>
        </LinearLayout>
        <LinearLayout
          orientation="horiz"
          ml={20}
          mr={20}
          alignSelf="center"
          mt={5}
          mb={30}
        >
          <ImageView
            source={require('~/src/assets/images/icon-disabled-green.png')}
            resizeMode="center"
            mr={2}
          />
          <TextView
            textAlign="center"
            fontSize={16}
            color={theme.colors.text[0]}
            style={{includeFontPadding: false}}
          >
            {Facade.t('importReadAccount.disabledFeature')}
          </TextView>
        </LinearLayout>

        <InputWithValidation
          onChangeText={(text) => setInputValue(text)}
          color={inputColor}
          fontStyle={inputStyle}
          value={inputValue}
          inputIsValid={inputIsValid}
          separatorColor={separatorColor}
        />

        {inputIsValid && (
          <LinearLayout mt={20} width="90%" alignSelf="center">
            <ThemedButton
              label="Next"
              onPress={(evt) => props.navigation.navigate('CustomizeAccount')}
            />
          </LinearLayout>
        )}
      </LinearLayout>
    </LinearGradient>
  )
}

export default ImportReadAccount
