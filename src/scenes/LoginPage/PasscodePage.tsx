import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState, useEffect} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import Keypad from '~src/components/Keypad'
import PasscodeBar from '~src/components/PasscodeBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {LoginStackParamList} from '~src/navigation/LoginStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<LoginStackParamList & RootStackParamList>
  route: RouteProp<LoginStackParamList, 'Passcode'>
}

export const PASSCODE_LENGTH = 5

export const PasscodeHeader = (props: {
  navigation: StackNavigationProp<any>
}) => {
  return (
    <LinearLayout mt={32} mb={68} orientation="horiz">
      <LinearLayout flex={1} />
      <ImageView source={require('~/src/assets/images/icon-lock.png')} />
      <LinearLayout flex={1} alignItems="flex-end" justifyContent="center">
        <TouchableWithoutFeedback onPress={props.navigation.goBack}>
          <TextView py="4px" fontSize={16} color="text.0">
            {Facade.t('passcode.cancel')}
          </TextView>
        </TouchableWithoutFeedback>
      </LinearLayout>
    </LinearLayout>
  )
}

const PasscodePage = (props: Props) => {
  const [passcode, setPasscode] = useState<number[]>([])
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
  console.log(props.route.params?.showError)

  useEffect(() => {
    if (passcode.length === PASSCODE_LENGTH) {
      setPasscode([])
      props.navigation.navigate(Facade.route.ConfirmPasscode.name, {
        passcode,
      })
    }
  }, [passcode])

  useEffect(() => {
    setShowErrorMessage(
      (props.route.params?.showError ?? false) && passcode.length === 0
    )
  })

  const clickKey = (number: number) => {
    setPasscode(passcode.concat(number))
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useFooterPadding={false}
      useStatusBarPadding={true}
      alignX="center"
      padding={16}
    >
      <PasscodeHeader navigation={props.navigation} />

      <TextView fontSize={22} color="text.0" mb={18}>
        {Facade.t('passcode.enter')}
      </TextView>

      <PasscodeBar data={passcode} length={PASSCODE_LENGTH} />

      <TextView
        color="primary"
        fontSize={22}
        opacity={showErrorMessage ? 1 : 0}
        my={18}
      >
        {Facade.t('passcode.error')}
      </TextView>

      <LinearLayout weight={1} width="100%" />

      <Keypad
        onClick={clickKey}
        disabled={passcode.length >= PASSCODE_LENGTH}
      />

      <LinearLayout weight={2} maxHeight="180px" width="100%" />
    </ScreenLayout>
  )
}

export default PasscodePage
