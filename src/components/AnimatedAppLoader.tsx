import AppLoading from 'expo-app-loading'
import { Asset } from 'expo-asset'
import React, { useCallback, useState } from 'react'
import { ImageSourcePropType } from 'react-native'

import AnimatedSplashScreen from './AnimatedSplashScreen'

import { useBeforeStartApp } from '~src/hooks/useBeforeStartApp'

type Props = {
  image: ImageSourcePropType
}

const AnimatedAppLoader: React.FC<Props> = ({ children, image }) => {
  const started = useBeforeStartApp()
  const [isSplashReady, setSplashReady] = useState(false)

  const startAsync = useCallback(
    // If you use a local image with require(...), use `Asset.fromModule`
    () => Asset.fromModule(image.toString()).downloadAsync(),
    [image]
  )

  const onFinish = useCallback(() => setSplashReady(true), [])

  if (!isSplashReady && !started) {
    return (
      <AppLoading
        autoHideSplash={false}
        startAsync={async () => {
          startAsync()
        }}
        onError={console.error}
        onFinish={onFinish}
      />
    )
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
}
export default AnimatedAppLoader
