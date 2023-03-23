import React from 'react'
import { Route } from 'react-native'

import { Normalize } from '~/src/app/Normalize'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
import { ApplicationTheme } from '~src/themes/ApplicationTheme'

export interface HeaderProps {
  title?: string | React.FC<HeaderProps> | Function
  image?: any
  iconWidth?: number
  theme?: ApplicationTheme
  route?: Route
}

export interface HeaderCustomProps {
  headerTitle?: string | React.FC<HeaderProps> | Function
}

const HeaderTitle = (props: HeaderProps) => {
  const params: HeaderCustomProps = props.route?.params

  if (params && params?.headerTitle instanceof Function) {
    return params.headerTitle(props)
  } else if (props.title instanceof Function) {
    return props.title(props)
  }

  return (
    <TextView
      textAlign="center"
      color="text.0"
      fontSize={Normalize.scale(24)}
      allowFontScaling
      adjustsFontSizeToFit
      numberOfLines={1}
      style={{
        includeFontPadding: false,
      }}
    >
      {params?.headerTitle ?? props.title}
    </TextView>
  )
}

const HeaderBar: React.FC<HeaderProps> = (headerProps: HeaderProps) => {
  return (
    <LinearLayout orientation="horiz" alignItems="center" justifyContent="center" style={{ alignSelf: 'center' }}>
      {headerProps.image && (
        <ImageView
          width={Normalize.scale<number>(headerProps.iconWidth ?? 20)}
          mr={3}
          source={headerProps.image}
          resizeMode="contain"
        />
      )}

      <HeaderTitle {...headerProps} />
    </LinearLayout>
  )
}

export default HeaderBar
