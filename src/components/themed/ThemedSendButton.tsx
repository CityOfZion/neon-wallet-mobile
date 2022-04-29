import PropTypes from 'prop-types'
import React, {useEffect} from 'react'
import {StyleSheet, GestureResponderEvent, Dimensions} from 'react-native'
import {useSelector} from 'react-redux'

import ThemedButton from './ThemedButton'

import {LinearLayout, RelativeLayout} from '~/src/styles/styled-components'
import {Account} from '~src/models/redux/Account'
interface Props {
  account?: Account
  onPress?: (evt: GestureResponderEvent) => void
  isDark?: boolean
}

const ThemedSendButton: React.FC<Props> = (props) => {
  const isWatchAccount = props.account?.accountType === 'watch'
  const isNotEmpty = props.account?.hasFunds
  const {isConnected} = useSelector((state: RootState) => state.network)
  const styles = StyleSheet.create({
    dropShadow: {
      alignItems: 'center',
      justifyContent: 'center',
      width: Dimensions.get('window').width * 0.19,
      height: 45,
      borderRadius: 7,
      shadowColor: '#464d53',
      shadowOffset: {
        width: 12,
        height: 12,
      },
      shadowRadius: 7,
      elevation: 30,
    },
  })

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
}

export {ThemedSendButton}
