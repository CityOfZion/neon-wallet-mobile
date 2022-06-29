import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SelectorList, { SelectorItem } from '~src/components/SelectorList'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import { Theme } from '~src/enums/Theme'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootState, RootStore } from '~src/store/RootStore'
interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const ThemePickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const { theme } = useSelector((state: RootState) => state.settings)

  const changeTheme = async (val: Theme) => {
    dispatch(RootStore.settings.actions.setTheme(val))
    dispatch(RootStore.settings.actions.save())
  }

  const isSelected = (t: Theme) => t === theme

  const themes: SelectorItem<Theme>[] = [
    {
      title: i18n.t('themes.DARK'),
      data: Theme.DARK,
      onClick: changeTheme,
      isSelected,
    },
    {
      title: i18n.t('themes.LIGHT'),
      data: Theme.LIGHT,
      onClick: changeTheme,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.theme.title')}
      fullSize
      padding={16}
      paddingTop={24}
      onClose={props.navigation.goBack}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onLeftPress={controller.close}
      disableDefaultScrollView
    >
      <SelectorList items={themes} />
    </SwiperPanel>
  )
}

export default ThemePickerModal
