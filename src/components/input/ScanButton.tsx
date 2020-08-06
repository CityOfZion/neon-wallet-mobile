import React from 'react'

import {Facade} from '~src/app/Facade'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export const ScanButton = (props: {onPress: () => any}) => {
  return (
    <LinearLayout>
      <ButtonView onPress={props.onPress}>
        <LinearLayout orientation="horiz">
          <ImageView
            resizeMode="center"
            source={require('~/src/assets/images/icon-qrcode-green.png')}
          />

          <TextView
            style={{includeFontPadding: false}}
            ml={3}
            color={'primary'}
            fontFamily="semibold"
            fontSize={16}
          >
            {Facade.t('components.inputTextWithValidation.scan')}
          </TextView>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}
