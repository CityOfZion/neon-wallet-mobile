import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application'
import * as WebBrowser from 'expo-web-browser'
import i18n from 'i18n-js'
import React, { useEffect } from 'react'
import { TouchableWithoutFeedback, Platform } from 'react-native'
import { useDispatch } from 'react-redux'
import { DefaultTheme } from 'styled-components'

import { RootStackParamList } from '../navigation/AppNavigation'
import { settingsReducerActions } from '../store/settings/SettingsReducer'

import { wrapper } from '~src/app/ApplicationWrapper'
import MenuItem, { MenuItemIcon, RightIconType } from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'

interface MoreProps {
  navigation: StackNavigationProp<RootStackParamList & MoreStackParamList & ModalStackParamList>
  theme: DefaultTheme
  navigationOptions: object
  route: RouteProp<MoreStackParamList, 'MorePage'>
}

const MorePage = (props: MoreProps) => {
  const dispatch = useDispatch()

  const handlePressHelp = async () => {
    const result = await WebBrowser.openBrowserAsync('https://app.pipefy.com/public/form/wUJ8xQoC?embedded=true')
    return result
  }

  const handlePressPrivacyPolicy = async () => {
    const result = await WebBrowser.openBrowserAsync('https://www.coz.io/privacy-policy')
    return result
  }

  useEffect(() => {
    dispatch(settingsReducerActions.setIsFirstTime(false))
  }, [])

  return (
    <ScreenLayout hideBackButton>
      <LinearLayout height="100%" justifyContent="space-between">
        <LinearLayout>
          <MenuItem
            title={i18n.t('more.createWallet')}
            icon={<MenuItemIcon source={require('~/src/assets/images/wallet-icon-green.png')} />}
            arrowDirection={RightIconType.NONE}
            onPress={() => {
              props.navigation.navigate(wrapper.route.Step1CreateWallet.name, {})
            }}
          />
          <MenuItem
            title={i18n.t('more.createWatchAccount')}
            icon={<MenuItemIcon source={require('~/src/assets/images/icon-watch-green.png')} />}
            arrowDirection={RightIconType.NONE}
            onPress={() => {
              props.navigation.navigate(wrapper.route.ImportReadAccount.name, {})
            }}
          />
          <MenuItem
            testID="menu-item-import-key"
            title={i18n.t('more.import')}
            icon={<MenuItemIcon source={require('~/src/assets/images/icon-import-green.png')} />}
            arrowDirection={RightIconType.NONE}
            onPress={() => {
              props.navigation.navigate(wrapper.route.ImportKey.name, {})
            }}
          />
          <MenuItem
            title={i18n.t('more.settings')}
            icon={<MenuItemIcon source={require('~/src/assets/images/icon-settings-green.png')} />}
            arrowDirection={RightIconType.NONE}
            onPress={() => {
              props.navigation.navigate(wrapper.route.Settings.name)
            }}
          />
          <MenuItem
            title={i18n.t('more.help')}
            icon={<MenuItemIcon source={require('~/src/assets/images/icon-help-green.png')} />}
            arrowDirection={RightIconType.EXTERNAL}
            onPress={handlePressHelp}
          />

          <MenuItem
            title={i18n.t('more.privatePolicy')}
            icon={<MenuItemIcon source={require('~/src/assets/images/icon-privacy-policy-green.png')} />}
            arrowDirection={RightIconType.EXTERNAL}
            onPress={handlePressPrivacyPolicy}
          />
        </LinearLayout>

        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.ChangelogModal.name,
            })
          }}
        >
          <LinearLayout>
            <TextView fontSize={14} color="white" textAlign="left" numberOfLines={1} width="88%" allowFontScaling>
              {`v${nativeApplicationVersion}-${nativeBuildVersion}${Platform.OS === 'ios' ? 'i' : 'a'}`}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default MorePage
