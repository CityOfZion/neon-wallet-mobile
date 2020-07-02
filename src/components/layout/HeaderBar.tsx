import {StackHeaderTitleProps} from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'
import {Route, View} from 'react-native'

import {HEADER_HEIGHT, WINDOW_WIDTH} from '~/constants'
import {
  DefaultTheme,
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
  theme?: DefaultTheme
  route?: Route
  onPressToClose?: () => void
}

const HeaderBar = (headerProps: HeaderProps, props: StackHeaderTitleProps) => {
  return (
    <LinearLayout
      height={HEADER_HEIGHT}
      width={WINDOW_WIDTH - normalize<number>(220)}
      orientation="horiz"
      alignItems="center"
      justifyContent={'center'}
    >
      {headerProps.showIcon && (
        <ImageView
          width={normalize<number>(headerProps.iconWidth ?? 20)}
          ml={-normalize<number>((headerProps.iconWidth ?? 20) + 9)}
          mr={3}
          source={headerProps.image}
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
  )
}

export default HeaderBar
