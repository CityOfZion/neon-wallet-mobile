import {wallet} from '@cityofzion/neon-core'
import {RouteProp, CommonActions} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {BarCodeEvent, BarCodeScanner} from 'expo-barcode-scanner'
import ExpoBarCodeScannerModule from 'expo-barcode-scanner/src/ExpoBarCodeScannerModule'
import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Animated} from 'react-native'

import {Facade} from '~src/app/Facade'
import {useSwiperController} from '~src/components/SwiperPanel'
import {NeoURI} from '~src/helpers/UriHelper'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import HandleQRModal from '~src/scenes/HandleQRModal'
import {
  ButtonView,
  ImageView,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

const {BarCodeType} = ExpoBarCodeScannerModule

export interface QRCodeScanParams {
  onScan?: (data: NeoURI | string) => void
}

export interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'QRCodeScan'>
}

const QRCodeScan = (props: Props) => {
  const controller = useSwiperController(false)
  const popupVisibility = useRef(new Animated.Value(0))
  const [hasPermission, setHasPermission] = useState(false)
  const [message, setMessage] = useState<string>()
  const [address, setAddress] = useState<string>()
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
          useNativeDriver: true,
        }),
        Animated.timing(popupVisibility.current, {
          toValue: 0,
          duration: 200,
          delay: 3000,
          useNativeDriver: true,
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

  const isValid = (key: string) =>
    wallet.isAddress(key) ||
    wallet.isNEP2(key) ||
    wallet.isWIF(key) ||
    Facade.uri.isValid(key)

  const goTo = (key: string): NavParam<RootStackParamList> | undefined => {
    if (wallet.isNEP2(key)) {
      return [
        Facade.route.Tab.name,
        {
          screen: Facade.route.More.name,
          params: {
            screen: Facade.route.Passphrase.name,
            initial: false,
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
            initial: false,
            params: {
              source: Facade.route.ImportKey.name,
              address: Facade.asteroid.generateNeoAccountFromWif(key).address,
              legacy: true,
            },
          },
        },
      ]
    } else if (Facade.uri.isValid(key)) {
      return [
        Facade.route.Modal.name,
        {
          screen: Facade.route.SendWalletSelectionModal.name,
          params: {
            uri: Facade.uri.parse(key),
          },
        },
      ]
    }
  }

  const handleBarCodeScanned = (evt: BarCodeEvent) => {
    if (!controller.isShowing) {
      if (isValid(evt.data)) {
        setMessage(Facade.t('screens.scanQrCode.success'))
        // If there's a callback, calls the callback and navigates back
        if (props.route.params?.onScan) {
          let data: NeoURI | string = evt.data

          if (Facade.uri.isValid(evt.data)) {
            data = Facade.uri.parse(evt.data) ?? evt.data
          }
          props.navigation.goBack()
          props.route.params.onScan(data)
        } else {
          // If scanned QR is an address, opens modal
          if (wallet.isAddress(evt.data)) {
            setAddress(evt.data)
            controller.open()
          } else {
            // Otherwise, navigates to corresponding page
            const destination = goTo(evt.data)
            props.navigation.pop(1)
            destination && props.navigation.navigate(...destination)
          }
        }
      } else {
        setMessage(Facade.t('screens.scanQrCode.tryAgain'))
      }
    }
  }

  const modalNavigate = (action: CommonActions.Action) => {
    controller.close()
    props.navigation.pop(1)
    props.navigation.dispatch(action)
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
        width="100%"
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
        onPress={props.navigation.goBack}
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

      <HandleQRModal
        controller={controller}
        address={address ?? ''}
        onClick={modalNavigate}
      />
    </RelativeLayout>
  )
}

export default QRCodeScan
