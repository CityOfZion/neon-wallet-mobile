import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {RootState} from '~src/store/reducers/root'
import {
  LinearLayout,
  normalize,
  RelativeLayout,
} from '~src/styles/styled-components'

interface Props {
  children?: any
  useHeaderPadding?: boolean
  autoScroll?: boolean
  alignX?: string
  alignY?: string
  padding?: number | string
}

const ScreenLayout: React.FC<Props> = (props) => {
  const headerHeight = props.useHeaderPadding ? 40 : 0
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
          contentContainerStyle={{flexGrow: 1}}
        >
          <LinearLayout style={{paddingTop: headerHeight}} height={'100%'}>
            <LinearLayout
              alignItems={props.alignX}
              justifyContent={props.alignY}
              style={{padding: normalize(props.padding ?? 10)}}
              position={'relative'}
              height={'100%'}
            >
              {props.children}
            </LinearLayout>
          </LinearLayout>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

ScreenLayout.propTypes = {
  children: PropTypes.any,
  useHeaderPadding: PropTypes.bool,
  autoScroll: PropTypes.bool,
  alignX: PropTypes.string,
  alignY: PropTypes.string,
  padding: PropTypes.any,
}

ScreenLayout.defaultProps = {
  useHeaderPadding: true,
  autoScroll: true,
}

export default ScreenLayout
