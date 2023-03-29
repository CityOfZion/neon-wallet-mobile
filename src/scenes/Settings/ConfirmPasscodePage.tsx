import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'

import { Passcode, PASSCODE_LENGTH } from './PasscodePage/Passcode'

import { Button } from '~/src/components/Button'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import ScreenLayout from '~src/components/layout/ScreenLayout'

export interface ConfirmPasscodePageParams {
  onConfirm: (passcode: number[]) => void
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ConfirmPasscode'>
}

const ConfirmPasscodePage = (props: Props) => {
  const { onConfirm } = props.route.params

  const [passcode, setPasscode] = useState<number[]>([])

  const handleChangePasscode = (number: number) => {
    setPasscode(prevState => prevState.concat(number))
  }

  const handleDeletePasscode = () => {
    setPasscode([])
  }

  useEffect(() => {
    if (passcode.length < PASSCODE_LENGTH) return

    props.navigation.goBack()
    onConfirm(passcode)
  }, [passcode])

  return (
    <ScreenLayout withoutHeader contentStyle={{ paddingBottom: undefined }}>
      <Passcode
        title={i18n.t('passcode.confirm')}
        passcode={passcode}
        onChange={handleChangePasscode}
        leftButton={
          <Button
            label={i18n.t('app.back')}
            icon={require('~src/assets/images/icon_arrow_left_white.png')}
            labelStyle={{ color: 'text.0', fontSize: 'lg' }}
            onPress={props.navigation.goBack}
          />
        }
        rightButton={
          <Button label={i18n.t('app.delete')} labelStyle={{ color: 'text.0' }} onPress={handleDeletePasscode} />
        }
      />
    </ScreenLayout>
  )
}

export default ConfirmPasscodePage
