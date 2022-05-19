import i18n from 'i18n-js'
import React from 'react'
import {showMessage} from 'react-native-flash-message'
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'

import {UtilsHelper} from '../helpers/UtilsHelper'
import {ImageView, LinearLayout} from '../styles/styled-components'

type Props = {disabled?: boolean; text: string}

export const CopyButton = ({disabled, text}: Props) => {
  const handlePress = () => {
    UtilsHelper.copyToClipboard(text)
    showMessage({
      message: i18n.t('toast.copiedToClipboard'),
      type: 'success',
    })
  }

  return (
    <LinearLayout>
      <TouchableWithoutFeedback onPress={handlePress}>
        <ImageView
          resizeMode={'contain'}
          source={require('~/src/assets/images/icon-copy-green.png')}
          height={20}
          width={20}
          opacity={disabled ? 0.4 : 1}
        />
      </TouchableWithoutFeedback>
    </LinearLayout>
  )
}
