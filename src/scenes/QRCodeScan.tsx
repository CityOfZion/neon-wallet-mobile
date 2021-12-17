import {RouteProp, CommonActions} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {BarCodeEvent, BarCodeScanner} from 'expo-barcode-scanner'
import ExpoBarCodeScannerModule from 'expo-barcode-scanner/src/ExpoBarCodeScannerModule'
import i18n from 'i18n-js'
import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, Animated} from 'react-native'

import {wrapper} from '~src/app/ApplicationWrapper'
import {
  blockchainServices,
  getBlockchainByWif,
  validateAddressAllBlockchains,
  validatePrivateKeyWithPasswordAllBlockchains,
  validateTextAllBlockchains,
  validateWifAllBlockchains,
} from '~src/blockchain'
import {useSwiperController} from '~src/components/SwiperPanel'
import {IURI, TScheme, UriHelper} from '~src/helpers/UriHelper'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import HandleQRModal from '~src/scenes/HandleQRModal'
import {
  ButtonView,
  ImageView,
  RelativeLayout,
  TextView,
  LinearLayout,
} from '~src/styles/styled-components'

const {BarCodeType} = ExpoBarCodeScannerModule

export interface QRCodeScanParams {
  onScan?: (data: IURI | string) => void
  address?: string
}

export interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'QRCodeScan'>
}

type INavigationScheme = Record<
  TScheme,
  (key: string) => NavParam<RootStackParamList> | undefined
>

const navigationScheme: INavigationScheme = {
  'neo:': (key) => {
    return [
      wrapper.route.Modal.name,
      {
        screen: wrapper.route.SendModalStack.name,
        params: {
          screen: wrapper.route.SendWalletSelectionModal.name,
          params: {
            uri: UriHelper.parse(key),
          },
        },
      },
    ]
  },
  'wc:': (key) => {
    return [
      wrapper.route.Modal.name,
      {
        screen: wrapper.route.WCConnectionRequestModal.name,
        params: {
          uri: key,
        },
      },
    ]
  },
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

  useEffect(() => {
    if (props.route.params?.address) {
      if (validateAddressAllBlockchains(props.route.params.address)) {
        whatDoWithData(props.route.params.address)
      }
    }
  }, [])

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
      setMessage(i18n.t('screens.scanQrCode.requesting'))

      granted = (await BarCodeScanner.requestPermissionsAsync()).granted

      if (!granted) {
        setMessage(i18n.t('screens.scanQrCode.noAccess'))
      } else {
        setHasPermission(granted)
      }
    } else {
      setHasPermission(granted)
    }
  }

  const isValid = (key: string) =>
    validateTextAllBlockchains(key) || UriHelper.isValid(key)

  const goTo = (key: string): NavParam<RootStackParamList> | undefined => {
    if (validatePrivateKeyWithPasswordAllBlockchains(key)) {
      return [
        wrapper.route.Tab.name,
        {
          screen: wrapper.route.More.name,
          params: {
            screen: wrapper.route.Passphrase.name,
            initial: false,
            params: {
              encryptedKey: key,
            },
          },
        },
      ]
    } else if (validateWifAllBlockchains(key)) {
      const blockchainName = getBlockchainByWif(key)
      if (blockchainName) {
        return [
          wrapper.route.Tab.name,
          {
            screen: wrapper.route.More.name,
            params: {
              screen: wrapper.route.CustomizeAccount.name,
              initial: false,
              params: {
                source: wrapper.route.ImportKey.name,
                address: blockchainServices[
                  blockchainName
                ].generateAccountFromWif(key),
                legacy: true,
                wif: key,
                blockchain: blockchainName,
              },
            },
          },
        ]
      }
    }

    const scheme = UriHelper.isValidAsString(key)

    if (scheme) {
      return navigationScheme[scheme](key)
    }
  }

  const whatDoWithData = (info: string | IURI) => {
    if (!controller.isShowing) {
      if (isValid(info as string)) {
        setMessage(i18n.t('screens.scanQrCode.success'))
        // If there's a callback, calls the callback and navigates back
        if (props.route.params?.onScan) {
          let data: IURI | string = info

          if (UriHelper.isValid(info as string)) {
            data = UriHelper.parse(info as string) ?? info
          }
          props.navigation.goBack()
          props.route.params.onScan(data)
        } else {
          // If scanned QR is an address, opens modal
          if (validateAddressAllBlockchains(info as string)) {
            let data: IURI | string = info

            if (UriHelper.isValid(info as string)) {
              data = UriHelper.parse(info as string) ?? info
              const destination = goTo(info as string)
              props.navigation.pop(1)
              destination && props.navigation.navigate(...destination)
            }
            setAddress(info as string)
            controller.open()
          } else {
            // Otherwise, navigates to corresponding page
            const destination = goTo(info as string)
            props.navigation.pop(1)
            destination && props.navigation.navigate(...destination)
          }
        }
      } else {
        setMessage(i18n.t('screens.scanQrCode.tryAgain'))
      }
    }
  }

  const handleBarCodeScanned = (evt: BarCodeEvent) => {
    whatDoWithData(evt.data)
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
      {hasPermission && (
        <BarCodeScanner
          barCodeTypes={[BarCodeType.qr]}
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <ImageView
        width="100%"
        resizeMode="contain"
        source={require('~src/assets/images/qr-code-frame.png')}
      />

      <ButtonView
        position="absolute"
        bottom={0}
        width={'100%'}
        height="100px"
        borderTopLeftRadius="18px"
        borderTopRightRadius="18px"
        bg={'#333d46'}
        alignItems={'center'}
        justifyContent={'center'}
        onPress={props.navigation.goBack}
      >
        <LinearLayout mb={6}>
          <TextView fontSize="22px" color="primary" fontFamily="regular">
            {i18n.t('screens.scanQrCode.cancel')}
          </TextView>
        </LinearLayout>
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
