import {StackHeaderLeftButtonProps} from '@react-navigation/stack'
import React from 'react'
import {TouchableOpacity, View} from 'react-native'

import {Facade} from '~src/app/Facade'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

const HeaderBackButton = (props: StackHeaderLeftButtonProps) => {
  return (
    <View>
      {props.canGoBack && (
        <TouchableOpacity onPress={props.onPress}>
          <LinearLayout orientation={'horiz'} alignItems={'center'}>
            <ImageView
              ml={4}
              mr={3}
              source={require('~src/assets/images/icon_arrow_left_white.png')}
            />

            <TextView
              mt={Facade.utils.isAndroid ? -2 : 2}
              fontSize={18}
              color={'text.0'}
              style={{
                includeFontPadding: false,
              }}
            >
              {Facade.t('app.back')}
            </TextView>
          </LinearLayout>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default HeaderBackButton
