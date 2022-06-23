import { StackNavigationProp } from '@react-navigation/stack'
import { Await } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SelectorList, { SelectorItem } from '~src/components/SelectorList'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {Lang} from '~src/enums/Lang'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootState, RootStore} from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const LanguagePickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const { language } = useSelector((state: RootState) => state.settings)

  const changeLanguage = async (val: Lang) => {
    dispatch(RootStore.settings.actions.setLanguage(val))
    await Await.run('application', async () => await dispatch(RootStore.settings.actions.save()), 1000)
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
      fullSize
      padding={24}
      onClose={props.navigation.goBack}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onLeftPress={controller.close}
      disableDefaultScrollView
    >
      <SelectorList items={languages} />
    </SwiperPanel>
  )
}

export default LanguagePickerModal
