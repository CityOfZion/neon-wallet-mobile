import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React from 'react'
import {Modal, StyleSheet, Text, View} from 'react-native'
import Swiper from 'react-native-swiper'
import {NavigationActions} from 'react-navigation'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'
import styled from 'styled-components/native'

import {Facade} from '~src/app/Facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import {RootState} from '~src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface MoreProps {
  navigation: StackNavigationProp<{
    Home: undefined
    ImportKey: undefined
    ImportReadAccount: undefined
  }>
  theme: DefaultTheme
  navigationOptions: object
}

const More = (props: MoreProps) => {
  const headerHeight = useHeaderHeight()
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
    >
      <LinearLayout
        orientation="verti"
        width="100%"
        mt={headerHeight}
        alignItems="center"
        height="100%"
      >
        <MenuItem
          title={Facade.t('more.createWallet')}
          icon={require('~/src/assets/images/wallet-icon-green.png')}
          iconMarginRight={12}
          iconHeight={28}
          arrowDirection={RightIconType.NONE}
        />
        <MenuItem
          title={Facade.t('more.createWatchAccount')}
          icon={require('~/src/assets/images/icon-watch-green.png')}
          iconWidth={20}
          iconMarginLeft={2}
          iconMarginRight={18}
          arrowDirection={RightIconType.NONE}
          onPress={() => {
            props.navigation.navigate('ImportReadAccount')
          }}
        />
        <MenuItem
          title={Facade.t('more.import')}
          icon={require('~/src/assets/images/icon-import-green.png')}
          iconWidth={26}
          iconMarginRight={15}
          iconMarginLeft={1}
          arrowDirection={RightIconType.NONE}
          onPress={() => {
            props.navigation.navigate('ImportKey')
          }}
        />
        <MenuItem
          title={Facade.t('more.help')}
          icon={require('~/src/assets/images/icon-help-green.png')}
          iconWidth={25}
          iconMarginLeft={1}
          iconMarginRight={17}
          arrowDirection={RightIconType.NONE}
        />
      </LinearLayout>
    </LinearGradient>
  )
}

export default More
