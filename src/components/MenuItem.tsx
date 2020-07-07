import React from 'react'
import {TouchableHighlight} from 'react-native'

import {$} from '~/facade'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

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
}

const MenuItem = (props: MenuItemProps) => {
  let arrowIcon = null
  let [
    rightIconWidth,
    rightIconHeight,
    rightIconRightMargin,
    rightIconTopMargin,
  ] = [0, 0, 0, 0]
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
    <TouchableHighlight underlayColor="transparent" onPress={props.onPress}>
      <LinearLayout orientation="verti" width="100%">
        <LinearLayout
          alignItems="center"
          orientation="horiz"
          height={$.space(65)}
          width="100%"
          pl={$.space(1)}
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
          <TextView color="white" fontSize={'lg'} fontFamily="semibold">
            {props.title}
          </TextView>
          <LinearLayout weight={1} />
          <TextView
            fontSize={'md'}
            fontFamily="semibold"
            mr={$.space(3)}
            color="#869ca5"
          >
            {props.subtitle}
          </TextView>
          {arrowIcon && (
            <ImageView
              width={rightIconWidth}
              height={rightIconHeight}
              mr={rightIconRightMargin}
              mt={rightIconTopMargin}
              source={arrowIcon}
            />
          )}
        </LinearLayout>
        <LinearLayout
          height={1}
          backgroundColor="#667178"
          alignSelf="stretch"
        />
      </LinearLayout>
    </TouchableHighlight>
  )
}

export default MenuItem
