import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
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
}

const SecurityPickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)

  const {security} = useSelector((state: RootState) => state.settings)

  const changeSecurity = async (val: Security) => {
    dispatch(RootStore.settings.actions.setSecurity(val))
    dispatch(RootStore.settings.actions.save())
  }
  const checkSecurity = () => {}

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
