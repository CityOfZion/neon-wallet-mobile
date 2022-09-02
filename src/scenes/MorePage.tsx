import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as WebBrowser from 'expo-web-browser'
import i18n from 'i18n-js'
import React, { useEffect } from 'react'
import { TouchableWithoutFeedback, Platform } from 'react-native'
import { DefaultTheme } from 'styled-components'

import { RootStackParamList } from '../navigation/AppNavigation'

import { wrapper } from '~src/app/ApplicationWrapper'
import MenuItem, { RightIconType } from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'
import {useDispatch} from 'react-redux'
import { settingsReducerActions } from '../store/settings/SettingsReducer'

interface MoreProps {
  navigation: StackNavigationProp<RootStackParamList & MoreStackParamList & ModalStackParamList>
  theme: DefaultTheme
  navigationOptions: object
  route: RouteProp<MoreStackParamList, 'MorePage'>
}

const MorePage = (props: MoreProps) => {
  const handlePressHelp = async () => {
    const result = await WebBrowser.openBrowserAsync('https://app.pipefy.com/public/form/wUJ8xQoC?embedded=true')
    return result
  }
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(settingsReducerActions.setIsFirstTime(false))
  }, [])

  return (
    <ScreenLayout padding={20} darkerSolidColorBG>
      <LinearLayout mb="20px" />
      <MenuItem
        title={i18n.t('more.createWallet')}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={3}
        iconHeight={26}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate(wrapper.route.Step1CreateWallet.name, {})
        }}
      />
      <MenuItem
        title={i18n.t('more.createWatchAccount')}
        icon={require('~/src/assets/images/icon-watch-green.png')}
        iconHeight={20}
        iconWidth={20}
        iconMarginRight={5}
        iconMarginLeft={2}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate(wrapper.route.ImportReadAccount.name, {})
        }}
      />
      <MenuItem
        title={i18n.t('more.import')}
        icon={require('~/src/assets/images/icon-import-green.png')}
        iconHeight={22}
        iconWidth={22}
        iconMarginRight={15}
        iconMarginLeft={1}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate(wrapper.route.ImportKey.name, {})
        }}
      />
      <MenuItem
        title={i18n.t('more.settings')}
        icon={require('~/src/assets/images/icon-settings-green.png')}
        iconHeight={22}
        iconWidth={22}
        iconMarginRight={15}
        iconMarginLeft={1}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate(wrapper.route.Settings.name)
        }}
      />
      <MenuItem
        title={i18n.t('more.help')}
        icon={require('~/src/assets/images/icon-help-green.png')}
        iconWidth={21}
        iconMarginLeft={1}
        iconMarginRight={17}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          handlePressHelp()
        }}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.ChangelogModal.name,
          })
        }}
      >
        <LinearLayout position="absolute" left="5%" right="5%" bottom="3%">
          <TextView fontSize={14} color="white" textAlign="left" numberOfLines={1} width="88%" allowFontScaling>
            {`v${Constants.nativeAppVersion}-${Constants.nativeBuildVersion}${Platform.OS === 'ios' ? 'i' : 'a'}`}
          </TextView>
        </LinearLayout>
      </TouchableWithoutFeedback>
    </ScreenLayout>
  )
}

export default MorePage
