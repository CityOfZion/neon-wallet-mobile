import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import React from 'react'
import {
  color,
  ColorProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
} from 'styled-system'

import {ROUTES} from '~/constants'
import styled, {
  ImageView,
  LinearLayout,
  RelativeLayout,
} from '~src/styles/styled-components'
import {weight, WeightProps} from '~src/styles/styled-system.config'

const TabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options

  if (focusedOptions.tabBarVisible === false) {
    return null
  }

  return (
    <TabBarContainer bg={'background.0'}>
      <RelativeLayout height={66}>
        <ImageView
          position={'absolute'}
          width={'100%'}
          bottom={0}
          resizeMode={'cover'}
          source={require('~src/assets/images/TabBar.png')}
        />

        <LinearLayout orientation="horiz" alignItems="center">
          <TabButton
            height="100%"
            onPress={() => navigation.navigate(ROUTES.LIST_WALLETS.name)}
            weight={1}
          >
            <ImageView
              m="auto"
              resizeMode="cover"
              source={require('~src/assets/images/TabBarWalletsIcon.png')}
            />
          </TabButton>
          <TabButton
            height="100%"
            onPress={() => navigation.navigate(ROUTES.CONTACTS.name)}
            weight={1}
          >
            <ImageView
              m="auto"
              resizeMode="contain"
              source={require('~src/assets/images/TabBarContactsIcon.png')}
            />
          </TabButton>
          <TabButton
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
          </TabButton>
          <TabButton
            height="100%"
            onPress={() => navigation.navigate(ROUTES.SETTINGS.name)}
            weight={1}
          >
            <ImageView
              m="auto"
              resizeMode="contain"
              source={require('~src/assets/images/TabBarSettingsIcon.png')}
            />
          </TabButton>
          <TabButton
            height="100%"
            top="4px"
            onPress={() => navigation.navigate(ROUTES.MORE.name)}
            weight={1}
          >
            <ImageView
              m="auto"
              resizeMode="contain"
              source={require('~src/assets/images/TabBarMoreIcon.png')}
            />
          </TabButton>
        </LinearLayout>
      </RelativeLayout>
    </TabBarContainer>
  )
}

const TabBarContainer = styled.SafeAreaView<ColorProps>`
  ${color}
`

const TabButton = styled.TouchableOpacity<
  LayoutProps & PositionProps & WeightProps
>`
  ${layout}
  ${position}
  ${weight}
`

export default TabBar
