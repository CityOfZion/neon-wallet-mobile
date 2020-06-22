import React, {ReactComponentElement} from 'react'
import {Dimensions, TouchableHighlight} from 'react-native'

import {
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

export interface HeaderProps {
  title: string
  image: any
  showIcon: boolean
  iconMarginRight: number
  iconMarginTop: number
  iconWidth: number
  onPressToClose?: () => void
}

const HeaderBar = (headerProps: HeaderProps) => {
  const marginRight = headerProps.showIcon ? 32 : 0
  const marginLeft = headerProps.onPressToClose ? 40 : 0
  return (
    <LinearLayout orientation="horiz">
      <LinearLayout weight={1} ml={marginLeft} />
      <LinearLayout height={38} orientation="horiz" alignItems="center">
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
          fontFamily="semibold"
          color="white"
          fontSize={24}
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
