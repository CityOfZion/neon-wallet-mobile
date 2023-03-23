import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
const HeaderBackButton = (props: StackHeaderLeftButtonProps) => {
  return (
    <View>
      {props.canGoBack && (
        <TouchableOpacity onPress={props.onPress}>
          <LinearLayout orientation="horiz" alignItems="center">
            <ImageView ml="10px" mr="6px" source={require('~src/assets/images/icon_arrow_left_white.png')} />

            <TextView
              fontSize="18px"
              color="text.0"
              style={{
                includeFontPadding: false,
              }}
            >
              {i18n.t('app.back')}
            </TextView>
          </LinearLayout>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default HeaderBackButton
