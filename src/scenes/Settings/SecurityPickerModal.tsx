import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import * as LocalAuthentication from 'expo-local-authentication'
import i18n from 'i18n-js'
import React from 'react'
import { Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { SecurityHelper } from '~/src/helpers/SecurityHelper'
import { settingsReducerActions } from '~/src/store/settings/SettingsReducer'
import SelectorList, { SelectorItem } from '~src/components/SelectorList'
import SwiperPanel, { useSwiperController, CloseButton } from '~src/components/SwiperPanel' //precisa modificar essa tela para exibir opções de segurança
import { Security } from '~src/enums/Security'
import { useLocalAuthentication } from '~src/hooks/useLocalAuthentication'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootState } from '~src/store/RootStore'

export interface SecurityPickerModalParams {}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SecurityPickerModal'>
}

type HandleBySecurity = Record<Security, () => Promise<void> | void>

const SecurityPickerModal = (props: Props) => {
  const security = useSelector((state: RootState) => state.settings.security)
  const { authenticate } = useLocalAuthentication()
  const dispatch = useDispatch()
  const controller = useSwiperController(true)

  const handleDisableSecurity = () => {
    dispatch(settingsReducerActions.setSecurity(Security.disabled))
  }

  const handlePasswordSecurity = () => {
    const handleAuthenticatePasswordSecurity = async (passcode: number[]) => {
      await SecurityHelper.savePasscode(passcode)

      dispatch(settingsReducerActions.setSecurity(Security.password))
    }

    props.navigation.navigate(wrapper.route.Passcode.name, { onAuthenticate: handleAuthenticatePasswordSecurity })
  }

  const handleHardwareSecurity = async () => {
    const canUseHardware = await LocalAuthentication.hasHardwareAsync()

    if (!canUseHardware) return

    const result = await LocalAuthentication.authenticateAsync(
      Platform.OS === 'android'
        ? {
            disableDeviceFallback: true, // Responsable for terminate the process after several failed attempts
            // Those properties need to be set, otherwise it shows an error
            cancelLabel: 'cancel',
            promptMessage: 'Authentication',
          }
        : undefined
    )

    if (!result.success) return

    dispatch(settingsReducerActions.setSecurity(Security.hardware))
  }

  const handleBySecurity: HandleBySecurity = {
    [Security.disabled]: handleDisableSecurity,
    [Security.password]: handlePasswordSecurity,
    [Security.hardware]: handleHardwareSecurity,
  }

  const handleChangeSecurity = async (newSecurity: Security) => {
    await authenticate()

    if (security === newSecurity) return

    const handler = handleBySecurity[newSecurity]

    await handler()

    controller.close()
  }

  const isSelected = (c: Security) => c === security

  const securities: SelectorItem<Security>[] = [
    {
      data: Security.hardware,
      onClick: handleChangeSecurity,
      isSelected,
    },
    {
      data: Security.password,
      onClick: handleChangeSecurity,
      isSelected,
    },
    {
      data: Security.disabled,
      onClick: handleChangeSecurity,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.security.title')}
      fullSize
      padding={16}
      paddingTop={24}
      onClose={props.navigation.goBack}
      onLeftPress={controller.close}
      rightButton={<CloseButton mr="20px" />}
      disableDefaultScrollView
      onRightPress={controller.close}
      solidColorBG
    >
      <SelectorList items={securities} />
    </SwiperPanel>
  )
}

export default SecurityPickerModal
