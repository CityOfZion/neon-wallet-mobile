import {StackNavigationProp} from '@react-navigation/stack'
import {RouteProp} from '@react-navigation/native'
import React, {useState, useEffect} from 'react'
import { TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import Keypad from '~src/components/Keypad'
import PasscodeBar from '~src/components/PasscodeBar'
import {LoginStackParamList} from '~src/navigation/LoginStackNavigation'
import {
  PasscodeHeader,
  PASSCODE_LENGTH,
} from '~src/scenes/LoginPage/PasscodePage'

interface Props {
  navigation: StackNavigationProp<LoginStackParamList & RootStackParamList>
  route: RouteProp<LoginStackParamList, 'ConfirmPasscode'>
}

const ConfirmPasscodePage = (props: Props) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const [passcode, setPasscode] = useState<number[]>([])
  const originalPasscode = props.route.params.passcode

  useEffect(() => {
    if (passcode.length === PASSCODE_LENGTH) {
      if (!Facade.lodash.isEqual(passcode, originalPasscode)) {
        props.navigation.navigate(Facade.route.Passcode.name, {showError: true})
      } else {
        // TODO: Store password
        props.navigation.replace('Tab')
      }
    }
  }, [passcode])

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
        Confirm passcode
      </TextView>

      <PasscodeBar data={passcode} length={PASSCODE_LENGTH} />

      <LinearLayout height="148px" pt="24px" />

      <Keypad onClick={clickKey} disabled={passcode.length >= PASSCODE_LENGTH} />

    </ScreenLayout>
  )
}

export default ConfirmPasscodePage
