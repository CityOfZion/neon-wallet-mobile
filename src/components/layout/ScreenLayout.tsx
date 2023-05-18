import { useNavigation, useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import i18n from 'i18n-js'
import React from 'react'
import { LayoutChangeEvent, RefreshControlProps, ScrollView, View, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { Bars } from './Bars'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { RootState } from '~/src/store/RootStore'
import { LinearLayoutProps } from '~/src/types/styled-components'
import { ButtonWithoutFeedbackView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
import { RouteName } from '~src/types/wrappers/route'

type Props = {
  onLayout?: (event: LayoutChangeEvent) => void
  children?: React.ReactNode[] | React.ReactNode
  withoutHeader?: boolean
  rightButton?: React.ReactNode
  hideBackButton?: boolean
  title?: string | React.ReactNode
  withoutScrollView?: boolean
  refreshControl?: React.ReactElement<RefreshControlProps, string | React.JSXElementConstructor<any>>
  contentStyle?: ViewStyle
  testID?: string
}

const Header = ({
  rightButton,
  hideBackButton = false,
  title,
}: Pick<Props, 'rightButton' | 'hideBackButton' | 'title'>) => {
  const route = useRoute()
  const navigation = useNavigation()

  const routeTitle = wrapper.route[route.name as RouteName].translate()
  const canGoBack = navigation.canGoBack()

  return (
    <LinearLayout
      alignItems="center"
      orientation="horiz"
      position="relative"
      style={{ height: applicationConfig.headerHeight }}
    >
      <TextView color="text.0" fontSize="22px" flex={1} textAlign="center">
        {title ?? routeTitle}
      </TextView>

      <LinearLayout position="absolute" left="0px">
        {!hideBackButton && canGoBack && (
          <ButtonWithoutFeedbackView onPress={navigation.goBack}>
            <LinearLayout orientation="horiz" alignItems="center" p="12px">
              <ImageView
                width={Normalize.scale(20)}
                height={Normalize.scale(20)}
                source={require('~src/assets/images/icon_arrow_left_white.png')}
                resizeMode="contain"
              />
              <TextView color="text.0" fontSize="18px" fontFamily="regular" alignSelf="center" ml="4px">
                {i18n.t('app.back')}
              </TextView>
            </LinearLayout>
          </ButtonWithoutFeedbackView>
        )}
      </LinearLayout>

      {rightButton && (
        <LinearLayout position="absolute" right="0px">
          {rightButton}
        </LinearLayout>
      )}
    </LinearLayout>
  )
}

const ScreenLayout = ({
  onLayout,
  children,
  withoutHeader = false,
  rightButton,
  refreshControl,
  hideBackButton,
  title,
  withoutScrollView = false,
  contentStyle,
  testID,
}: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const colors = [theme.colors.background[14], theme.colors.background[14]]

  return (
    <LinearGradient testID={testID} onLayout={onLayout} colors={colors} start={[1, 0]} end={[1, 1]}>
      <LinearLayout style={{ height: '100%' }}>
        <Bars colors={colors} />
        {!withoutHeader && <Header rightButton={rightButton} hideBackButton={hideBackButton} title={title} />}
        {!withoutScrollView ? (
          <ScrollView
            refreshControl={refreshControl}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: applicationConfig.footerHeight,
              padding: 20,
              ...contentStyle,
              flexGrow: 1,
            }}
          >
            {children}
          </ScrollView>
        ) : (
          <View
            style={{
              padding: 20,
              paddingBottom: applicationConfig.footerHeight,
              ...contentStyle,
              flexGrow: 1,
              flexShrink: 1,
            }}
          >
            {children}
          </View>
        )}
      </LinearLayout>
    </LinearGradient>
  )
}

export default ScreenLayout
