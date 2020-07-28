import {StackHeaderTitleProps} from '@react-navigation/stack/lib/typescript/src/types'
import React from 'react'
import {Route} from 'react-native'

import {Facade} from '~src/app/Facade'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

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

const HeaderBar: React.FC<HeaderProps> = (
  headerProps: HeaderProps,
  // TODO: Remove in NW-216
  props?: StackHeaderTitleProps
) => {
  const params: HeaderCustomProps = headerProps.route?.params

  const getHeaderWidth = () => {
    const {windowWidth} = Facade.app

    if (Facade.utils.isIos) {
      return windowWidth - Facade.scale<number>(220)
    }

    return windowWidth - Facade.scale<number>(160)
  }

  const _renderTitle = () => {
    if (params && params?.headerTitle instanceof Function) {
      return params.headerTitle(headerProps)
    } else if (headerProps.title instanceof Function) {
      return headerProps.title(headerProps)
    }

    return (
      <TextView
        pt={2}
        mt={Facade.utils.isAndroid ? -2 : 0}
        textAlign="center"
        color="text.0"
        fontSize={Facade.scale(24)}
        allowFontScaling={true}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
        style={{
          includeFontPadding: false,
        }}
      >
        {params?.headerTitle ?? headerProps.title}
      </TextView>
    )
  }

  return (
    <LinearLayout
      height={Facade.app.headerHeight}
      width={getHeaderWidth()}
      orientation="horiz"
      alignItems={'center'}
      justifyContent={'center'}
      style={{alignSelf: 'center'}}
    >
      {headerProps.image && (
        <ImageView
          width={Facade.scale<number>(headerProps.iconWidth ?? 20)}
          mr={3}
          source={headerProps.image}
          resizeMode="contain"
        />
      )}

      {_renderTitle()}
    </LinearLayout>
  )
}

export default HeaderBar
