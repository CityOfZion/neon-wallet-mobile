import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { settingsReducerActions } from '../store/settings/SettingsReducer'

import SelectorList, { SelectorItem } from '~src/components/SelectorList'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { Lang } from '~src/enums/Lang'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootState } from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const LanguagePickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const { language } = useSelector((state: RootState) => state.settings)

  const changeLanguage = async (val: Lang) => {
    dispatch(settingsReducerActions.setLanguage(val))
  }

  const isSelected = (l: Lang) => l === language

  const languages: SelectorItem<Lang>[] = [
    {
      title: i18n.t('languages.en-US'),
      data: Lang.EN_US,
      onClick: changeLanguage,
      isSelected,
    },
    {
      title: i18n.t('languages.pt-BR'),
      data: Lang.PT_BR,
      onClick: changeLanguage,
      isSelected,
    },
    {
      title: i18n.t('languages.de'),
      data: Lang.DE,
      onClick: changeLanguage,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.language.title')}
      onClose={props.navigation.goBack}
      rightButton={<CloseButton onPress={controller.close} />}
      withoutScrollView
    >
      <SelectorList items={languages} />
    </SwiperPanel>
  )
}

export default LanguagePickerModal
