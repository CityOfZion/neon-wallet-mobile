import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import * as LocalAuthentication from 'expo-local-authentication'
import i18n from 'i18n-js'
import React, {useState, useEffect} from 'react'
import {Platform} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Storage} from '~src/app/Storage'
import SelectorList, {SelectorItem} from '~src/components/SelectorList'
import SwiperPanel, {
  useSwiperController,
  CloseButton,
} from '~src/components/SwiperPanel' //precisa modificar essa tela para exibir opções de segurança
import {Security} from '~src/enums/Security'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'

export interface SecurityPickerModalParams {}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SecurityModal'>
}

const SecurityPickerModal = (props: Props) => {
  const {security, isFirstTime} = useSelector(
    (state: RootState) => state.settings
  )
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const [controlSecurity, setControlSecurity] = useState<Security>(security)

  useEffect(() => {
    saveSecurity()
  }, [controlSecurity])

  const changeSecurity = (val: Security) => {
    checkSecurity(val)
  }

  const handleOnClose = () => {
    if (isFirstTime) {
      props.navigation.replace(wrapper.route.Tab.name, {
        screen: wrapper.route.ListWallets.name,
      })

      return
    }

    props.navigation.goBack()
  }

  const saveSecurity = async () => {
    if (security !== controlSecurity) {
      dispatch(RootStore.settings.actions.setSecurity(controlSecurity)) //hardware is fixed
      dispatch(RootStore.settings.actions.save())

      controller.close()
    }
  }
  const checkSecurity = async (newSecurity: Security) => {
    if (security === Security.disabled) {
      return setNewSecurity(newSecurity)
    } else {
      return (await validateSecurity(newSecurity))
        ? setNewSecurity(newSecurity)
        : false
    }
  }

  const validateSecurity = async (sec: Security) => {
    if (security === sec) {
      return false
    }
    switch (security) {
      case Security.hardware: {
        const result = await hardwareAuth()
        if (result?.success) {
          setNewSecurity(sec)
          break
        } else {
          setNewSecurity(security)
          break
        }
      }
      case Security.password: {
        props.navigation.navigate(wrapper.route.PasscodeStack.name, {
          screen: wrapper.route.VerifyPasscode.name,
          params: {
            onValidate: (validate) => {
              if (validate) {
                setNewSecurity(sec)
              } else {
                setNewSecurity(security)
              }
            },
          },
        })
        break
      }
      default: {
        return false
      }
    }
  }

  const hardwareAuth = async () => {
    const canUseHardware = await LocalAuthentication.hasHardwareAsync()
    if (canUseHardware) {
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
      return result
    }
  }

  const setNewSecurity = async (sec: Security) => {
    switch (sec) {
      case Security.hardware: {
        const result = await hardwareAuth()
        if (result?.success) {
          setControlSecurity(sec)
          Storage.hasAuthenticationForHardware.save(true)
          Storage.hasAuthentication.save(false)
          break
        } else {
          setControlSecurity(security)
          break
        }
      }

      case Security.password:
        props.navigation.replace(wrapper.route.PasscodeStack.name, {
          screen: wrapper.route.Passcode.name,
        })
        break
      case Security.disabled:
        setControlSecurity(sec)
        Storage.hasAuthenticationForHardware.save(false)
        Storage.hasAuthentication.save(false)
        break
      default:
        break
    }
  }

  const isSelected = (c: Security) => c === security

  const securities: SelectorItem<Security>[] = [
    {
      data: Security.hardware,
      onClick: changeSecurity,
      isSelected,
    },
    {
      data: Security.password,
      onClick: changeSecurity,
      isSelected,
    },
    {
      data: Security.disabled,
      onClick: changeSecurity,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.security.title')}
      fullSize={true}
      padding={16}
      paddingTop={24}
      onClose={handleOnClose}
      onLeftPress={controller.close}
      rightButton={<CloseButton mr={'20px'} />}
      disableDefaultScrollView={true}
      onRightPress={controller.close}
      solidColorBG={true}
    >
      <SelectorList items={securities} />
    </SwiperPanel>
  )
}

export default SecurityPickerModal
