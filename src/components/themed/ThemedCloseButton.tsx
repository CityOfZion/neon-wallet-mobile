import PropTypes from 'prop-types'
import React from 'react'
import {NativeSyntheticEvent, NativeTouchEvent} from 'react-native'

import {$} from '~/facade'
import ThemedButton from '~src/components/themed/ThemedButton'

interface Props {
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
}

const ThemedCloseButton: React.FC<Props> = (props) => {
  return (
    <ThemedButton
      onPress={props.onPress}
      srcIcon={require('~src/assets/images/close.png')}
      textColor={'text.0'}
      rounded={false}
      flat={true}
      contentStyle={{height: $.space(40)}}
    />
  )
}

ThemedCloseButton.propTypes = {
  onPress: PropTypes.func,
}

export default ThemedCloseButton
