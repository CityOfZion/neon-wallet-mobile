import i18n from 'i18n-js'
import React from 'react'

import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export const PasteButton = (props: {onPress: () => Promise<void>}) => {
  return (
    <LinearLayout>
      <ButtonView onPress={props.onPress}>
        <LinearLayout orientation="horiz">
          <ImageView
            resizeMode="center"
            source={require('~/src/assets/images/icon-paste-green.png')}
          />

          <TextView
            style={{includeFontPadding: false}}
            ml={3}
            color={'primary'}
            fontFamily="semibold"
            fontSize={16}
            mr={6}
          >
            {i18n.t('components.inputTextWithValidation.paste')}
          </TextView>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}
