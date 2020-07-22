import {StackNavigationProp} from '@react-navigation/stack'
import * as LocalAuthentication from 'expo-local-authentication'
import ExpoLocalAuthentication from 'expo-local-authentication/src/ExpoLocalAuthentication'
import React, {useState} from 'react'
import {Alert, Platform, TouchableWithoutFeedback} from 'react-native'

import {LocalAuthenticationResult} from '~/node_modules/expo-local-authentication/src/LocalAuthentication.types'
import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {LoginStackParamList} from '~src/navigation/LoginStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<RootStackParamList & LoginStackParamList>
}

const MAX_ERROR_COUNTER = 3

export default function LoginPage(props: Props) {
  const [errorCounter, setErrorCounter] = useState(0)

  const continueButton = async () => {
    const canUseHardware = await LocalAuthentication.hasHardwareAsync()

    if (canUseHardware) {
      let result: LocalAuthenticationResult

      if (Platform.OS === 'ios') {
        result = await LocalAuthentication.authenticateAsync()
      } else {
        result = await ExpoLocalAuthentication.authenticateAsync()
      }

      if (!result.success) {
        // If user doesn't have the hardware configured, redirects to passcode
        if (result.error === 'not_enrolled') {
          props.navigation.navigate(Facade.route.Passcode.name)
        } else {
          setErrorCounter(errorCounter + 1)

          if (errorCounter >= MAX_ERROR_COUNTER) {
            alertDialog()
          }
        }
      } else {
        props.navigation.replace(Facade.route.Tab.name, undefined)
      }
    } else {
      props.navigation.navigate(Facade.route.Passcode.name)
    }
  }

  const alertDialog = () =>
    Alert.alert(
      Facade.t('login.dialog.title'),
      Facade.t('login.dialog.subtitle'),
      [
        {
          text: Facade.t('login.dialog.usePasscode'),
          onPress: () => props.navigation.navigate(Facade.route.Passcode.name),
        },
        {
          text: Facade.t('login.dialog.cancel'),
          style: 'cancel',
        },
        {
          text: Facade.t('login.dialog.tryAgain'),
          onPress: continueButton,
        },
      ],
      {cancelable: false}
    )

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useFooterPadding={false}
      useStatusBarPadding={true}
      alignX="center"
      padding={32}
    >
      <ImageView
        height={193}
        width={193}
        mb={12}
        source={require('~/src/assets/images/logo-small.png')}
      />
      <TextView color={'text.0'} fontSize={31} letterSpacing={3.29}>
        {Facade.t('login.brand')}
      </TextView>

      <LinearLayout weight={1} width="100%" minHeight="12px" />

      <LinearLayout width="100%" alignItems={'center'}>
        <TextView
          mb={24}
          color={'primary'}
          fontSize={30}
          letterSpacing={0.46}
          fontFamily={'semibold'}
        >
          {Facade.t('login.title')}
        </TextView>

        <TextView
          color={'text.0'}
          fontSize={'18px'}
          letterSpacing={0.2}
          textAlign={'center'}
        >
          {Facade.t('login.body')}
        </TextView>
        <LinearLayout
          weight={1}
          width="100%"
          minHeight="24px"
          maxHeight="60px"
        />

        <LinearLayout width={'100%'}>
          <ThemedButton
            textColor={'text.9'}
            bgColor={'primary'}
            basic={true}
            label={Facade.t('login.continue')}
            fontFamily={'medium'}
            onPress={continueButton}
          />
        </LinearLayout>

        <LinearLayout
          weight={1}
          width="100%"
          minHeight="24px"
          maxHeight="42px"
        />

        <TouchableWithoutFeedback
          onPress={() =>
            props.navigation.replace(Facade.route.Tab.name, undefined)
          }
        >
          <TextView
            p={16}
            color={'text.8'}
            fontSize={'18px'}
            letterSpacing={1.93}
            textAlign={'center'}
          >
            {Facade.t('login.skip')}
          </TextView>
        </TouchableWithoutFeedback>

        <LinearLayout
          weight={1}
          width="100%"
          minHeight="12px"
          maxHeight="16px"
        />

        <ImageView
          width={98}
          height={30}
          mb={12}
          source={require('~src/assets/logos/logo-coz.png')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}
