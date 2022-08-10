import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner'
import i18n from 'i18n-js'
import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet } from 'react-native'

import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ImageView, RelativeLayout, TextView, LinearLayout, ButtonView } from '~src/styles/styled-components'

export interface QRCodeScanParams {
  onScan?: (data: string) => void
}

export interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'QRCodeScan'>
}

export const QRCodeScan = (props: Props) => {
  const { onScan } = props.route.params

  const [hasPermission, setHasPermission] = useState<boolean>()
  const [isRequesting, setIsRequesting] = useState<boolean>()

  const getScanPermission = useCallback(async () => {
    const { granted } = await BarCodeScanner.getPermissionsAsync()

    if (granted) {
      setHasPermission(true)
      return
    }

    setIsRequesting(true)

    const { granted: requestGranted } = await BarCodeScanner.requestPermissionsAsync()
    setHasPermission(requestGranted)
    setIsRequesting(false)

    if (!requestGranted) props.navigation.goBack()
  }, [])

  const handleBarCodeScanned = ({ data }: BarCodeEvent) => {
    props.navigation.goBack()
    if (onScan) onScan(data)
  }

  useEffect(() => {
    getScanPermission()
  }, [getScanPermission])

  return (
    <RelativeLayout bg="background.12" alignItems="center" justifyContent="center" height="100%">
      {hasPermission && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <ImageView
        resizeMode="contain"
        source={require('~src/assets/images/qr-code-frame.png')}
        style={{
          height: '100%',
        }}
      />

      <ButtonView
        position="absolute"
        bottom={0}
        width="100%"
        height="100px"
        bg="background.17"
        alignItems="center"
        justifyContent="center"
        onPress={props.navigation.goBack}
      >
        <TextView fontSize="22px" color="primary" fontFamily="regular">
          {i18n.t('screens.scanQrCode.cancel')}
        </TextView>
      </ButtonView>

      {(hasPermission === false || isRequesting) && (
        <LinearLayout position="absolute" alignItems="center" justifyContent="center">
          <TextView bg="white" textAlign="center" p="20px" borderRadius="30px" fontSize="20px">
            {isRequesting ? i18n.t('screens.scanQrCode.requesting') : i18n.t('screens.scanQrCode.noAccess')}
          </TextView>
        </LinearLayout>
      )}
    </RelativeLayout>
  )
}
