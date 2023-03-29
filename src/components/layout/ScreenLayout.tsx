import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo } from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControlProps,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { RootState } from '~/src/store/RootStore'
import { hasCustomSelector } from '~/src/store/settings/SettingsSelector'
import { LinearLayout } from '~src/styles/styled-components'

type PropsScrollable = {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onReachBottom?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollEventThrottle?: number
  autoScroll?: boolean
  scrollable?: true
  refreshControl?: React.ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>>
}

type PropsNoScrollable = {
  scrollable?: false
}
type Props = {
  onLayout?: (event: LayoutChangeEvent) => void
  children?: React.ReactNode[] | React.ReactNode
  useHeaderPadding?: boolean
  useFooterPadding?: boolean
  alignX?: string
  alignY?: string
  padding?: number | string
  transparent?: boolean
  invertedGradient?: boolean
  solidColorBG?: boolean
  darkerSolidColorBG?: boolean
} & (PropsScrollable | PropsNoScrollable)

const ScreenLayout = ({
  onLayout,
  children,
  useHeaderPadding = true,
  alignX,
  alignY,
  padding,
  transparent = false,
  invertedGradient = false,
  solidColorBG = false,
  darkerSolidColorBG = false,
  useFooterPadding = true,
  ...props
}: Props) => {
  props.scrollable = props.scrollable ?? true

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const hasCustom = useSelector(hasCustomSelector)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  const headerHeight = useHeaderPadding ? applicationConfig.headerHeight : 0
  const tabBarHeight = useFooterPadding ? applicationConfig.footerHeight - applicationConfig.footerOffset : 0

  const colors = useMemo(
    () =>
      transparent
        ? ['#00000000', '#00000000']
        : invertedGradient
        ? [theme.colors.background[9], theme.colors.background[18]]
        : solidColorBG
        ? [theme.colors.background[2], theme.colors.background[2]]
        : darkerSolidColorBG
        ? [theme.colors.background[14], theme.colors.background[14]]
        : [theme.colors.background[14], theme.colors.background[2]],
    [transparent, solidColorBG, darkerSolidColorBG, invertedGradient, theme]
  )

  useEffect(() => {
    if (hasCustom) {
      StatusBar.setBackgroundColor(theme.colors.black)
      return
    }

    if (!isConnected) {
      StatusBar.setBackgroundColor(theme.colors.background[12])
      return
    }

    StatusBar.setBackgroundColor(colors[0])
  }, [colors, hasCustom, isConnected])

  return (
    <LinearGradient onLayout={onLayout} colors={colors} start={[1, 0]} end={[1, 1]}>
      <SafeAreaView style={{ height: '100%' }}>
        {props.scrollable ? (
          <ScrollView
            refreshControl={props.refreshControl}
            scrollEnabled={props.autoScroll}
            scrollEventThrottle={props.scrollEventThrottle}
            onScroll={e => {
              const { nativeEvent } = e
              if (props.onScroll) {
                props.onScroll(e)
              }

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
              marginTop: headerHeight,
              marginBottom: tabBarHeight,
            }}
          >
            <LinearLayout
              alignItems={alignX}
              justifyContent={alignY}
              position="relative"
              height="100%"
              style={{
                padding: Normalize.scale(padding ?? 10),
              }}
            >
              {children}
            </LinearLayout>
          </ScrollView>
        ) : (
          <LinearLayout flex={1} mt={headerHeight} mb={tabBarHeight}>
            <LinearLayout
              alignItems={alignX}
              justifyContent={alignY}
              position="relative"
              height="100%"
              style={{
                padding: Normalize.scale(padding ?? 10),
              }}
            >
              {children}
            </LinearLayout>
          </LinearLayout>
        )}
      </SafeAreaView>
    </LinearGradient>
  )
}

export default ScreenLayout
