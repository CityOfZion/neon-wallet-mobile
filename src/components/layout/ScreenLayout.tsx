import Constants from 'expo-constants'
import { LinearGradient } from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React from 'react'
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import OfflineBar from '~src/components/OfflineBar'
import { LinearLayout } from '~src/styles/styled-components'

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
  darkerSolidColorBG?: boolean
  hideOfflineBar?: boolean
}

const ScreenLayout: React.FC<Props> = props => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const headerHeight = props.useHeaderPadding ? applicationConfig.headerHeight : 0
  const tabBarHeight = props.useFooterPadding ? applicationConfig.footerHeight : 0
  const headerExtraHeight = props.useStatusBarPadding && UtilsHelper.isAndroid ? Constants.statusBarHeight : 0
  const { isConnected } = useSelector((state: RootState) => state.network)
  const chooseColorBG = () => {
    let color
    if (props.transparent) {
      color = ['#00000000', '#00000000']
    } else if (props.invertedGradient) {
      color = [theme.colors.background[9], theme.colors.background[18]]
    } else if (props.solidColorBG) {
      color = [theme.colors.background[2], theme.colors.background[2]]
    } else if (props.darkerSolidColorBG) {
      color = [theme.colors.background[14], theme.colors.background[14]]
    } else {
      color = [theme.colors.background[14], theme.colors.background[2]]
    }
    return color
  }
  return (
    <LinearGradient onLayout={props.onLayout} colors={chooseColorBG()} start={[1, 0]} end={[1, 1]}>
      <SafeAreaView style={{ height: '100%' }}>
        <ScrollView
          scrollEnabled={props.autoScroll}
          scrollEventThrottle={props.scrollEventThrottle}
          onScroll={e => {
            const { nativeEvent } = e
            if (props.onScroll) props.onScroll(e)

            const isScrollReachedBottom =
              nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height

            if (isScrollReachedBottom && props.onReachBottom) {
              props.onReachBottom(e)
            }
          }}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{
            marginTop: headerHeight + headerExtraHeight,
            marginBottom: tabBarHeight,
          }}
        >
          {!props.hideOfflineBar && <OfflineBar />}
          <LinearLayout
            alignItems={props.alignX}
            justifyContent={props.alignY}
            style={{
              padding: Normalize.scale(props.padding ?? 10),
              marginTop: !isConnected ? 45 : undefined,
            }}
            position="relative"
            height="100%"
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
  darkerSolidColorBG: PropTypes.bool,
  onScroll: PropTypes.func,
  onReachBottom: PropTypes.func,
  scrollEventThrottle: PropTypes.number,
  hideOfflineBar: PropTypes.bool,
}

ScreenLayout.defaultProps = {
  useHeaderPadding: true,
  useStatusBarPadding: false,
  useFooterPadding: true,
  autoScroll: true,
  transparent: false,
  invertedGradient: false,
  solidColorBG: false,
  darkerSolidColorBG: false,
  hideOfflineBar: false,
}

export default ScreenLayout
