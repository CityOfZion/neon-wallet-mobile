import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import React, {useEffect, useRef} from 'react'
import {Animated, View, Easing} from 'react-native'
import {useSelector} from 'react-redux'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
} from 'styled-system'

import {WINDOW_WIDTH, FOOTER_HEIGHT} from '~/constants'
import {useRoutePath} from '~src/app/RouteUtils'
import {useSwiperController} from '~src/components/SwiperPanel'
import QuickToolsMenu from '~src/scenes/QuickToolsMenu'
import {RootState} from '~src/store/reducers/root'
import styled, {
  ImageView,
  LinearLayout,
  RelativeLayout,
} from '~src/styles/styled-components'
import {
  orientation,
  OrientationProps,
  weight,
  WeightProps,
} from '~src/styles/styled-system.config'

const FooterBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const focusedOptions = descriptors[state.routes[state.index].key].options
  const path = useRoutePath()

  if (focusedOptions.tabBarVisible === false) {
    return null
  }

  const quickToolColor = useRef(new Animated.Value(0))
  const colorInterpolator = quickToolColor.current.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.primary, theme.colors.quaternary],
  })

  const quickToolSpin = useRef(new Animated.Value(0))
  const spinInterpolator = quickToolSpin.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  })

  const controller = useSwiperController()

  function animateQuickToolsButton() {
    Animated.parallel([
      Animated.timing(quickToolColor.current, {
        toValue: controller.isShowing ? 1 : 0,
        duration: 300,
        easing: Easing.quad,
      }),
      Animated.timing(quickToolSpin.current, {
        toValue: controller.isShowing ? 1 : 0,
        duration: 300,
        easing: Easing.quad,
      }),
    ]).start()
  }

  useEffect(() => {
    animateQuickToolsButton()
  }, [controller.isShowing])

  return (
    <LinearLayout
      height="100%"
      width="100%"
      justifyContent="flex-end"
      position="absolute"
      pointerEvents={'box-none'}
    >
      <QuickToolsMenu controller={controller} />
      <TabBarContainer
        height={FOOTER_HEIGHT}
        width={WINDOW_WIDTH}
        bg={'background.0'}
      >
        <RelativeLayout height="100%" width="100%">
          <View pointerEvents={'none'}>
            <ImageView
              opacity={0.25}
              position="absolute"
              bottom={'100%'}
              width={'100%'}
              resizeMode={'contain'}
              source={require('~src/assets/images/TabBarShadow.png')}
            />
          </View>
          <ImageView
            position={'absolute'}
            bottom={0}
            width={'100%'}
            resizeMode={'cover'}
            source={require('~src/assets/images/TabBar.png')}
          />
          <LinearLayout
            position={'absolute'}
            bottom={0}
            orientation="horiz"
            alignItems="center"
            pointerEvents={'box-none'}
          >
            <TabButton
              height="100%"
              onPress={() => navigation.navigate(path.ListWallets.name)}
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
              onPress={() => navigation.navigate(path.Contacts.name)}
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
              onPress={() => {
                controller.toggle()
              }}
            >
              <AnimatedLinearLayout
                width="100%"
                height="100%"
                borderRadius="9999px"
                style={{
                  backgroundColor: colorInterpolator,
                }}
              >
                <AnimatedImageView
                  m="auto"
                  resizeMode="contain"
                  source={require('~src/assets/images/plus-sign-tabbar.png')}
                  style={{
                    transform: [{rotate: spinInterpolator}],
                  }}
                />
              </AnimatedLinearLayout>
            </TabButton>
            <TabButton
              height="100%"
              onPress={() => navigation.navigate(path.Settings.name)}
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
              onPress={() => navigation.navigate(path.More.name)}
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
    </LinearLayout>
  )
}

const TabBarContainer = styled.SafeAreaView<
  LayoutProps & ColorProps & PositionProps
>`
  ${layout}
  ${color}
  ${position}
`

const TabButton = styled.TouchableOpacity<
  SpaceProps & LayoutProps & PositionProps & WeightProps
>`
  ${space} 
  ${layout}
  ${position}
  ${weight}
`

const AnimatedImageView = styled(Animated.Image)<
  SpaceProps & LayoutProps & FlexboxProps & PositionProps & WeightProps
>`
  ${space}
  ${layout}
  ${flexbox}
  ${position}
  ${weight}
`

const AnimatedLinearLayout = styled(Animated.View)<
  BorderProps &
    ColorProps &
    OrientationProps &
    SpaceProps &
    LayoutProps &
    FlexboxProps &
    WeightProps &
    PositionProps
>`
  ${border}  
  ${color}
  ${orientation}
  ${space}
  ${layout}
  ${flexbox}
  ${weight}
  ${position}
`

export default FooterBar
