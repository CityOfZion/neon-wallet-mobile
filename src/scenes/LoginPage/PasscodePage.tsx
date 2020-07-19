import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState, useEffect} from 'react'
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
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
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
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
    setShowErrorMessage(props.route.params?.showError ?? false)
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

      <LinearLayout pt="24px">
        {showErrorMessage ? (
          <TextView color="primary" fontSize={22}>
            {Facade.t('passcode.error')}
          </TextView>
        ) : undefined}
      </LinearLayout>

      <Keypad
        onClick={clickKey}
        disabled={passcode.length >= PASSCODE_LENGTH}
      />
    </ScreenLayout>
  )
}

export default PasscodePage
