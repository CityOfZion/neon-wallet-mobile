import React, {Component} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'

type HomeStackParametersList = {
  PageOne: undefined
  PageTwo: undefined
}

interface Props {
  navigation: StackNavigationProp<HomeStackParametersList>
}

export class Home extends Component<Props> {
  public render() {
    return (
      <View style={this.styles.container}>
        <Text>This is the Home</Text>
        <TouchableHighlight onPress={() => this.props.navigation.navigate('PageOne')}>
          <Text>Go to PageOne</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.props.navigation.navigate('PageTwo')}>
          <Text>Go to PageTwo</Text>
        </TouchableHighlight>
      </View>
    )
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
}
