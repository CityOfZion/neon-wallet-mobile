import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Facade } from '~src/app/Facade'
import SelectorList, { SelectorItem } from '~src/components/SelectorList'
import SwiperPanel, {
  useSwiperController,
  CloseButton,
} from '~src/components/SwiperPanel' //precisa modificar essa tela para exibir opções de segurança
import { Security } from '~src/enums/Security'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootStore } from '~src/store/RootStore'

import * as LocalAuthentication from 'expo-local-authentication'
import { Storage } from '~src/app/Storage'
import { SettingsStackParamList } from '../navigation/SettingsStackNavigation'
import { RouteProp } from '@react-navigation/native'
interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SecurityModal'>
}

const SecurityPickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)

  const { security } = useSelector((state: RootState) => state.settings)

  const changeSecurity = async (val: Security) => {
    if (await checkSecurity()) {
      dispatch(RootStore.settings.actions.setSecurity(val))
      dispatch(RootStore.settings.actions.save())
      if (props.route.params?.isFirstTime) {
        await Storage.welcomeToNWSeen.save(true)
        props.navigation.replace(Facade.route.Tab.name, {
          screen: Facade.route.ListWallets.name,
          welcomeHidden: false
        })
      }
      controller.close()
    }
  }
  const checkSecurity = async () => {
    switch (security) {
      case Security.hardware:
        const canUseHardware = await LocalAuthentication.hasHardwareAsync()
        if (canUseHardware) {
          const result = await LocalAuthentication.authenticateAsync()
          if (result.success) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      case Security.disabled:
        return true
      default:
        break;
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
