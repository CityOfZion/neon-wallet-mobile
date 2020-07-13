import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {LinearLayout} from '~src/styles/styled-components'

interface Props {
  children?: React.ReactNode | React.ReactNodeArray
  useHeaderPadding?: boolean
  useHeaderExtraPadding?: boolean
  useFooterPadding?: boolean
  autoScroll?: boolean
  alignX?: string
  alignY?: string
  padding?: number | string
}

const ScreenLayout: React.FC<Props> = (props) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])

  const headerHeight = props.useHeaderPadding ? Facade.app.headerHeight : 0
  const tabBarHeight = props.useFooterPadding ? Facade.app.footerHeight : 0
  const headerExtraHeight =
    props.useHeaderExtraPadding && Facade.utils.isAndroid ? 32 : 0

  return (
    <LinearGradient
      colors={[theme.colors.background[1], theme.colors.background[2]]}
      start={[1, 0]}
      end={[1, 1]}
    >
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView
          scrollEnabled={props.autoScroll}
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
  children: PropTypes.any,
  useHeaderPadding: PropTypes.bool,
  useHeaderExtraPadding: PropTypes.bool,
  useFooterPadding: PropTypes.bool,
  autoScroll: PropTypes.bool,
  alignX: PropTypes.string,
  alignY: PropTypes.string,
  padding: PropTypes.any,
}

ScreenLayout.defaultProps = {
  useHeaderPadding: true,
  useHeaderExtraPadding: false,
  useFooterPadding: true,
  autoScroll: true,
}

export default ScreenLayout
