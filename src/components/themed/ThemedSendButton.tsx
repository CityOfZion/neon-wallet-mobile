import React from 'react'
import { Dimensions } from 'react-native'
import { useSelector } from 'react-redux'

import ThemedButton from './ThemedButton'

import { RootState } from '~/src/store/RootStore'
interface Props {
  isInactive?: boolean
  onPress?: () => void
  isDark?: boolean
}

const ThemedSendButton = ({ isInactive = false, isDark, onPress }: Props) => {
  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  const handlePress = () => {
    if (!onPress || isInactive || !isConnected) return

    onPress()
  }

  return (
    <ThemedButton
      height={45}
      srcIcon={
        !isInactive && isConnected
          ? require('~src/assets/images/arrow-up-green.png')
          : require('~src/assets/images/arrow-gray.png')
      }
      width={Dimensions.get('window').width * 0.15}
      onPress={handlePress}
      isDark={isDark}
    />
  )
}

export { ThemedSendButton }
