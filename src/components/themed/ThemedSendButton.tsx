import PropTypes from 'prop-types'
import React from 'react'
import { GestureResponderEvent, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'

import ThemedButton from './ThemedButton'

import { Account } from '~src/models/redux/Account'
interface Props {
  account?: Account
  onPress?: (evt: GestureResponderEvent) => void
  isDark?: boolean
}

const ThemedSendButton: React.FC<Props> = props => {
  const isWatchAccount = props.account?.accountType === 'watch'
  const isNotEmpty = props.account?.hasFunds
  const { isConnected } = useSelector((state: RootState) => state.network)

  return (
    <ThemedButton
      height={45}
      srcIcon={
        isNotEmpty && !isWatchAccount && isConnected
          ? require('~src/assets/images/arrow-up-green.png')
          : require('~src/assets/images/arrow-gray.png')
      }
      width={Dimensions.get('window').width * 0.15}
      onPress={props.onPress}
      isDark={props.isDark}
    />
  )
}

ThemedSendButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  account: PropTypes.any,
  isDark: PropTypes.bool,
}

export { ThemedSendButton }
