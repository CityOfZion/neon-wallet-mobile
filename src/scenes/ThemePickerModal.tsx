import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { settingsReducerActions } from '../store/settings/SettingsReducer'

import SelectorList, { SelectorItem } from '~src/components/SelectorList'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { Theme } from '~src/enums/Theme'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootState } from '~src/store/RootStore'
interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const ThemePickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const theme = useSelector((state: RootState) => state.settings.theme)

  const changeTheme = async (val: Theme) => {
    dispatch(settingsReducerActions.setTheme(val))
  }

  const isSelected = (t: Theme) => t === theme

  const themes: SelectorItem<Theme>[] = [
    {
      title: i18n.t('themes.DARK'),
      data: Theme.DARK,
      onClick: changeTheme,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.theme.title')}
      onClose={props.navigation.goBack}
      rightButton={<CloseButton onPress={controller.close} />}
      withoutScrollView
    >
      <SelectorList items={themes} />
    </SwiperPanel>
  )
}

export default ThemePickerModal
