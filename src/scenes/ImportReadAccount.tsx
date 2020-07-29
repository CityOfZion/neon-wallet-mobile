import {wallet} from '@cityofzion/neon-core'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
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

const validator = (text: string) => {
  return wallet.isAddress(text) || !text
}

const ImportReadAccount = (props: ImportReadAccountProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const [inputValue, setInputValue] = useState(
    props.route.params?.address ?? ''
  )
  const {currency} = useSelector((state: RootState) => state.settings)

  const persist = () => {
    if (!isValid()) return

    props.navigation.navigate(Facade.route.CustomizeAccount.name, {
      source: Facade.route.ImportReadAccount.name,
      address: inputValue,
    })
  }

  const isValid = () => {
    const conditions: boolean[] = [validator(inputValue)]

    return conditions.every((it) => it)
  }

  return (
    <ScreenLayout useHeaderPadding={true}>
      <LinearLayout orientation="verti" width="100%">
        <TextView
          textAlign="center"
          fontSize={18}
          fontFamily="medium"
          color={theme.colors.text[0]}
          alignSelf="center"
          flexWrap="wrap"
          mx={40}
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
        <LinearLayout orientation="horiz" mx={20} alignSelf="center" mt={5}>
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
        <LinearLayout orientation="horiz" mx={20} alignSelf="center" mt={5}>
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
          mx={20}
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
          color={theme.colors.text[0]}
          invalidColor={theme.colors.background[3]}
          value={inputValue}
          validator={validator}
          separatorColor={theme.colors.background[5]}
          invalidSeparatorColor={theme.colors.background[4]}
        />

        {validator(inputValue) && (
          <LinearLayout mt={20} width="90%" alignSelf="center">
            <ThemedButton
              label={Facade.t('importReadAccount.next')}
              onPress={persist}
            />
          </LinearLayout>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default ImportReadAccount
