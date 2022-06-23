import { BlurView } from 'expo-blur'
import React, { ReactElement } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import * as Progress from 'react-native-progress'

import { TextView } from '~src/styles/styled-components'

const { width, height } = Dimensions.get('window')

type LoadingOverlayProps = {
  progress: number
  loadingText: ReactElement | string
}

const LoadingOverlay = ({ progress = 0.5, loadingText = 'Loading...' }: LoadingOverlayProps) => {
  return (
    <BlurView tint="dark" intensity={90} style={styles.container}>
      <TextView style={styles.loadingText}>{loadingText}</TextView>
      <Progress.Bar progress={progress} width={200} color="#4dffb3" />
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width,
    height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    color: '#fff',
    marginBottom: 24,
    fontSize: 18,
  },
})

export default LoadingOverlay
