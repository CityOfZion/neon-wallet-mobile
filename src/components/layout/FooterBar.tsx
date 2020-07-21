import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import React, {useEffect, useRef} from 'react'
import {Animated, View, Easing, ImageSourcePropType} from 'react-native'
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

import {Facade} from '~src/app/Facade'
import {Route} from '~src/app/Route'
import {useSwiperController} from '~src/components/SwiperPanel'
import QuickToolsMenu from '~src/scenes/QuickToolsMenu'
import styled, {
  ImageView,
  LinearLayout,
  RelativeLayout,
} from '~src/styles/styled-components'
import {orientation, weight} from '~src/styles/styled-system.config'

interface TabButtonContent {
  enabledSource: ImageSourcePropType
  disabledSource: ImageSourcePropType
  route: Route<RouteName>
}

const FooterBar: React.FC<BottomTabBarProps> = (props: BottomTabBarProps) => {
  const {state, descriptors, navigation} = props
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const focusedOptions = descriptors[state.routes[state.index].key].options

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

  const walletButton = {
    enabledSource: require('~src/assets/images/button-wallet-primary.png'),
    disabledSource: require('~src/assets/images/button-wallet-disabled.png'),
    route: Facade.route.ListWallets,
  }
  const contactsButton = {
    enabledSource: require('~src/assets/images/button-contacts-primary.png'),
    disabledSource: require('~src/assets/images/button-contacts-disabled.png'),
    route: Facade.route.Contacts,
  }
  const settingsButton = {
    enabledSource: require('~src/assets/images/button-settings-primary.png'),
    disabledSource: require('~src/assets/images/button-settings-disabled.png'),
    route: Facade.route.Settings,
  }
  const moreButton = {
    enabledSource: require('~src/assets/images/button-more-primary.png'),
    disabledSource: require('~src/assets/images/button-more-disabled.png'),
    route: Facade.route.More,
  }

  const TabButton = (props: {button: TabButtonContent}) => {
    return (
      <StyledTouchable
        underlayColor={'transparent'}
        height="100%"
        onPress={() => {
          controller.close()
          navigation.navigate(props.button.route.name)
        }}
        weight={1}
      >
        <ImageView
          m="auto"
          resizeMode="cover"
          source={
            state.routes[state.index].name === props.button.route.name
              ? props.button.enabledSource
              : props.button.disabledSource
          }
        />
      </StyledTouchable>
    )
  }

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
      // zIndex="0"
      height="100%"
      width="100%"
      justifyContent="flex-end"
      position="absolute"
      pointerEvents={'box-none'}
    >
      <QuickToolsMenu controller={controller} />
      <TabBarContainer
        height={Facade.app.footerHeight}
        width={Facade.app.windowWidth}
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
            <TabButton button={walletButton} />
            <TabButton button={contactsButton} />
            <StyledTouchable
              underlayColor={'transparent'}
              mx="6px"
              bottom="10px"
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
            </StyledTouchable>
            <TabButton button={settingsButton} />
            <TabButton button={moreButton} />
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

const StyledTouchable = styled.TouchableHighlight<
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
