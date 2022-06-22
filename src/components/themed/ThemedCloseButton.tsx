import PropTypes from 'prop-types'
import React from 'react'
import { NativeSyntheticEvent, NativeTouchEvent } from 'react-native'

import { Normalize } from '~/src/app/Normalize'
import ThemedButton from '~src/components/themed/ThemedButton'

interface Props {
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
  iconSize?: [number, number]
}

const ThemedCloseButton: React.FC<Props> = props => {
  return (
    <ThemedButton
      iconSize={props.iconSize}
      onPress={props.onPress}
      srcIcon={require('~src/assets/images/button_close_white.png')}
      textColor="text.0"
      rounded={false}
      flat
      contentStyle={{ height: Normalize.scale(40) }}
    />
  )
}

ThemedCloseButton.propTypes = {
  onPress: PropTypes.func,
  iconSize: PropTypes.any,
}

export default ThemedCloseButton
