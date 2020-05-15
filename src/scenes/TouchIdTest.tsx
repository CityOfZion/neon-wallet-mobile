import * as LocalAuthentication from 'expo-local-authentication'
import React, {Component, useState} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import tailwind from 'tailwind-rn'

interface IProps {}

interface IState {
  authenticated: boolean
}

export class TouchIdTest extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      authenticated: false,
    }
  }

  async askForAuthentication() {
    const result = await LocalAuthentication.authenticateAsync()
    this.setState({authenticated: result.success})
  }

  public render() {
    return (
      <View style={tailwind('h-full bg-white items-center justify-center')}>
        <TouchableHighlight
          onPress={() => this.askForAuthentication()}
          style={[tailwind('mb-2'), this.styles.button]}
        >
          <Text style={this.styles.buttonText}>Ask for Authentication</Text>
        </TouchableHighlight>
        <Text>
          {this.state.authenticated ? 'Authenticated' : 'Not Authenticated'}
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
