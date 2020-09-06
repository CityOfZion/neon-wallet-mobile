import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SelectorList, {SelectorItem} from '~src/components/SelectorList'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {NetworkOptions} from '~src/types/settings'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const NetworkPickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const controller = useSwiperController(true)
  const {network} = useSelector((state: RootState) => state.settings)

  const changeNetwork = async (val: NetworkOptions) => {
    dispatch(RootStore.settings.actions.setNetwork(val))
    dispatch(RootStore.settings.actions.save())
    await dispatchAsync(RootStore.app.actions.syncNodes())
  }

  const isSelected = (n: NetworkOptions) => n.name === network.name

  const networks: SelectorItem<NetworkOptions>[] = [
    {
      title: 'Main',
      data: Facade.app.mainNetwork,
      onClick: changeNetwork,
      isSelected,
    },
    {
      title: 'Test',
      data: Facade.app.testNetwork,
      onClick: changeNetwork,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={Facade.t('modals.network.title')}
      fullSize={true}
      padding={16}
      paddingTop={24}
      onClose={props.navigation.goBack}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onLeftPress={controller.close}
      disableDefaultScrollView={true}
    >
      <SelectorList items={networks} />
    </SwiperPanel>
  )
}

export default NetworkPickerModal
