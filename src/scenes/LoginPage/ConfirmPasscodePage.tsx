import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {Security} from '~/src/enums/Security'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import Keypad from '~src/components/Keypad'
import PasscodeBar from '~src/components/PasscodeBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {PasscodeStackParamList} from '~src/navigation/PasscodeStackNavigation'
import {
  PasscodeHeader,
  PASSCODE_LENGTH,
} from '~src/scenes/LoginPage/PasscodePage'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface ConfirmPasscodePageParams {
  passcode: number[]
}

interface Props {
  navigation: StackNavigationProp<PasscodeStackParamList & RootStackParamList>
  route: RouteProp<PasscodeStackParamList, 'ConfirmPasscode'>
}

const ConfirmPasscodePage = (props: Props) => {
  const dispatch = useDispatch()
  const [passcode, setPasscode] = useState<number[]>([])
  const originalPasscode = props.route.params.passcode

  useEffect(() => {
    if (passcode.length === PASSCODE_LENGTH) {
      if (!Facade.lodash.isEqual(passcode, originalPasscode)) {
        props.navigation.navigate(Facade.route.Passcode.name, {showError: true})
      } else {
        persist()
      }
    }
  }, [passcode])

  const clickKey = (number: number) => {
    setPasscode(passcode.concat(number))
  }

  const deletePasscode = () => {
    setPasscode([])
  }

  const persist = async () => {
    await Facade.security.savePasscode(originalPasscode)
    dispatch(RootStore.settings.actions.setSecurity(Security.password))
    dispatch(RootStore.settings.actions.save())
    await Storage.hasAuthentication.save(true)
    await Storage.hasAuthenticationForHardware.save(false)
    props.navigation.replace(Facade.route.Tab.name, {
      screen: Facade.route.ListWallets.name,
      welcomeHidden: true,
      changelogHidden: true,
    })
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useFooterPadding={false}
      useStatusBarPadding={true}
      alignX="center"
      padding={16}
    >
      <PasscodeHeader
        deletePasscode={deletePasscode}
        passcode={props.route.params.passcode}
        navigation={props.navigation}
      />

      <TextView fontSize={22} color="text.0" mb={18}>
        {Facade.t('passcode.confirm')}
      </TextView>

      <PasscodeBar data={passcode} length={PASSCODE_LENGTH} />

      {/*Opacity is always zero, just to reserve the space so the keypad doesn't bounce*/}
      <TextView color="primary" fontSize={22} opacity={0} my={18}>
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

export default ConfirmPasscodePage
