import {wallet} from '@cityofzion/neon-core'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface ImportKeyProps {
  navigation: StackNavigationProp<MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'ImportKey'>
}

const validator = (text: string) =>
  wallet.isAddress(text) || wallet.isNEP2(text) || wallet.isWIF(text) || !text

const ImportKey = (props: ImportKeyProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const accounts = useSelector((state: RootState) => state.app.accounts)
  const {isConnected} = useSelector((state: RootState) => state.network)
  const [inputValue, setInputValue] = useState(
    props.route.params ? props.route.params.key ?? '' : ''
  )
  const inputIsValid = validator(inputValue)

  const onNext = async () => {
    let destination: NavParam<MoreStackParamList> | undefined = undefined

    if (wallet.isAddress(inputValue)) {
      Alert.alert(
        '',
        Facade.t('importKey.alertText'),
        [
          {
            text: Facade.t('importKey.alertCancelButton'),
            style: 'cancel',
          },
          {
            text: Facade.t('importKey.alertConfirmButton'),
            onPress: () =>
              props.navigation.navigate(Facade.route.ImportReadAccount.name, {
                address: inputValue,
              }),
          },
        ],
        {cancelable: true}
      )
    } else if (wallet.isNEP2(inputValue)) {
      destination = [Facade.route.Passphrase.name, {encryptedKey: inputValue}]
    } else if (wallet.isWIF(inputValue)) {
      const neoAccount = Facade.asteroid.generateNeoAccountFromWif(inputValue)

      if (accounts.find((account) => account.address === neoAccount.address)) {
        Alert.alert(
          '',
          Facade.t('importKey.accountAlreadyExists'),
          [
            {
              text: Facade.t('importKey.ok'),
              style: 'cancel',
            },
          ],
          {cancelable: true}
        )
      } else if (neoAccount) {
        destination = [
          Facade.route.CustomizeAccount.name,
          {
            source: Facade.route.ImportKey.name,
            address: neoAccount.address,
            legacy: true,
            wif: neoAccount.WIF,
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
      <LinearLayout orientation="verti" width="100%" height="100%">
        <TextView
          textAlign="center"
          fontSize={18}
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
          invalidMessageColor={theme.colors.quinary}
        />

        {inputIsValid && (
          <LinearLayout
            mt={20}
            width="90%"
            flex={1}
            alignSelf="center"
            justifyContent={'flex-end'}
            mb={!isConnected ? '14%' : '10px'}
          >
            <ThemedButton label="Next" onPress={onNext} />
          </LinearLayout>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default ImportKey
