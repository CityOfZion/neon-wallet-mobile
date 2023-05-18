import React from 'react'
import { TouchableOpacity } from 'react-native'

import { Normalize } from '~src/app/Normalize'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export enum RightIconType {
  NONE,
  ARROW_RIGHT,
  ARROW_DOWN,
  CHECK,
}

export interface MenuItemProps {
  title: string
  subtitle?: string
  icon?: any
  iconWidth?: number
  iconHeight?: number
  iconMarginRight?: number
  iconMarginLeft?: number
  arrowDirection: RightIconType
  onPress?: () => void
  testID?: string
}

const MenuItem = (props: MenuItemProps) => {
  let arrowIcon = null
  let [rightIconWidth, rightIconHeight, rightIconRightMargin, rightIconTopMargin] = [0, 0, 0, 0]
  switch (props.arrowDirection) {
    case RightIconType.ARROW_DOWN:
      arrowIcon = require('~/src/assets/images/icon-arrow-down-green.png')
      rightIconWidth = 18
      rightIconHeight = 12
      break
    case RightIconType.ARROW_RIGHT:
      arrowIcon = require('~/src/assets/images/icon-arrow-right-green.png')
      rightIconWidth = 12
      rightIconHeight = 19
      break
    case RightIconType.CHECK:
      arrowIcon = require('~/src/assets/images/icon-check-green.png')
      rightIconWidth = 23
      rightIconHeight = 17
      rightIconRightMargin = 3
      rightIconTopMargin = 2
      break
  }

  return (
    <TouchableOpacity testID={props.testID} onPress={props.onPress}>
      <LinearLayout orientation="verti" width="100%">
        <LinearLayout
          alignItems="center"
          orientation="horiz"
          height={Normalize.scale(65)}
          width="100%"
          pl={Normalize.scale(1)}
        >
          {props.icon && (
            <ImageView
              height={props.iconHeight}
              width={props.iconWidth}
              ml={props.iconMarginLeft}
              mr={props.iconMarginRight}
              source={props.icon}
              resizeMode="contain"
            />
          )}

          <TextView
            weight={1}
            color="text.0"
            fontSize="lg"
            fontFamily="regular"
            allowFontScaling
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {props.title}
          </TextView>

          <TextView fontSize="md" fontFamily="bold" color="#869ca5">
            {props.subtitle}
          </TextView>
          {arrowIcon && (
            <ImageView
              width={rightIconWidth}
              height={rightIconHeight}
              mr={rightIconRightMargin}
              ml="18px"
              mt={rightIconTopMargin}
              source={arrowIcon}
            />
          )}
        </LinearLayout>
        <LinearLayout height={1} bg="background.10" alignSelf="stretch" />
      </LinearLayout>
    </TouchableOpacity>
  )
}

export default MenuItem
