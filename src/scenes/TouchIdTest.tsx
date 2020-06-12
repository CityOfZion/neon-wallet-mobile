import * as LocalAuthentication from 'expo-local-authentication'
import React, {useState} from 'react'
import {StyleSheet, Text, TouchableHighlight} from 'react-native'
import styled from 'styled-components/native'
import {color, ColorProps} from 'styled-system'

const TouchIdTest: React.FC<object> = () => {
  const [authenticated, setAuthenticated] = useState(false)

  async function askForAuthentication() {
    const result = await LocalAuthentication.authenticateAsync()
    setAuthenticated(result.success)
  }

  return (
    <TouchIdTestView bg="background">
      <TouchableHighlight
        onPress={() => askForAuthentication()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Ask for Authentication</Text>
      </TouchableHighlight>
      <Text>{authenticated ? 'Authenticated' : 'Not Authenticated'}</Text>
    </TouchIdTestView>
  )
}

const TouchIdTestView = styled.View<ColorProps>`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${color}
`

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
