import Constants from 'expo-constants'
import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {LinearLayout} from '~src/styles/styled-components'

interface Props {
  onLayout?: (event: LayoutChangeEvent) => void
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onReachBottom?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollEventThrottle?: number
  children?: React.ReactNode | React.ReactNodeArray
  useHeaderPadding?: boolean
  useStatusBarPadding?: boolean
  useFooterPadding?: boolean
  autoScroll?: boolean
  alignX?: string
  alignY?: string
  padding?: number | string
  transparent?: boolean
  invertedGradient?: boolean
  solidColorBG?: boolean
}

const ScreenLayout: React.FC<Props> = (props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const headerHeight = props.useHeaderPadding ? Facade.app.headerHeight : 0
  const tabBarHeight = props.useFooterPadding ? Facade.app.footerHeight : 0
  const headerExtraHeight =
    props.useStatusBarPadding && Facade.utils.isAndroid
      ? Constants.statusBarHeight
      : 0

  return (
    <LinearGradient
      onLayout={props.onLayout}
      colors={
        props.transparent
          ? ['#00000000', '#00000000']
          : props.invertedGradient
          ? [theme.colors.background[9], theme.colors.background[14]]
          : props.solidColorBG
          ? [theme.colors.background[2], theme.colors.background[2]]
          : [theme.colors.background[14], theme.colors.background[2]]
      }
      start={[1, 0]}
      end={[1, 1]}
    >
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView
          scrollEnabled={props.autoScroll}
          scrollEventThrottle={props.scrollEventThrottle}
          onScroll={(e) => {
            const {nativeEvent} = e
            if (props.onScroll) props.onScroll(e)

            const isScrollReachedBottom =
              nativeEvent.layoutMeasurement.height +
                nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height

            if (isScrollReachedBottom && props.onReachBottom) {
              props.onReachBottom(e)
            }
          }}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          style={{
            marginTop: headerHeight + headerExtraHeight,
            marginBottom: tabBarHeight,
          }}
        >
          <LinearLayout
            alignItems={props.alignX}
            justifyContent={props.alignY}
            style={{padding: Facade.scale(props.padding ?? 10)}}
            position={'relative'}
            height={'100%'}
          >
            {props.children}
          </LinearLayout>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

ScreenLayout.propTypes = {
  onLayout: PropTypes.func,
  children: PropTypes.any,
  useHeaderPadding: PropTypes.bool,
  useStatusBarPadding: PropTypes.bool,
  useFooterPadding: PropTypes.bool,
  autoScroll: PropTypes.bool,
  alignX: PropTypes.string,
  alignY: PropTypes.string,
  padding: PropTypes.any,
  transparent: PropTypes.bool,
  invertedGradient: PropTypes.bool,
  solidColorBG: PropTypes.bool,
  onScroll: PropTypes.func,
  onReachBottom: PropTypes.func,
  scrollEventThrottle: PropTypes.number,
}

ScreenLayout.defaultProps = {
  useHeaderPadding: true,
  useStatusBarPadding: false,
  useFooterPadding: true,
  autoScroll: true,
  transparent: false,
  invertedGradient: false,
  solidColorBG: false,
}

export default ScreenLayout
