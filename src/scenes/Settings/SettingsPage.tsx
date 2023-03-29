import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'
import { DefaultTheme } from 'styled-components'

import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { RootState } from '~/src/store/RootStore'
import { wrapper } from '~src/app/ApplicationWrapper'
import MenuItem, { RightIconType } from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { SettingsStackParamList } from '~src/navigation/SettingsStackNavigation'

interface SettingsProps {
  navigation: StackNavigationProp<SettingsStackParamList & RootStackParamList & TabStackParamList>
  theme: DefaultTheme
  navigationOptions: object
  route: RouteProp<SettingsStackParamList, 'SettingsPage'>
}

const SettingsPage = (props: SettingsProps) => {
  const showLanguage = false
  const showTheme = false

  const { language, currency, theme } = useSelector((state: RootState) => state.settings)

  return (
    <ScreenLayout>
      <MenuItem
        title={i18n.t('settings.security')}
        icon={require('~/src/assets/images/security-icon-green.png')}
        iconWidth={18}
        iconMarginLeft={2}
        iconMarginRight={18}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() => props.navigation.navigate(wrapper.route.SecurityBackupCheckPage.name)}
      />

      <MenuItem
        title={i18n.t('settings.currency')}
        icon={require('~src/assets/images/icon-currency-green.png')}
        iconWidth={22}
        iconMarginLeft={2}
        iconMarginRight={16}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={currency}
        onPress={() =>
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.CurrencyPickerModal.name,
          })
        }
      />

      {showLanguage && (
        <MenuItem
          title={i18n.t('settings.language')}
          icon={require('~src/assets/images/icon-language-green.png')}
          iconWidth={16}
          iconMarginLeft={2}
          iconMarginRight={22}
          arrowDirection={RightIconType.ARROW_DOWN}
          subtitle={i18n.t(`languages.${language}`)}
          onPress={() =>
            props.navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.LanguagePickerModal.name,
            })
          }
        />
      )}

      {showTheme && (
        <MenuItem
          title={i18n.t('settings.theme')}
          arrowDirection={RightIconType.ARROW_DOWN}
          subtitle={i18n.t(`themes.${theme}`)}
          onPress={() =>
            props.navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.ThemePickerModal.name,
            })
          }
        />
      )}

      <MenuItem
        title={i18n.t('settings.protocols')}
        icon={require('~src/assets/images/protocols-green.png')}
        arrowDirection={RightIconType.ARROW_RIGHT}
        iconWidth={22}
        iconMarginLeft={2}
        iconMarginRight={16}
        onPress={() => props.navigation.navigate(wrapper.route.ProtocolsPage.name)}
      />
    </ScreenLayout>
  )
}

export default SettingsPage
