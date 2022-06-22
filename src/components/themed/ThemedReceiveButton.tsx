import PropTypes from 'prop-types'
import React from 'react'
import { GestureResponderEvent, Dimensions } from 'react-native'

import ThemedButton from './ThemedButton'

interface Props {
  onPress: (evt: GestureResponderEvent) => void
  isDark?: boolean
}

const ThemedReceiveButton: React.FC<Props> = props => {
  return (
    <ThemedButton
      height={45}
      srcIcon={require('~src/assets/images/arrow-down-green.png')}
      onPress={props.onPress}
      width={Dimensions.get('window').width * 0.15}
      isDark={props.isDark}
    />
  )
}

ThemedReceiveButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  isDark: PropTypes.bool,
}

export { ThemedReceiveButton }
