import {LinearGradient} from 'expo-linear-gradient'
import React from 'react'
import {Text, StyleSheet} from 'react-native'
import {useSelector} from 'react-redux'

const OfflineBar = () => {
  const {isConnected} = useSelector((state: RootState) => state.network)

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 5,
    },
    text: {
      color: '#fff',
      alignSelf: 'center',
    },
  })

  return !isConnected ? (
    <LinearGradient
      style={styles.container}
      colors={['#4c669f', '#3b5998', '#192f6a']}
    >
      <Text style={styles.text}>You are offline!</Text>
    </LinearGradient>
  ) : (
    <></>
  )
}

export default OfflineBar
