import PropTypes from 'prop-types'
import React from 'react'
import {NativeSyntheticEvent, NativeTouchEvent} from 'react-native'

import {Normalize} from '~/src/app/Normalize'
import ThemedButton from '~src/components/themed/ThemedButton'

interface Props {
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
}

const ThemedMoreButton: React.FC<Props> = (props) => {
  return (
    <ThemedButton
      onPress={props.onPress}
      srcIcon={require('~src/assets/images/more-horiz.png')}
      iconSize={[24, 24]}
      textColor={'text.0'}
      rounded={false}
      flat={true}
      contentStyle={{height: Normalize.scale(40)}}
    />
  )
}

ThemedMoreButton.propTypes = {
  onPress: PropTypes.func,
}

export default ThemedMoreButton
