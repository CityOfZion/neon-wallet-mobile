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

export interface PassphraseProps {
  navigation: StackNavigationProp<MoreStackParamList>
  encryptedKey: string
}

function verifyPassword(
  nep2: string,
  password: string,
  setState: (state: boolean) => void
) {
  const newAccount = new wallet.Account(nep2)
  newAccount
    .decrypt(password)
    .then((account) => {
      setState(true)
    })
    .catch((error) => {
      setState(false)
    })
}

const Passphrase = (props: PassphraseProps) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const [inputValue, setInputValue] = useState('')
  const [inputIsValid, setInputIsValid] = useState(true)

  const clearOnFocus = () => {
    if (!inputIsValid) {
      setInputIsValid(true)
      setInputValue('')
    }
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
          {Facade.t('passphrase.enterPassphrase')}
        </TextView>

        <InputWithValidation
          value={inputValue}
          onChangeText={setInputValue}
          validator={() => inputIsValid}
          color={theme.colors.primary}
          invalidColor={theme.colors.primary}
          separatorColor={theme.colors.background[4]}
          invalidSeparatorColor={theme.colors.background[5]}
          placeholder={Facade.t('passphrase.inputPlaceholder')}
          secure={true}
          onFocus={clearOnFocus}
        />

        <LinearLayout mt={80} width="90%" alignSelf="center">
          {inputValue.length > 0 && (
            <ThemedButton
              label={Facade.t('passphrase.next')}
              onPress={() => {
                verifyPassword(props.encryptedKey, inputValue, setInputIsValid)
              }}
            />
          )}
        </LinearLayout>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default Passphrase
