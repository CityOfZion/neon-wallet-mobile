import React from 'react'
import {TouchableHighlight} from 'react-native'

import {WINDOW_WIDTH} from '~/constants'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface HeaderProps {
  title?: string
  image?: any
  showIcon?: boolean
  iconMarginRight?: number
  iconMarginTop?: number
  iconWidth?: number
  onPressToClose?: () => void
}

const HeaderBar = (headerProps: HeaderProps) => {
  const marginRight = headerProps.showIcon ? '3%' : 0
  const marginLeft = headerProps.onPressToClose ? '3%' : 0

  return (
    <LinearLayout orientation="horiz">
      <LinearLayout weight={1} ml={marginLeft} />

      <LinearLayout
        height={38}
        width={WINDOW_WIDTH - 220}
        orientation="horiz"
        alignItems="center"
        justifyContent={'center'}
      >
        {headerProps.showIcon && (
          <ImageView
            source={headerProps.image}
            width={headerProps.iconWidth}
            mr={headerProps.iconMarginRight}
            mt={headerProps.iconMarginTop}
            resizeMode="center"
          />
        )}

        <TextView
          textAlign="center"
          color="text.0"
          fontSize={24}
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
