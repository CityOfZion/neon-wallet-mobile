import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { type BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera'
import { useTranslation } from 'react-i18next'
import { Modal, Text, useWindowDimensions, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import MdClose from '@/assets/images/md-close.svg'
import TbCameraOff from '@/assets/images/tb-camera-off.svg'

import { TwIconButton } from './TwIconButton'

import type { TQrCodeScanModalShowOptions, TQrCodeScanModalThis } from '@/types/components'

export let activatedQrCode: TQrCodeScanModalThis | undefined

const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 120

const QrCodeScanModal = () => {
  const { t } = useTranslation('components', { keyPrefix: 'qrCodeScan' })
  const { width, height } = useWindowDimensions()
  const [permission, requestPermission] = useCameraPermissions()
  const { top, left } = useSafeAreaInsets()

  const [visible, setVisible] = useState(false)

  const xSharedValue = useSharedValue(width / 2 - DEFAULT_WIDTH / 2)
  const ySharedValue = useSharedValue(height / 2 - DEFAULT_HEIGHT / 2)
  const widthSharedValue = useSharedValue(DEFAULT_WIDTH)
  const heightSharedValue = useSharedValue(DEFAULT_HEIGHT)
  const rotationSharedValue = useSharedValue(0)

  const barcodeScanningDataRef = useRef<BarcodeScanningResult['data'] | null>(null)

  const handleBarCodeScanned = (scanningResults: BarcodeScanningResult) => {
    // TODO: Uncomment this when we upgrade expo to 55, since now the cords are not right.
    // xSharedValue.value = withSpring(scanningResults.bounds.origin.x)
    // ySharedValue.value = withSpring(scanningResults.bounds.origin.y)
    // widthSharedValue.value = withSpring(scanningResults.bounds.size.width)
    // heightSharedValue.value = withSpring(scanningResults.bounds.size.height)

    // if (scanningResults.cornerPoints && scanningResults.cornerPoints.length >= 2) {
    //   const p1 = scanningResults.cornerPoints[0]
    //   const p2 = scanningResults.cornerPoints[1]

    //   const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x)
    //   const angleDeg = angleRad * (180 / Math.PI)

    //   rotationSharedValue.value = withSpring(angleDeg)
    // }

    if (!barcodeScanningDataRef.current) {
      barcodeScanningDataRef.current = scanningResults.data

      setTimeout(async () => {
        hide()
        await UtilsHelper.sleep(500)
        showOptions.current?.onScan(barcodeScanningDataRef.current!)
        barcodeScanningDataRef.current = null
      }, 250)
    }
  }

  const hide = () => {
    thisRef.current.isShowing = false
    setVisible(false)
  }

  const show = useCallback(
    (options: TQrCodeScanModalShowOptions) => {
      if (thisRef.current.isShowing) return

      thisRef.current.isShowing = true
      showOptions.current = options

      setVisible(true)
      requestPermission()
    },
    [requestPermission]
  )

  const thisRef = useRef<TQrCodeScanModalThis>({ show, isShowing: visible })
  const showOptions = useRef<TQrCodeScanModalShowOptions>(undefined)

  const animatedStyle = useAnimatedStyle(() => {
    const extraSize = 0.1
    return {
      left: xSharedValue.value - (widthSharedValue.value * extraSize) / 2,
      top: ySharedValue.value - (heightSharedValue.value * extraSize) / 2,
      width: widthSharedValue.value * (1 + extraSize),
      height: heightSharedValue.value * (1 + extraSize),
      borderRadius: widthSharedValue.value / 10,
      transform: [{ rotate: `${rotationSharedValue.value}deg` }],
    }
  })

  useEffect(() => {
    activatedQrCode = thisRef.current

    return () => {
      activatedQrCode = undefined
    }
  }, [])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      className="items-center justify-center"
      onRequestClose={hide}
    >
      <View className="relative flex-1 items-center justify-center bg-asphalt">
        {!permission || !permission.granted ? (
          <View className="items-center px-8">
            <Text className="text-center font-sans-medium text-2xl text-white">{t('permissionOffTitle')}</Text>
            <TbCameraOff aria-hidden className="my-9 size-28 stroke-1 text-blue" />
            <Text className="px-4 text-center font-sans-regular text-lg text-gray-100">
              {t('permissionOffMessage')}
            </Text>
          </View>
        ) : (
          <Fragment>
            <CameraView className="absolute left-0 top-0 h-full w-full" onBarcodeScanned={handleBarCodeScanned} mute />

            <TwIconButton
              className="absolute"
              style={{ top, left: left + 10 }}
              icon={<MdClose className="text-white" aria-hidden />}
              onPress={hide}
              aria-label={t('closeButtonLabel')}
            />

            <Animated.View
              className="absolute items-center border-3 border-dashed border-neon"
              style={[animatedStyle]}
            />
          </Fragment>
        )}
      </View>
    </Modal>
  )
}

export default QrCodeScanModal
