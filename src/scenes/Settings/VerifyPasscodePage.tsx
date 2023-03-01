import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import _ from 'lodash'
import React, { useState, useEffect, useCallback } from 'react'

import { PASSCODE_LENGTH, Passcode } from '../Settings/PasscodePage/Passcode'

import { Button } from '~/src/components/Button'
import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import ScreenLayout from '~src/components/layout/ScreenLayout'

export interface VerifyPasscodePageParams {
  onValidate: (result: boolean) => void
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'VerifyPasscode'>
}

const VerifyPasscodePage = (props: Props) => {
  const { onValidate } = props.route.params

  const [passcode, setPasscode] = useState<number[]>([])
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)

  const validate = useCallback(async () => {
    if (passcode.length !== PASSCODE_LENGTH) return

    const savedPasscode = await SecurityHelper.loadPasscode()

    if (_.isEqual(passcode, savedPasscode)) {
      props.navigation.goBack()
      onValidate(true)
      return
    }

    setPasscode([])
    setShowErrorMessage(true)
  }, [passcode])

  const handlePressLeftButton = () => {
    props.navigation.goBack()
    onValidate(false)
  }

  const handlePasscodeChange = (number: number) => {
    setPasscode(prevState => prevState.concat(number))
    setShowErrorMessage(false)
  }

  useEffect(() => {
    validate()
  }, [validate])

  return (
    <ScreenLayout useHeaderPadding={false} useFooterPadding={false} alignX="center" padding={16}>
      <Passcode
        title={i18n.t('passcode.enter')}
        passcode={passcode}
        onChange={handlePasscodeChange}
        error={showErrorMessage ? i18n.t('passcode.wrong') : undefined}
        leftButton={
          <Button
            label={i18n.t('app.back')}
            icon={require('~src/assets/images/icon_arrow_left_white.png')}
            labelStyle={{ color: 'text.0' }}
            onPress={handlePressLeftButton}
          />
        }
      />
    </ScreenLayout>
  )
}

export default VerifyPasscodePage
