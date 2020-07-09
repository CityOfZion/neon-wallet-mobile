import PropTypes from 'prop-types'
import React from 'react'
import {NativeSyntheticEvent, NativeTouchEvent} from 'react-native'

import {Facade} from '~src/app/Facade'
import ThemedButton from '~src/components/themed/ThemedButton'

interface Props {
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
}

const ThemedAddButton: React.FC<Props> = (props) => {
  return (
    <ThemedButton
      onPress={props.onPress}
      srcIcon={require('~src/assets/images/icon-plus-white.png')}
      textColor={'text.0'}
      rounded={false}
      flat={true}
      contentStyle={{height: Facade.space(40)}}
    />
  )
}

ThemedAddButton.propTypes = {
  onPress: PropTypes.func,
}

export default ThemedAddButton
