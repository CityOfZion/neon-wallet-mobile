import React from 'react'
import {Text, StyleSheet, ScrollView, Image, View} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'

const OfflineBar = () => {
  const {isConnected} = useSelector((state: RootState) => state.network)
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 15,
      backgroundColor: theme.colors.background[12],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 99,
    },
    text: {
      color: '#fff',
      alignSelf: 'center',
    },
    textContainers: {
      flexDirection: 'column',
      marginLeft: 10,
    },
    title: {
      color: theme.colors.primary,
      fontSize: 10,
    },
  })

  return !isConnected ? (
    <View style={styles.container}>
      <Image source={require('~src/assets/images/no-internet-icon.png')} />
      <View style={styles.textContainers}>
        <Text style={styles.title}>WARNING</Text>
        <Text style={styles.text}>No internet connection</Text>
      </View>
    </View>
  ) : (
    <></>
  )
}

export default OfflineBar
