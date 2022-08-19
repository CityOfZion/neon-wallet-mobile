import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

import { Passcode, PASSCODE_LENGTH } from './Passcode'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Button } from '~/src/components/Button'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import ScreenLayout from '~src/components/layout/ScreenLayout'

export interface PasscodePageParams {
  onAuthenticate?: (passcode: number[]) => void
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'Passcode'>
}

const PasscodePage = (props: Props) => {
  const { onAuthenticate } = props.route.params

  const [passcode, setPasscode] = useState<number[]>([])
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)

  const handleRightPress = () => {
    if (passcode.length) {
      setPasscode([])
      return
    }

    props.navigation.goBack()
  }

  const handleConfirm = async (passcodeConfirmation: number[]) => {
    if (!_.isEqual(passcode, passcodeConfirmation)) {
      setShowErrorMessage(true)
      return
    }

    props.navigation.goBack()

    if (onAuthenticate) onAuthenticate(passcode)
  }

  const handleChangePasscode = (number: number) => {
    setPasscode(passcode.concat(number))
  }

  useEffect(() => {
    if (passcode.length !== PASSCODE_LENGTH) return

    setPasscode([])
    props.navigation.navigate(wrapper.route.ConfirmPasscode.name, {
      onConfirm: handleConfirm,
    })
  }, [passcode])

  return (
    <ScreenLayout useHeaderPadding={false} useFooterPadding={false} useStatusBarPadding padding={16}>
      <Passcode
        title={i18n.t('passcode.enter')}
        passcode={passcode}
        onChange={handleChangePasscode}
        error={showErrorMessage ? i18n.t('passcode.error') : undefined}
        leftButton={
          <Button
            label={i18n.t('app.back')}
            icon={require('~src/assets/images/icon_arrow_left_white.png')}
            labelStyle={{ color: 'text.0', fontSize: 'xl' }}
            onPress={props.navigation.goBack}
          />
        }
        rightButton={
          <Button
            label={passcode.length ? i18n.t('app.delete') : i18n.t('app.cancel')}
            labelStyle={{ color: 'text.0' }}
            onPress={handleRightPress}
          />
        }
      />
    </ScreenLayout>
  )
}

export default PasscodePage
