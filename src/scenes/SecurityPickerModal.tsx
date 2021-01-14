import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import * as LocalAuthentication from 'expo-local-authentication'
import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import SelectorList, {SelectorItem} from '~src/components/SelectorList'
import SwiperPanel, {
  useSwiperController,
  CloseButton,
} from '~src/components/SwiperPanel' //precisa modificar essa tela para exibir opções de segurança
import {Security} from '~src/enums/Security'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SecurityModal'>
}

const SecurityPickerModal = (props: Props) => {
  const {security} = useSelector((state: RootState) => state.settings)
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const [controlSecurity, setControlSecurity] = useState<Security>(security)

  useEffect(() => {
    saveSecurity()
  }, [controlSecurity])

  const changeSecurity = (val: Security) => {
    checkSecurity(val)
  }
  const saveSecurity = async () => {
    if (security !== controlSecurity) {
      dispatch(RootStore.settings.actions.setSecurity(controlSecurity)) //hardware is fixed
      dispatch(RootStore.settings.actions.save())
      if (props.route.params?.isFirstTime) {
        await Storage.welcomeToNWSeen.save(false)
        props.navigation.replace(Facade.route.Tab.name, {
          screen: Facade.route.ListWallets.name,
          welcomeHidden: true,
          changelogHidden: true,
        })
      }
      await Storage.welcomeHidden.save(true)
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
        props.navigation.navigate(Facade.route.PasscodeStack.name, {
          screen: Facade.route.VerifyPasscode.name,
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
      const result = await LocalAuthentication.authenticateAsync()
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
        props.navigation.replace(Facade.route.PasscodeStack.name, {
          screen: Facade.route.Passcode.name,
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
      title={Facade.t('modals.security.title')}
      fullSize={true}
      padding={16}
      paddingTop={24}
      onClose={props.navigation.goBack}
      onLeftPress={controller.close}
      rightButton={<CloseButton mr={'20px'} />}
      disableDefaultScrollView={true}
      onRightPress={controller.close}
    >
      <SelectorList items={securities} />
    </SwiperPanel>
  )
}

export default SecurityPickerModal
