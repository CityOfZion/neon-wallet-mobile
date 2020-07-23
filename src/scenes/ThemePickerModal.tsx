import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import SelectorList, {SelectorItem} from '~src/components/SelectorList'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {Theme} from '~src/enums/Theme'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const ThemePickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const {theme} = useSelector((state: RootState) => state.app)

  const changeTheme = async (val: Theme) => {
    dispatch(RootStore.app.actions.setTheme(val))
    await Storage.theme.save(val)
  }

  const isSelected = (t: Theme) => t === theme

  const themes: SelectorItem<Theme>[] = [
    {
      title: Facade.t('themes.DARK'),
      data: Theme.DARK,
      onClick: changeTheme,
      isSelected,
    },
    {
      title: Facade.t('themes.LIGHT'),
      data: Theme.LIGHT,
      onClick: changeTheme,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={Facade.t('modals.theme.title')}
      fullSize={true}
      padding={16}
      paddingTop={24}
      onClose={props.navigation.goBack}
      rightButton={CloseButton()}
      onLeftPress={controller.close}
      onRightPress={controller.close}
      disableDefaultScrollView={true}
    >
      <SelectorList items={themes} />
    </SwiperPanel>
  )
}

export default ThemePickerModal
