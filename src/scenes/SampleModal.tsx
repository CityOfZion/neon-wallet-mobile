import i18n from 'i18n-js'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootState} from '~src/store/reducers/root'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

export default function SampleModal(props: Props) {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const controller = useSwiperController(true)

  const [name, setName] = useState<string>()
  const [color, setColor] = useState<string>()

  function persistAccount() {
    // TODO: Store account info on redux/asyncStorage
    if (name) {
      // const account = new Account()
      props.navigation.goBack()
    } else {
      // TODO: Validate account name field as empty
    }
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={36}
      title={i18n.t('screens.createAccount.title')}
      leftButton={i18n.t('screens.createAccount.navigation.cancel')}
      rightButton={i18n.t('screens.createAccount.navigation.save')}
      onLeftPress={() => controller.close()}
      onRightPress={() => controller.close()}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/icon-plus-circle-white.png')}
    >
      <LinearLayout width="100%" height="100%">
        <TextView
          mb={52}
          color={theme.colors.text[0]}
          fontSize={18}
          fontFamily="medium"
          textAlign="center"
        >
          {i18n.t('screens.createAccount.subtitle')}
        </TextView>
        <TextView color={theme.colors.text[0]} mb={66}>
          TODO: InputText {'\n'}
          {i18n.t('screens.createAccount.accountInput.title')} {'\n'}
          {i18n.t('screens.createAccount.accountInput.placeholder')} {'\n'}
        </TextView>
        <TextView
          mb={52}
          color={theme.colors.text[0]}
          fontSize={18}
          fontFamily="medium"
          textAlign="center"
        >
          {i18n.t('screens.createAccount.selectColor')}
        </TextView>
        <TextView color={theme.colors.text[0]}>TODO: ColorSelector</TextView>
      </LinearLayout>
    </SwiperPanel>
  )
}
