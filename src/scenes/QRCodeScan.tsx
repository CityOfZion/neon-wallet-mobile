import {wallet} from '@cityofzion/neon-core'
import {StackNavigationProp} from '@react-navigation/stack'
import {BarCodeEvent, BarCodeScanner} from 'expo-barcode-scanner'
import ExpoBarCodeScannerModule from 'expo-barcode-scanner/src/ExpoBarCodeScannerModule'
import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Animated} from 'react-native'

import {Facade} from '~src/app/Facade'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {
  ButtonView,
  ImageView,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

const {BarCodeType} = ExpoBarCodeScannerModule

export interface Props {
  navigation: StackNavigationProp<RootStackParamList & TabStackParamList>
}

const QRCodeScan = (props: Props) => {
  const popupVisibility = useRef(new Animated.Value(0))
  const [hasPermission, setHasPermission] = useState(false)
  const [message, setMessage] = useState<string>()
  useEffect(() => {
    getScanPermission()
  }, [hasPermission])

  useEffect(() => {
    showMessage()
  }, [message])

  const showMessage = () => {
    if (message) {
      Animated.sequence([
        Animated.timing(popupVisibility.current, {
          toValue: 1,
          duration: 200,
        }),
        Animated.timing(popupVisibility.current, {
          toValue: 0,
          duration: 200,
          delay: 3000,
        }),
      ]).start(() => setMessage(undefined))
    }
  }

  const getScanPermission = async () => {
    let granted = (await BarCodeScanner.getPermissionsAsync()).granted

    if (!granted) {
      setMessage(Facade.t('screens.scanQrCode.requesting'))

      granted = (await BarCodeScanner.requestPermissionsAsync()).granted

      if (!granted) {
        setMessage(Facade.t('screens.scanQrCode.noAccess'))
      }
    }

    setHasPermission(granted)
  }

  const goTo = (
    key: string
  ): NavParam<RootStackParamList & TabStackParamList> | undefined => {
    if (wallet.isAddress(key)) {
      return [
        Facade.route.Tab.name,
        {
          screen: Facade.route.More.name,
          params: {
            screen: Facade.route.ImportReadAccount.name,
            params: {
              address: key,
            },
          },
        },
      ]
    } else if (wallet.isNEP2(key)) {
      return [
        Facade.route.Tab.name,
        {
          screen: Facade.route.More.name,
          params: {
            screen: Facade.route.Passphrase.name,
            params: {
              encryptedKey: key,
            },
          },
        },
      ]
    } else if (wallet.isWIF(key)) {
      return [
        Facade.route.Tab.name,
        {
          screen: Facade.route.More.name,
          params: {
            screen: Facade.route.CustomizeAccount.name,
            params: {
              wif: key,
            },
          },
        },
      ]
    }
  }

  const handleBarCodeScanned = (evt: BarCodeEvent) => {
    console.log(evt.data)

    const destination = goTo(evt.data)

    if (destination) {
      setMessage(Facade.t('screens.scanQrCode.success'))
      props.navigation.navigate(...destination)
    } else {
      setMessage('Try again.')
    }
  }

  return (
    <RelativeLayout
      bg="background.12"
      alignItems={'center'}
      justifyContent={'center'}
      height="100%"
    >
      <BarCodeScanner
        barCodeTypes={[BarCodeType.qr]}
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <ImageView
        width="50%"
        resizeMode="contain"
        source={require('~src/assets/images/qr-code-frame.png')}
      />

      <ButtonView
        position="absolute"
        bottom={0}
        width={'100%'}
        height="70px"
        borderTopLeftRadius="30px"
        borderTopRightRadius="30px"
        bg="background.9"
        alignItems={'center'}
        justifyContent={'center'}
        onPress={() => props.navigation.goBack()}
      >
        <TextView fontSize="22px" color="primary" fontFamily="regular">
          {Facade.t('screens.scanQrCode.cancel')}
        </TextView>
      </ButtonView>

      <Animated.View
        style={{
          opacity: popupVisibility.current,
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextView
          bg="white"
          textAlign="center"
          p="20px"
          borderRadius="30px"
          fontSize="20px"
        >
          {message}
        </TextView>
      </Animated.View>
    </RelativeLayout>
  )
}

export default QRCodeScan
