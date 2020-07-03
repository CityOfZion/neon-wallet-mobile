import React from 'react'
import {TouchableHighlight} from 'react-native'

import {HEADER_HEIGHT, WINDOW_WIDTH} from '~/constants'
import {
  ImageView,
  LinearLayout,
  normalize,
  TextView,
} from '~src/styles/styled-components'

export interface HeaderProps {
  title?: string
  image?: any
  showIcon?: boolean
  iconWidth?: number
  onPressToClose?: () => void
}

const HeaderBar = (headerProps: HeaderProps) => {
  const marginRight = headerProps.showIcon ? '3%' : 0
  const marginLeft = headerProps.onPressToClose ? '3%' : 0

  return (
    <LinearLayout orientation="horiz" height={HEADER_HEIGHT}>
      <LinearLayout weight={1} ml={marginLeft} />

      <LinearLayout
        width={WINDOW_WIDTH - 220}
        orientation="horiz"
        alignItems="center"
        justifyContent={'center'}
      >
        {headerProps.showIcon && (
          <ImageView
            source={headerProps.image}
            width={normalize(headerProps.iconWidth ?? 20) as number}
            mr={3}
            resizeMode="contain"
          />
        )}

        <TextView
          pt={2}
          textAlign="center"
          color="text.0"
          fontSize={normalize(24)}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={{includeFontPadding: false}}
        >
          {headerProps.title}
        </TextView>
      </LinearLayout>

      <LinearLayout weight={1} mr={marginRight} />

      {headerProps.onPressToClose && (
        <TouchableHighlight onPress={headerProps.onPressToClose}>
          <ImageView
            source={require('~/src/assets/images/close.png')}
            resizeMode="center"
            weight={1}
            pr={40}
          />
        </TouchableHighlight>
      )}
    </LinearLayout>
  )
}

export default HeaderBar
