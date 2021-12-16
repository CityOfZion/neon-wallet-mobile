import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {wrapper} from '~src/app/ApplicationWrapper'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {LinearLayout} from '~src/styles/styled-components'

interface SettingsProps {
  navigation: StackNavigationProp<SettingsStackParamList & RootStackParamList>
  theme: DefaultTheme
  navigationOptions: object
  route: RouteProp<SettingsStackParamList, 'SettingsPage'>
}

const SettingsPage = (props: SettingsProps) => {
  const showLanguage = false
  const showTheme = false

  const {language, currency, theme, security} = useSelector(
    (state: RootState) => state.settings
  )
  const openModal = (
    modal: keyof ModalStackParamList,
    params?: ModalStackParamList['SecurityModal']
  ) => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: modal,
      params,
    })
  }
  useEffect(() => {
    if (props.route.params?.initialRoute) {
      openModal(
        props.route.params.initialRoute,
        props.route.params?.initialRoute
          ? {isFirstTime: true}
          : {isFirstTime: false}
      )
    }
  }, [])
  return (
    <ScreenLayout padding={20}>
      <MenuItem
        title={i18n.t('settings.myWallets')}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={12}
        iconHeight={24}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() => props.navigation.navigate(wrapper.route.MyWallets.name)}
      />

      <MenuItem
        title={i18n.t('settings.security')}
        icon={require('~/src/assets/images/security-icon-green.png')}
        iconWidth={18}
        iconMarginLeft={2}
        iconMarginRight={18}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() => openModal(wrapper.route.SecurityModal.name)}
      />

      <MenuItem
        title={i18n.t('settings.currency')}
        icon={require('~src/assets/images/icon-currency-green.png')}
        iconWidth={22}
        iconMarginLeft={2}
        iconMarginRight={16}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={currency}
        onPress={() => openModal(wrapper.route.CurrencyPickerModal.name)}
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
          onPress={() => openModal(wrapper.route.LanguagePickerModal.name)}
        />
      )}

      {showTheme && (
        <MenuItem
          title={i18n.t('settings.theme')}
          arrowDirection={RightIconType.ARROW_DOWN}
          subtitle={i18n.t(`themes.${theme}`)}
          onPress={() => openModal(wrapper.route.ThemePickerModal.name)}
        />
      )}
    </ScreenLayout>
  )
}

export default SettingsPage
