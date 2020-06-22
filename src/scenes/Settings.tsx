import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useState} from 'react'
import {Modal} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import HeaderBar from '~src/components/HeaderBar'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import i18n from '~src/i18n'
import {setLocale} from '~src/store/actions/app'
import {RootState} from '~src/store/reducers/root'
import {LinearLayout} from '~src/styles/styled-components'

interface SettingsProps {
  navigation: StackNavigationProp<{Home: undefined}>
  theme: DefaultTheme
  navigationOptions: object
}

const Settings = (props: SettingsProps) => {
  const headerHeight = useHeaderHeight()
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const [isShowingIdiom, setIsShowingIdiom] = useState(false)
  const [selectedIdiom, setSelectedIdiom] = useState('en')
  const idioms = [
    {
      title: 'languages.en',
      isSelected: selectedIdiom === 'en',
      onItemSelected: () => {
        changeLocale('en')
        setSelectedIdiom('en')
      },
    },
    {
      title: 'languages.ptBR',
      isSelected: selectedIdiom === 'ptBR',
      onItemSelected: () => {
        changeLocale('ptBR')
        setSelectedIdiom('ptBR')
      },
    },
    {
      title: 'languages.de',
      isSelected: selectedIdiom === 'de',
      onItemSelected: () => {
        changeLocale('de')
        setSelectedIdiom('de')
      },
    },
  ]

  const changeLocale = (locale: string) => {
    dispatch(setLocale(locale))
  }

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
    >
      <Modal animationType="slide" transparent={true} visible={isShowingIdiom}>
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
            iconWidth={28}
            onPressToClose={() => setIsShowingIdiom(false)}
          />
          <LinearLayout alignItems="center" height="100%">
            <LinearLayout orientation="verti" width="100%" mt={20}>
              {idioms.map((idiom) => {
                return (
                  <MenuItem
                    title={i18n.t(idiom.title)}
                    arrowDirection={
                      idiom.isSelected
                        ? RightIconType.CHECK
                        : RightIconType.NONE
                    }
                    onPress={idiom.onItemSelected}
                  />
                )
              })}
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
