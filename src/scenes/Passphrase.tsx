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

import {Facade} from '~src/app/Facade'
import ThemedButton from '~src/components/themed/ThemedButton'
import {Wallet} from '~src/models/Wallet'
import {RootState} from '~src/store/RootStore'
import {
  LinearLayout,
  TextView,
  ImageView,
  ButtonView,
  InputTextView,
} from '~src/styles/styled-components'

const DismissKeyboard: React.FC<{children: React.ReactNode}> = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export interface PassphraseProps {
  navigation: StackNavigationProp<{
    CustomizeAccount: undefined
  }>
}

function verifyPassword(
  nep2: string,
  password: string,
  setState: (state: boolean) => void
) {
  const newAccount = new wallet.Account(nep2) as wallet.Account
  newAccount
    .decrypt(password)
    .then((account) => {
      setState(true)
    })
    .catch((error) => {
      setState(false)
    })
}

function shouldClearTextInput(
  isValid: boolean,
  setIsValid: (isValid: boolean) => void,
  setTextfieldValue: (value: string) => void
) {
  if (!isValid) {
    setTextfieldValue('')
    setIsValid(true)
  }
  return true
}

const Passphrase = (props: PassphraseProps) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const encryptedKey =
    '6PYLmjBYJ4wQTCEfqvnznGJwZeW9pfUcV5m5oreHxqryUgqKpTRAFt9L8Y'
  const [inputValue, setInputValue] = useState('')
  const [inputIsValid, setInputIsValid] = useState(true)
  const headerHeight = useHeaderHeight()
  const separatorColor = inputIsValid
    ? theme.colors.background[4]
    : theme.colors.background[5]

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
          {Facade.t('passphrase.enterPassphrase')}
        </TextView>

        <LinearLayout orientation="verti" ml={20} mr={20}>
          <LinearLayout orientation="horiz">
            <InputTextView
              onChangeText={(text: string) => setInputValue(text)}
              color={theme.colors.primary}
              placeholderTextColor={theme.colors.background[3]}
              underlineColorAndroid="transparent"
              placeholder={Facade.t('passphrase.inputPlaceholder')}
              fontFamily="regular"
              fontStyle="italic"
              fontSize={18}
              autoCompleteType="password"
              value={inputValue}
              secureTextEntry={true}
              weight={1}
              onFocus={() => {
                shouldClearTextInput(
                  inputIsValid,
                  setInputIsValid,
                  setInputValue
                )
              }}
            />
            {inputValue.length > 0 && !inputIsValid && (
              <ImageView
                resizeMode={'center'}
                alignSelf="center"
                source={require('~/src/assets/images/icon-alert-purple.png')}
              />
            )}
          </LinearLayout>
          <LinearLayout mt={3} bg={separatorColor} height={1} width="100%" />
          {inputValue.length > 0 && !inputIsValid && (
            <TextView
              fontStyle="italic"
              color={theme.colors.background[5]}
              fontSize={12}
              fontFamily="regular"
              textAlign="right"
              mt={2}
            >
              {Facade.t('passphrase.incorrectPassphrase')}
            </TextView>
          )}
          <LinearLayout orientation="horiz" mt={5}>
            <LinearLayout weight={1} />
            <ButtonView onPress={() => {}}>
              <LinearLayout orientation="horiz">
                <ImageView
                  resizeMode="center"
                  source={require('~/src/assets/images/icon-paste-green.png')}
                />

                <TextView
                  style={{includeFontPadding: false}}
                  ml={3}
                  color={theme.colors.primary}
                  fontFamily="semibold"
                  fontSize={16}
                >
                  {Facade.t('importKey.paste')}
                </TextView>
              </LinearLayout>
            </ButtonView>
          </LinearLayout>
        </LinearLayout>

        <LinearLayout mt={80} width="90%" alignSelf="center">
          {inputValue.length > 0 && (
            <ThemedButton
              label={Facade.t('passphrase.next')}
              onPress={() => {
                console.log('Click')
                verifyPassword(encryptedKey, inputValue, setInputIsValid)
              }}
            />
          )}
        </LinearLayout>
      </LinearLayout>
    </LinearGradient>
  )
}

export default Passphrase
