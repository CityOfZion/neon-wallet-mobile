import {wallet} from '@cityofzion/neon-core'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {AsteroidHelper} from '~src/helpers/AsteroidHelper'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState, RootStore} from '~src/store/RootStore'
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
  const inputIsValid = validator(inputValue)

  const onNext = async () => {
    let destination: NavParam<MoreStackParamList> | undefined = undefined

    if (wallet.isAddress(inputValue)) {
      destination = [Facade.route.ImportReadAccount.name, {address: inputValue}]
    } else if (wallet.isNEP2(inputValue)) {
      destination = [Facade.route.Passphrase.name, {encryptedKey: inputValue}]
    } else if (wallet.isWIF(inputValue)) {
      const neoAccount = AsteroidHelper.generateNeoAccountFromWif(inputValue)

      if (neoAccount) {
        destination = [
          Facade.route.CustomizeAccount.name,
          {
            source: Facade.route.ImportKey.name,
            address: neoAccount.address,
            legacy: true,
          },
        ]
      }
    }

    if (destination) {
      props.navigation.navigate(...destination)
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
            <ThemedButton label="Next" onPress={onNext} />
          </LinearLayout>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default ImportKey
