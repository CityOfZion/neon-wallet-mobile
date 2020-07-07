import {StackHeaderTitleProps} from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'
import {Route} from 'react-native'

import {$} from '~/facade'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface HeaderProps {
  title?: string
  image?: any
  showIcon?: boolean
  iconWidth?: number
  theme?: DefaultTheme
  route?: Route
  onPressToClose?: () => void
}

const HeaderBar = (headerProps: HeaderProps, props: StackHeaderTitleProps) => {
  return (
    <LinearLayout
      height={$.app.headerHeight}
      width={$.app.windowWidth - $.space<number>(220)}
      orientation="horiz"
      alignItems="center"
      justifyContent={'center'}
    >
      {headerProps.showIcon && (
        <ImageView
          width={$.space<number>(headerProps.iconWidth ?? 20)}
          ml={-$.space<number>((headerProps.iconWidth ?? 20) + 9)}
          mr={3}
          source={headerProps.image}
          resizeMode="contain"
        />
      )}

      <TextView
        pt={2}
        textAlign="center"
        color="text.0"
        fontSize={$.space(24)}
        allowFontScaling={true}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        style={{includeFontPadding: false}}
      >
        {headerProps.title}
      </TextView>
    </LinearLayout>
  )
}

export default HeaderBar
