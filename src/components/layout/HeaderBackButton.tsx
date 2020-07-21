import {StackHeaderLeftButtonProps} from '@react-navigation/stack'
import React from 'react'
import {TouchableHighlight, View} from 'react-native'

import {Facade} from '~src/app/Facade'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

const HeaderBackButton = (props: StackHeaderLeftButtonProps) => {
  return (
    <View>
      {props.canGoBack && (
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={props.onPress}
        >
          <LinearLayout orientation={'horiz'} alignItems={'center'}>
            <ImageView
              ml={4}
              mr={3}
              source={require('~src/assets/images/icon_arrow_left_white.png')}
            />

            <TextView mt={2} fontSize={'lg'} color={'text.0'}>
              {Facade.t('app.back')}
            </TextView>
          </LinearLayout>
        </TouchableHighlight>
      )}
    </View>
  )
}

export default HeaderBackButton
