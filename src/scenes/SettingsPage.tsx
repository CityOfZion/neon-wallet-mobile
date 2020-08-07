import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'

interface SettingsProps {
  navigation: StackNavigationProp<SettingsStackParamList & RootStackParamList>
  theme: DefaultTheme
  navigationOptions: object
}

const SettingsPage = (props: SettingsProps) => {
  const {language, currency, theme, network} = useSelector(
    (state: RootState) => state.settings
  )

  const openModal = (modal: keyof ModalStackParamList) => {
    props.navigation.navigate(Facade.route.Modal.name, {
      screen: modal,
    })
  }

  return (
    <ScreenLayout padding={20}>
      <MenuItem
        title={Facade.t('settings.myWallets')}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={12}
        iconHeight={28}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() => props.navigation.navigate(Facade.route.MyWallets.name)}
      />

      <MenuItem
        title={Facade.t('settings.security')}
        icon={require('~/src/assets/images/security-icon-green.png')}
        iconWidth={20}
        iconMarginLeft={2}
        iconMarginRight={18}
        arrowDirection={RightIconType.ARROW_RIGHT}
      />

      <MenuItem
        title={Facade.t('settings.currency')}
        icon={require('~src/assets/images/icon-currency-green.png')}
        iconWidth={26}
        iconMarginRight={16}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={currency}
        onPress={() => openModal(Facade.route.CurrencyPickerModal.name)}
      />

      <MenuItem
        title={Facade.t('settings.language')}
        icon={require('~src/assets/images/icon-language-green.png')}
        iconWidth={16}
        iconMarginLeft={2}
        iconMarginRight={22}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={Facade.t(`languages.${language}`)}
        onPress={() => openModal(Facade.route.LanguagePickerModal.name)}
      />

      <MenuItem
        title={Facade.t('settings.theme')}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={Facade.t(`themes.${theme}`)}
        onPress={() => openModal(Facade.route.ThemePickerModal.name)}
      />

      <MenuItem
        title={Facade.t('settings.network')}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={network.name}
        onPress={() => openModal(Facade.route.NetworkPickerModal.name)}
      />
    </ScreenLayout>
  )
}

export default SettingsPage
