import * as LocalAuthentication from 'expo-local-authentication'
import React, {useState} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import tailwind from 'tailwind-rn'

const TouchIdTest: React.FC<object> = () => {
  const [authenticated, setAuthenticated] = useState(false)

  async function askForAuthentication() {
    const result = await LocalAuthentication.authenticateAsync()
    setAuthenticated(result.success)
  }

  return (
    <View style={tailwind('h-full bg-white items-center justify-center')}>
      <TouchableHighlight
        onPress={() => askForAuthentication()}
        style={[tailwind('mb-2'), styles.button]}
      >
        <Text style={styles.buttonText}>Ask for Authentication</Text>
      </TouchableHighlight>
      <Text>{authenticated ? 'Authenticated' : 'Not Authenticated'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: '#68a0cf',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
})

export default TouchIdTest
