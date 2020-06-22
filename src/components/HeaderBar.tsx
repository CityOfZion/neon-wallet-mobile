import React from 'react'

import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface HeaderProps {
  title: string
  image: any
  showIcon: boolean
  iconMarginRight: number
  iconMarginTop: number
  iconWidth: number
}

const HeaderBar = (headerProps: HeaderProps) => {
  const marginRight = headerProps.showIcon ? '32px' : '0px'
  return (
    <LinearLayout alignItems="center" mr={marginRight}>
      <LinearLayout height="38" orientation="horiz" alignItems="center">
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
    </LinearLayout>
  )
}

export default HeaderBar
