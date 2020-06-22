import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useState} from 'react'
import {Alert, Modal, TouchableHighlight} from 'react-native'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'
import {width} from 'styled-system'

import HeaderBar from '~src/components/HeaderBar'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import {SettingsList} from '~src/components/SettingsList'
import i18n from '~src/i18n'
import {RootState} from '~src/store/reducers/root'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface SettingsProps {
  navigation: StackNavigationProp<{Home: undefined}>
  theme: DefaultTheme
  navigationOptions: object
}

const Settings = (props: SettingsProps) => {
  const headerHeight = useHeaderHeight()
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const [isShowingIdiom, setIsShowingIdiom] = useState(false)
  const idioms = [
    {title: 'English', isSelected: true, onItemSelected: () => {}},
    {title: 'Portuguese', isSelected: false, onItemSelected: () => {}},
    {title: 'German', isSelected: false, onItemSelected: () => {}},
  ]

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShowingIdiom}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}
      >
        <LinearGradient
          style={{flex: 1}}
          colors={[theme.colors.background[0], theme.colors.background[2]]}
          end={[1, 0.75]}
        >
          <HeaderBar
            title={i18n.t('settings.language')}
            image={require('~/src/assets/images/language-icon-white.png')}
            showIcon={true}
            iconMarginRight={3}
            iconMarginTop={1}
            iconWidth={25}
          />
          <LinearLayout alignItems="center" height="100%">
            <LinearLayout orientation="verti" width="100%" mt={20}>
              <MenuItem
                title={i18n.t('settings.myWallets')}
                arrowDirection={RightIconType.CHECK}
              />
              <MenuItem
                title={i18n.t('settings.security')}
                icon={require('~/src/assets/images/security-icon-green.png')}
                iconWidth={20}
                iconMarginLeft={2}
                iconMarginRight={18}
                arrowDirection={RightIconType.NONE}
              />
              <MenuItem
                title={i18n.t('settings.currency')}
                icon={require('~/src/assets/images/currency-icon-green.png')}
                iconWidth={26}
                iconMarginRight={16}
                arrowDirection={RightIconType.NONE}
                subtitle={'USD'}
              />
            </LinearLayout>
          </LinearLayout>
        </LinearGradient>
      </Modal>
      <LinearLayout alignItems="center" height="100%">
        <LinearLayout orientation="verti" width="100%" mt={headerHeight}>
          <MenuItem
            title={i18n.t('settings.myWallets')}
            icon={require('~/src/assets/images/wallet-icon-green.png')}
            iconMarginRight={12}
            iconHeight={28}
            arrowDirection={RightIconType.ARROW_RIGHT}
          />
          <MenuItem
            title={i18n.t('settings.security')}
            icon={require('~/src/assets/images/security-icon-green.png')}
            iconWidth={20}
            iconMarginLeft={2}
            iconMarginRight={18}
            arrowDirection={RightIconType.ARROW_RIGHT}
          />
          <MenuItem
            title={i18n.t('settings.currency')}
            icon={require('~/src/assets/images/currency-icon-green.png')}
            iconWidth={26}
            iconMarginRight={16}
            arrowDirection={RightIconType.ARROW_DOWN}
            subtitle={'USD'}
          />
          <MenuItem
            title={i18n.t('settings.language')}
            icon={require('~/src/assets/images/language-icon-green.png')}
            iconWidth={16}
            iconMarginLeft={2}
            iconMarginRight={22}
            arrowDirection={RightIconType.ARROW_DOWN}
            subtitle={i18n.t('languages.en')}
            onPress={() => setIsShowingIdiom(true)}
          />
        </LinearLayout>
      </LinearLayout>
    </LinearGradient>
  )
}

export default Settings
