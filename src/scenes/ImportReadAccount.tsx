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
import InputWithValidation from '~src/components/InputWithValidation'
import ThemedButton from '~src/components/themed/ThemedButton'
import {RootState} from '~src/store/RootStore'
import {
  LinearLayout,
  TextView,
  ImageView,
  ButtonView,
} from '~src/styles/styled-components'
import ScreenLayout from '~src/components/layout/ScreenLayout'

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

const validator = (text: string) => {
  return wallet.isAddress(text)
}

const ImportReadAccount = (props: ImportReadAccountProps) => {
  // TODO: Remove
  const defaultDebugAddress = 'Ad83tfsuWxxexhefPzXVpn5vv6oCbLKFEx'

  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const [inputValue, setInputValue] = useState(
    props.address ?? defaultDebugAddress
  )
  const headerHeight = useHeaderHeight()

  return (
    <ScreenLayout useHeaderPadding={false}>
      <LinearLayout orientation="verti" width="100%" mt={headerHeight}>
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
        <LinearLayout
          orientation="horiz"
          mx={20}
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
              onPress={() =>
                props.navigation.navigate(Facade.route.CustomizeAccount.name)
              }
            />
          </LinearLayout>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default ImportReadAccount
