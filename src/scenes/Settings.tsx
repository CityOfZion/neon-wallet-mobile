import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Swiper from 'react-native-swiper'
import {DefaultTheme} from 'styled-components'
import styled from 'styled-components/native'
import i18n from '~src/i18n'

import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import {useSelector} from "react-redux";
import {RootState} from "~src/store/reducers/root";

interface SettingsProps {
  navigation: StackNavigationProp<{Home: undefined}>
  theme: DefaultTheme
  navigationOptions: object
}

const Settings = (props: SettingsProps) => {
  const headerHeight = useHeaderHeight()
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
    >
      <LinearLayout alignItems="center" height="100%">
        <LinearLayout
          orientation="verti"
          width="100%"
          pr={20}
          pl={20}
          mt={headerHeight}
        >
          <LinearLayout
            alignItems="center"
            orientation="horiz"
            height={65}
            width="100%"
            mt={50}
          >
            <ImageView
              height={28}
              width={28}
              source={require('~/src/assets/images/wallet-icon-green.png')}
            />
            <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
              {i18n.t('settings.myWallets')}
            </TextView>
            <LinearLayout weight={1} />
            <ImageView
              width={12}
              height={19}
              source={require('~/src/assets/images/icon-arrow-right-green.png')}
            />
          </LinearLayout>
          <LinearLayout height={1} backgroundColor="#667178" width="100%" />
        </LinearLayout>
        <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
          <LinearLayout
            alignItems="center"
            orientation="horiz"
            height={65}
            width="100%"
            pl={2}
          >
            <ImageView
              height={26}
              width={20}
              mr={2}
              source={require('~/src/assets/images/security-icon-green.png')}
            />
            <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
              {i18n.t('settings.security')}
            </TextView>
            <LinearLayout weight={1} />
            <ImageView
              width={12}
              height={19}
              source={require('~/src/assets/images/icon-arrow-right-green.png')}
            />
          </LinearLayout>
          <LinearLayout height={1} backgroundColor="#667178" width="100%" />
        </LinearLayout>
        <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
          <LinearLayout
            alignItems="center"
            orientation="horiz"
            height={65}
            width="100%"
            pl={1}
          >
            <ImageView
              height={18}
              width={26}
              source={require('~/src/assets/images/currency-icon-green.png')}
            />
            <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
              {i18n.t('settings.currency')}
            </TextView>
            <LinearLayout weight={1} />
            <TextView
              fontSize={16}
              fontFamily="semibold"
              mr={3}
              color="#869ca5"
            >
              USD
            </TextView>
            <ImageView
              width={18}
              height={12}
              source={require('~/src/assets/images/icon-arrow-down-green.png')}
            />
          </LinearLayout>
          <LinearLayout height={1} backgroundColor="#667178" width="100%" />
        </LinearLayout>
        <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
          <LinearLayout
            alignItems="center"
            orientation="horiz"
            height={65}
            width="100%"
            pl={2}
          >
            <ImageView
              height={18}
              width={16}
              mr={3}
              source={require('~/src/assets/images/language-icon-green.png')}
            />
            <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
              {i18n.t('settings.language')}
            </TextView>
            <LinearLayout weight={1} />
            <TextView
              fontSize={16}
              fontFamily="semibold"
              mr={3}
              color="#869ca5"
            >
              {i18n.t('languages.en')}
            </TextView>
            <ImageView
              width={18}
              height={12}
              source={require('~/src/assets/images/icon-arrow-down-green.png')}
            />
          </LinearLayout>
          <LinearLayout height={1} backgroundColor="#667178" width="100%" />
        </LinearLayout>
      </LinearLayout>
    </LinearGradient>
  )
}

export default Settings
