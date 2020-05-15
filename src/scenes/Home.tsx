import {StackNavigationProp} from '@react-navigation/stack'
import React, {Component} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import tailwind from 'tailwind-rn'

type HomeStackParametersList = {
  TouchIdTest: undefined
  PageTwo: undefined
}

interface Props {
  navigation: StackNavigationProp<HomeStackParametersList>
}

export class Home extends Component<Props> {
  public render() {
    return (
      <View style={tailwind('h-full bg-white items-center justify-center')}>
        <Text style={tailwind('text-lg mb-4')}>This is the Home</Text>
        <TouchableHighlight
          style={[tailwind('mb-2'), this.styles.button]}
          onPress={() => this.props.navigation.navigate('TouchIdTest')}
        >
          <Text style={this.styles.buttonText}>Go to TouchIdTest</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[tailwind('mb-2'), this.styles.button]}
          onPress={() => this.props.navigation.navigate('PageTwo')}
        >
          <Text style={this.styles.buttonText}>Go to PageTwo</Text>
        </TouchableHighlight>
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
