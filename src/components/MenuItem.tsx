import React from 'react'
import {TouchableHighlight} from 'react-native'
import {LayoutProps} from 'styled-system'

import i18n from '~src/i18n'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export enum ArrowDirection {
  NONE,
  RIGHT,
  DOWN,
}

export interface MenuItemProps {
  title: string
  subtitle?: string
  icon: any
  iconWidth?: number
  iconHeight?: number
  iconMarginRight?: number
  iconMarginLeft?: number
  arrowDirection: ArrowDirection
  onPress?: () => void
}

const MenuItem = (props: MenuItemProps) => {
  let arrowIcon = null
  let [arrowWidth, arrowHeight] = [0, 0]
  switch (props.arrowDirection) {
    case ArrowDirection.DOWN:
      arrowIcon = require('~/src/assets/images/icon-arrow-down-green.png')
      arrowWidth = 18
      arrowHeight = 12
      break
    case ArrowDirection.RIGHT:
      arrowIcon = require('~/src/assets/images/icon-arrow-right-green.png')
      arrowWidth = 12
      arrowHeight = 19
      break
  }

  return (
    <TouchableHighlight underlayColor="transparent">
      <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
        <LinearLayout
          alignItems="center"
          orientation="horiz"
          height={65}
          width="100%"
          pl={1}
        >
          <ImageView
            height={props.iconHeight}
            width={props.iconWidth}
            ml={props.iconMarginLeft}
            mr={props.iconMarginRight}
            source={props.icon}
          />
          <TextView color="white" fontSize={18} fontFamily="semibold">
            {props.title}
          </TextView>
          <LinearLayout weight={1} />
          <TextView fontSize={16} fontFamily="semibold" mr={3} color="#869ca5">
            {props.subtitle}
          </TextView>
          {arrowIcon && (
            <ImageView
              width={arrowWidth}
              height={arrowHeight}
              source={arrowIcon}
            />
          )}
        </LinearLayout>
        <LinearLayout height={1} backgroundColor="#667178" width="100%" />
      </LinearLayout>
    </TouchableHighlight>
  )
}

export default MenuItem
