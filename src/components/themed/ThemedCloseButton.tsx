import PropTypes from 'prop-types'
import React from 'react'
import {NativeSyntheticEvent, NativeTouchEvent} from 'react-native'

import ThemedButton from '~src/components/themed/ThemedButton'
import {normalize} from '~src/styles/styled-components'

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
      contentStyle={{height: normalize(40)}}
    />
  )
}

ThemedCloseButton.propTypes = {
  onPress: PropTypes.func,
}

export default ThemedCloseButton
