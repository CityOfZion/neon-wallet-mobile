import {wallet} from '@cityofzion/neon-core'
import React, {Component} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import tailwind from 'tailwind-rn'

interface IProps {}

interface IState {
  account: wallet.Account | null
}

export class NeonJSTest extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      account: null,
    }
  }

  async createAccount() {
    const account = new wallet.Account(wallet.generatePrivateKey())
    this.setState({account})
  }

  public render() {
    return (
      <View style={tailwind('h-full bg-white items-center justify-center')}>
        <TouchableHighlight
          onPress={() => this.createAccount()}
          style={[tailwind('mb-2'), this.styles.button]}
        >
          <Text style={this.styles.buttonText}>Create Account</Text>
        </TouchableHighlight>
        <Text>
          {this.state.account?.address ?? 'No Account'}
        </Text>
      </View>
    )
  }

  styles = StyleSheet.create({
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
}
