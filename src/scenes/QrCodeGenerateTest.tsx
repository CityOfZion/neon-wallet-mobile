import React, {Component, useState} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
import {QRCode} from 'react-native-custom-qr-codes-expo'

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

interface IProps {}

interface IState {
  inputValue: string
  valueForQRCode: string
  showQrCode: boolean
}

export class QrCodeGenerateTest extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      inputValue: '',
      valueForQRCode: 'default',
      showQrCode: false,
    }
  }

  getTextInputValue = () => {
    const showQr = this.state.inputValue.length > 0

    if (showQr) {
      this.setState({valueForQRCode: this.state.inputValue})
      Keyboard.dismiss()
    }

    this.setState({showQrCode: showQr})
  }

  render() {
    return (
      <DismissKeyboard>
        <View style={styles.MainContainer}>
          {this.state.showQrCode && (
            <QRCode
              content={this.state.valueForQRCode}
              size={250}
              bgColor="#000"
              fgColor="#fff"
              logoSize={50}
              logo={require('../image/neo-icon.png')}
            />
          )}

          <TextInput
            // Input to get the value to set on QRCode
            style={styles.TextInputStyle}
            onChangeText={(text) => this.setState({inputValue: text})}
            underlineColorAndroid="transparent"
            placeholder="Enter text to Generate QR Code"
          />

          <TouchableOpacity
            onPress={this.getTextInputValue}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.TextStyle}> Generate QR Code </Text>
          </TouchableOpacity>
        </View>
      </DismissKeyboard>
    )
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    paddingTop: 40,
  },

  TextInputStyle: {
    width: '100%',
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    textAlign: 'center',
  },

  button: {
    width: '100%',
    paddingTop: 8,
    marginTop: 10,
    paddingBottom: 8,
    backgroundColor: '#F44336',
    marginBottom: 20,
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
})
