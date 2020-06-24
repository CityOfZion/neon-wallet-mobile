import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import React from 'react'
import {layout, LayoutProps} from 'styled-system'

import {ROUTES, WINDOW_WIDTH} from '~/constants'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  RelativeLayout,
} from '~src/styles/styled-components'

const TabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options
  if (focusedOptions.tabBarVisible === false) {
    return null
  }

  return (
    <TabBarContainer height={66} width={WINDOW_WIDTH}>
      <RelativeLayout height="100%" width="100%">
        <ImageView
          opacity={0.1}
          position="absolute"
          bottom={'100%'}
          width={'100%'}
          resizeMode={'cover'}
          source={require('~src/assets/images/TabBarShadow.png')}
        />
        <ImageView
          position={'absolute'}
          bottom={0}
          width={'100%'}
          resizeMode={'cover'}
          source={require('~src/assets/images/TabBar.png')}
        />
        <LinearLayout orientation="horiz" alignItems="center">
          <ButtonView
            height="100%"
            onPress={() => navigation.navigate(ROUTES.WALLET.name)}
            weight={1}
          >
            <ImageView
              m="auto"
              resizeMode="cover"
              source={require('~src/assets/images/TabBarWalletsIcon.png')}
            />
          </ButtonView>
          <ButtonView
            height="100%"
            onPress={() => navigation.navigate(ROUTES.CONTACTS.name)}
            weight={1}
          >
            <ImageView
              m="auto"
              resizeMode="contain"
              source={require('~src/assets/images/TabBarContactsIcon.png')}
            />
          </ButtonView>
          <ButtonView
            mx="6px"
            bottom="8px"
            width={66}
            height={66}
            onPress={() => navigation.navigate(ROUTES.QUICK_TOOLS.name)}
          >
            <ImageView
              width="100%"
              height="100%"
              resizeMode="contain"
              source={require('~src/assets/images/TabBarPlusIcon.png')}
            />
          </ButtonView>
          <ButtonView
            height="100%"
            onPress={() => navigation.navigate(ROUTES.SETTINGS.name)}
            weight={1}
          >
            <ImageView
              m="auto"
              resizeMode="contain"
              source={require('~src/assets/images/TabBarSettingsIcon.png')}
            />
          </ButtonView>
          <ButtonView
            height="100%"
            onPress={() => navigation.navigate(ROUTES.MORE.name)}
            weight={1}
          >
            <ImageView
              m="auto"
              resizeMode="contain"
              source={require('~src/assets/images/TabBarMoreIcon.png')}
            />
          </ButtonView>
        </LinearLayout>
      </RelativeLayout>
    </TabBarContainer>
  )
}

const TabBarContainer = styled.SafeAreaView<LayoutProps>`
  ${layout}
`

export default TabBar
