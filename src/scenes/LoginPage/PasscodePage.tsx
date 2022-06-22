import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useState, useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { wrapper } from '~/src/app/ApplicationWrapper'
import Keypad from '~src/components/Keypad'
import PasscodeBar from '~src/components/PasscodeBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { PasscodeStackParamList } from '~src/navigation/PasscodeStackNavigation'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
export interface PasscodePageParams {
  showError: boolean
  validate?: boolean
}

interface Props {
  navigation: StackNavigationProp<PasscodeStackParamList & RootStackParamList>
  route: RouteProp<PasscodeStackParamList, 'Passcode'>
}

export const PASSCODE_LENGTH = 5

export const PasscodeHeader = (props: {
  navigation: StackNavigationProp<any>
  passcode: number[]
  deletePasscode?: () => void
}) => {
  return (
    <LinearLayout mt={32} mb={68} orientation="horiz" justifyContent="center">
      <LinearLayout flex={1} alignItems="flex-start" justifyContent="center">
        <TouchableWithoutFeedback onPress={props.navigation.goBack}>
          <LinearLayout orientation="horiz" alignItems="center">
            <ImageView ml={1} mr={3} source={require('~src/assets/images/icon_arrow_left_white.png')} />

            <TextView
              fontSize={16}
              color="text.0"
              style={{
                includeFontPadding: false,
              }}
            >
              {i18n.t('app.back')}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>
      </LinearLayout>
      <ImageView source={require('~/src/assets/images/icon-lock.png')} />
      <LinearLayout flex={1} alignItems="flex-end" justifyContent="center">
        <TouchableWithoutFeedback onPress={props.passcode.length <= 0 ? props.navigation.goBack : props.deletePasscode}>
          <TextView py="4px" fontSize={16} color="text.0">
            {props.passcode.length <= 0 ? i18n.t('passcode.cancel') : 'Delete'}
          </TextView>
        </TouchableWithoutFeedback>
      </LinearLayout>
    </LinearLayout>
  )
}

const PasscodePage = (props: Props) => {
  const [passcode, setPasscode] = useState<number[]>([])
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)

  useEffect(() => {
    if (passcode.length === PASSCODE_LENGTH) {
      setPasscode([])
      props.navigation.navigate(wrapper.route.ConfirmPasscode.name, {
        passcode,
      })
    }
  }, [passcode])

  const deletePasscode = () => {
    setPasscode([])
  }

  useEffect(() => {
    setShowErrorMessage((props.route.params?.showError ?? false) && passcode.length === 0)
  })

  const clickKey = (number: number) => {
    setPasscode(passcode.concat(number))
  }
  return (
    <ScreenLayout useHeaderPadding={false} useFooterPadding={false} useStatusBarPadding alignX="center" padding={16}>
      <PasscodeHeader deletePasscode={deletePasscode} passcode={passcode} navigation={props.navigation} />

      <TextView fontSize={22} color="text.0" mb={18}>
        {i18n.t('passcode.enter')}
      </TextView>

      <PasscodeBar data={passcode} length={PASSCODE_LENGTH} />

      <TextView color="primary" fontSize={22} opacity={showErrorMessage ? 1 : 0} my={18}>
        {i18n.t('passcode.error')}
      </TextView>

      <LinearLayout weight={1} width="100%" />

      <Keypad onClick={clickKey} disabled={passcode.length >= PASSCODE_LENGTH} />

      <LinearLayout weight={2} maxHeight="180px" width="100%" />
    </ScreenLayout>
  )
}

export default PasscodePage
