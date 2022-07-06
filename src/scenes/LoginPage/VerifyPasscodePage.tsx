import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import Keypad from '~src/components/Keypad'
import PasscodeBar from '~src/components/PasscodeBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { PasscodeStackParamList } from '~src/navigation/PasscodeStackNavigation'
import { PASSCODE_LENGTH } from '~src/scenes/LoginPage/PasscodePage'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface VerifyPasscodePageParams {
  onValidate: (result: boolean) => void
}

interface Props {
  navigation: StackNavigationProp<PasscodeStackParamList>
  route: RouteProp<PasscodeStackParamList, 'VerifyPasscode'>
}

export const PasscodeHeader = (props: {
  navigation: StackNavigationProp<PasscodeStackParamList>
  route: RouteProp<PasscodeStackParamList, 'VerifyPasscode'>
}) => {
  return (
    <LinearLayout mt={32} mb={68} orientation="horiz">
      <LinearLayout flex={1} />
      <ImageView source={require('~/src/assets/images/icon-lock.png')} />
      <LinearLayout flex={1} alignItems="flex-end" justifyContent="center">
        <TouchableWithoutFeedback
          onPress={() => {
            props.route.params.onValidate(false)
            props.navigation.goBack()
          }}
        >
          <TextView py="4px" fontSize={16} color="text.0">
            {i18n.t('passcode.cancel')}
          </TextView>
        </TouchableWithoutFeedback>
      </LinearLayout>
    </LinearLayout>
  )
}

const VerifyPasscodePage = (props: Props) => {
  const [passcode, setPasscode] = useState<number[]>([])
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)

  useEffect(() => {
    if (passcode.length) {
      setShowErrorMessage(false)
    }
    if (passcode.length === PASSCODE_LENGTH) {
      validate()
    }
  }, [passcode])

  const validate = async () => {
    const savedPasscode = await SecurityHelper.loadPasscode()

    if (_.isEqual(passcode, savedPasscode)) {
      props.navigation.goBack()
      props.route.params.onValidate(true)
    } else {
      setPasscode([])
      setShowErrorMessage(true)
    }
  }

  const clickKey = (number: number) => {
    setPasscode(passcode.concat(number))
  }

  return (
    <ScreenLayout useHeaderPadding={false} useFooterPadding={false} useStatusBarPadding alignX="center" padding={16}>
      <PasscodeHeader navigation={props.navigation} route={props.route} />

      <TextView fontSize={22} color="text.0" mb={18}>
        {i18n.t('passcode.enter')}
      </TextView>

      <PasscodeBar data={passcode} length={PASSCODE_LENGTH} />

      <TextView color="primary" fontSize={22} opacity={showErrorMessage ? 1 : 0} my={18}>
        {i18n.t('passcode.wrong')}
      </TextView>

      <LinearLayout weight={1} width="100%" />

      <Keypad onClick={clickKey} disabled={passcode.length >= PASSCODE_LENGTH} />

      <LinearLayout weight={2} maxHeight="180px" width="100%" />
    </ScreenLayout>
  )
}

export default VerifyPasscodePage
