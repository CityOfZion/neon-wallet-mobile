import {wallet} from '@cityofzion/neon-core'
import React, {useState} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import tailwind from 'tailwind-rn'

const NeonJSTest: React.FC<object> = () => {
  const [account, setAccount] = useState(new wallet.Account())

  async function createAccount() {
    const newAccount = new wallet.Account(
      wallet.generatePrivateKey()
    ) as wallet.Account
    setAccount(newAccount)
  }

  return (
    <View style={tailwind('h-full bg-white items-center justify-center')}>
      <TouchableHighlight
        onPress={() => createAccount()}
        style={[tailwind('mb-2'), styles.button]}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableHighlight>
      <Text>{account?.address ?? 'No Account'}</Text>
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

export default NeonJSTest
