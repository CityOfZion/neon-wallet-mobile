import {wallet} from '@cityofzion/neon-core'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {Platform, NativeModules} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {Account} from '~src/models/redux/Account'
import {NeoNative} from '~src/native/NeoNative'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface PassphraseParams {
  encryptedKey: string
}

interface PassphraseProps {
  navigation: StackNavigationProp<MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'Passphrase'>
}

interface IVerifyPasswordResult {
  address: string
  wif: string
}

async function verifyPassword(
  nep2: string,
  password: string
): Promise<IVerifyPasswordResult> {
  let wif: string
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'ios') {
      try {
        NativeModules.RNNeoSdkBindings.decryptNep2(
          nep2,
          password,
          (wif: string | null) => {
            if (wif) {
              const newAccount = new wallet.Account(wif)
              if (newAccount.address)
                resolve({address: newAccount.address, wif})
              else reject(new Error('Key decryption failed'))
            } else {
              showMessage({message: 'Incorrect password', type: 'danger'})
              reject(new Error('Key decryption failed'))
            }
          }
        )
      } catch (error) {
        showMessage({message: 'Incorrect password', type: 'danger'})
        reject(new Error('Key decryption failed'))
      }
    } else {
      try {
        wif = await NeoNative.decryptNep2(password, nep2)
        const newAccount = new wallet.Account(wif)
        if (newAccount.address) resolve({address: newAccount.address, wif})
        else reject(new Error('Key decryption failed'))
      } catch (error) {
        showMessage({message: 'Incorrect password', type: 'danger'})
        reject(new Error('Key decryption failed'))
      }
    }
  })
}

const Passphrase = (props: PassphraseProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const {currency} = useSelector((state: RootState) => state.settings)
  const [inputValue, setInputValue] = useState('')
  const [inputIsValid, setInputIsValid] = useState(true)
  const encryptedKey = props.route.params.encryptedKey

  // TODO: NW-215
  const account = new Account()
  account.address = 'ThisIsAPlaceholderAddress'
  account.srcIcon = require('~src/assets/images/card-neo.png')

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
          validator={(text) => inputIsValid || !text}
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
              onPress={async () => {
                try {
                  const {address, wif} = await verifyPassword(
                    encryptedKey,
                    inputValue
                  )
                  setInputIsValid(true)
                  props.navigation.navigate(
                    Facade.route.CustomizeAccount.name,
                    {
                      source: Facade.route.ImportKey.name,
                      address,
                      legacy: true,
                      wif,
                    }
                  )
                } catch (error) {
                  setInputIsValid(false)
                }
              }}
            />
          )}
        </LinearLayout>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default Passphrase
