import PropTypes from 'prop-types'
import React from 'react'
import {StyleSheet, GestureResponderEvent, Dimensions} from 'react-native'

import ThemedButton from './ThemedButton'

import {LinearLayout, RelativeLayout} from '~/src/styles/styled-components'
interface Props {
  onPress: (evt: GestureResponderEvent) => void
}

const ThemedReceiveButton: React.FC<Props> = (props) => {
  const styles = StyleSheet.create({
    dropShadow: {
      alignItems: 'center',
      justifyContent: 'center',
      width: Dimensions.get('window').width * 0.19,
      height: 45,
      borderRadius: 7,
      elevation: 30,
    },
  })
  return (
    <ThemedButton
      height={45}
      srcIcon={require('~src/assets/images/arrow-down-green.png')}
      onPress={props.onPress}
      width={Dimensions.get('window').width * 0.15}
    />
  )
}

ThemedReceiveButton.propTypes = {
  onPress: PropTypes.func.isRequired,
}

export {ThemedReceiveButton}
