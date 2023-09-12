import Constants from 'expo-constants'
import * as SplashScreen from 'expo-splash-screen'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Animated, StyleSheet, ImageSourcePropType, ActivityIndicator } from 'react-native'

type Props = {
  image: ImageSourcePropType
}

const AnimatedSplashScreen: React.FC<Props> = ({ children, image }) => {
  const animation = useMemo(() => new Animated.Value(1), [])
  const [isAppReady, setAppReady] = useState(false)
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true))
    }
  }, [isAppReady])

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync()
    } finally {
      setAppReady(true)
    }
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: Constants.manifest?.splash?.backgroundColor }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest?.splash?.backgroundColor,
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: Constants.manifest?.splash?.resizeMode ?? 'contain',
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
      {!isAppReady && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            bottom: 100,
            left: 'auto',
            alignSelf: 'center',
          }}
          size="large"
          color={Constants.manifest?.primaryColor}
        />
      )}
    </View>
  )
}

export default AnimatedSplashScreen
