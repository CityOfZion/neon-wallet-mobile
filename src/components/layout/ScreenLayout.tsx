import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {RootState} from '~src/store/reducers/root'
import {LinearLayout} from '~src/styles/styled-components'

interface Props {
  children?: any
  useHeaderPadding?: boolean
  useFooterPadding?: boolean
  autoScroll?: boolean
  alignX?: string
  alignY?: string
  padding?: number | string
}

const ScreenLayout: React.FC<Props> = (props) => {
  const headerHeight = props.useHeaderPadding ? Facade.app.headerHeight : 0
  const tabBarHeight = props.useFooterPadding ? Facade.app.footerHeight : 0
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

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
          style={{marginTop: headerHeight, marginBottom: tabBarHeight}}
        >
          <LinearLayout
            alignItems={props.alignX}
            justifyContent={props.alignY}
            style={{padding: Facade.space(props.padding ?? 10)}}
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
  useFooterPadding: PropTypes.bool,
  autoScroll: PropTypes.bool,
  alignX: PropTypes.string,
  alignY: PropTypes.string,
  padding: PropTypes.any,
}

ScreenLayout.defaultProps = {
  useHeaderPadding: true,
  useFooterPadding: true,
  autoScroll: true,
}

export default ScreenLayout
