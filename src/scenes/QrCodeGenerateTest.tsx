import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native'
// TODO: define a typed module for this dependency
// @ts-ignore
import {QRCode} from 'react-native-custom-qr-codes-expo'

const DismissKeyboard: React.FC<{children: React.ReactNode}> = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

const QrCodeGenerateTest: React.FC<object> = () => {
  const [inputValue, setInputValue] = useState('')
  const [showQrCode, setShowQrCode] = useState(false)
  const [valueForQr, setValueForQr] = useState('default')

  function getTextInputValue() {
    const showQr = inputValue.length > 0

    if (showQr) {
      setValueForQr(inputValue)
      Keyboard.dismiss()
    }
    setShowQrCode(showQr)
  }

  return (
    <DismissKeyboard>
      <View style={styles.MainContainer}>
        {showQrCode && (
          <QRCode
            content={valueForQr}
            size={250}
            bgColor="#000"
            fgColor="#fff"
            logoSize={50}
            logo={require('~src/assets/images/neo-icon.png')}
          />
        )}

        <TextInput
          // Input to get the value to set on QRCode
          style={styles.TextInputStyle}
          onChangeText={(text) => setInputValue(text)}
          underlineColorAndroid="transparent"
          placeholder="Enter text to Generate QR Code"
        />

        <TouchableOpacity
          onPress={getTextInputValue}
          activeOpacity={0.7}
          style={styles.button}
        >
          <Text style={styles.TextStyle}> Generate QR Code </Text>
        </TouchableOpacity>
      </View>
    </DismissKeyboard>
  )
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

export default QrCodeGenerateTest
