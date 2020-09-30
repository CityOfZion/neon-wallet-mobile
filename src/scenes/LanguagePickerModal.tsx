import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SelectorList, {SelectorItem} from '~src/components/SelectorList'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {Lang} from '~src/enums/Lang'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const LanguagePickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const {language} = useSelector((state: RootState) => state.settings)

  const changeLanguage = async (val: Lang) => {
    dispatch(RootStore.settings.actions.setLanguage(val))
    await Facade.await.run(
      'application',
      async () => await dispatch(RootStore.settings.actions.save()),
      1000
    )
  }

  const isSelected = (l: Lang) => l === language

  const languages: SelectorItem<Lang>[] = [
    {
      title: Facade.t('languages.en-US'),
      data: Lang.EN_US,
      onClick: changeLanguage,
      isSelected,
    },
    {
      title: Facade.t('languages.pt-BR'),
      data: Lang.PT_BR,
      onClick: changeLanguage,
      isSelected,
    },
    {
      title: Facade.t('languages.de'),
      data: Lang.DE,
      onClick: changeLanguage,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={Facade.t('modals.language.title')}
      fullSize={true}
      padding={24}
      onClose={props.navigation.goBack}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onLeftPress={controller.close}
      disableDefaultScrollView={true}
    >
      <SelectorList items={languages} />
    </SwiperPanel>
  )
}

export default LanguagePickerModal
