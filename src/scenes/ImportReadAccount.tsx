import {wallet} from '@cityofzion/neon-core'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState} from '~src/store/RootStore'
import {LinearLayout, TextView, ImageView} from '~src/styles/styled-components'

export interface ImportReadAccountParams {
  address?: string
}

interface ImportReadAccountProps {
  navigation: StackNavigationProp<MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'ImportReadAccount'>
}

const ImportReadAccount = (props: ImportReadAccountProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const [inputValue, setInputValue] = useState(
    props.route.params?.address ?? ''
  )
  const [errorMessage, setErrorMessage] = useState(
    Facade.t('components.inputTextWithValidation.incorrectFormat')
  )
  const [canAddAccount, setCanAddAccount] = useState(false)
  const accounts = useSelector((state: RootState) => state.app.accounts)

  useEffect(() => {
    setInputValue(props.route.params?.address ?? '')
  }, [props.route.params?.address])

  const persist = () => {
    if (!isValid()) {
      return
    }

    props.navigation.navigate(Facade.route.CustomizeAccount.name, {
      source: Facade.route.ImportReadAccount.name,
      address: inputValue,
    })
  }

  const isValid = () => {
    const conditions: boolean[] = [wallet.isAddress(inputValue)]

    return conditions.every((it) => it)
  }

  function validateInput() {
    let isInputValid = wallet.isAddress(inputValue)
    if (!isInputValid) {
      setErrorMessage(
        Facade.t('components.inputTextWithValidation.incorrectFormat')
      )
    } else if (accounts.find((account) => account.address === inputValue)) {
      // don't allow to include if the account was already added
      isInputValid = false
      setErrorMessage(Facade.t('importReadAccount.accountAlreadyExists'))
    }
    setCanAddAccount(isInputValid)
    return isInputValid
  }

  return (
    <ScreenLayout useHeaderPadding={true}>
      <LinearLayout orientation="verti" width="100%">
        <TextView
          textAlign="center"
          fontSize={18}
          fontFamily="regular"
          fontWeight={400}
          color={theme.colors.text[0]}
          alignSelf="center"
          flexWrap="wrap"
          mx={40}
          mt={4}
          mb={6}
        >
          {Facade.t('importReadAccount.headerText')}
        </TextView>

        <InputWithValidation
          onChangeText={(text) => setInputValue(text)}
          color={theme.colors.text[0]}
          invalidColor={theme.colors.background[3]}
          value={inputValue}
          validator={() => validateInput() || !inputValue}
          separatorColor={theme.colors.background[5]}
          invalidSeparatorColor={theme.colors.quinary}
          invalidMessageColor={theme.colors.quinary}
          invalidMessage={errorMessage}
        />

        {canAddAccount && (
          <LinearLayout mt={20} width="90%" alignSelf="center">
            <ThemedButton
              label={Facade.t('importReadAccount.add')}
              onPress={persist}
            />
          </LinearLayout>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default ImportReadAccount
