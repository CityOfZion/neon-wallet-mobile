import {wallet} from '@cityofzion/neon-core'
import React, {useState} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import styled from 'styled-components/native'
import {color, ColorProps} from 'styled-system'

const NeonJSTest: React.FC<object> = () => {
  const [account, setAccount] = useState(new wallet.Account())

  async function createAccount() {
    const newAccount = new wallet.Account(
      wallet.generatePrivateKey()
    ) as wallet.Account
    setAccount(newAccount)
  }

  return (
    <NeonJSView>
      <TouchableHighlight
        onPress={() => createAccount()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableHighlight>
      <Text>{account?.address ?? 'No Account'}</Text>
    </NeonJSView>
  )
}

const NeonJSView = styled.View<ColorProps>`
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

export default NeonJSTest
