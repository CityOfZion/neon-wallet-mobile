import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { BlurView } from 'expo-blur'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { TwButton } from '../TwButton'
import { NfcModalAnimatedCheck } from './NfcModalAnimatedCheck'
import { NfcModalAnimatedPhone } from './NfcModalAnimatedPhone'

export type TNfcModalShowOptions = {
  onForceHide?: () => Promise<void>
  message?: string
}

export type TNfcModalThis = {
  isShowing: boolean
  show: (options: TNfcModalShowOptions) => void
  success: () => Promise<void>
  hide: () => void
}

export let activatedNfcModal: TNfcModalThis | undefined

const NfcModal = () => {
  const { t } = useTranslation('components', { keyPrefix: 'nfc' })
  const { t: commonT } = useTranslation('common')

  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<'success' | 'idle'>('idle')

  const showOptions = useRef<TNfcModalShowOptions>(undefined)

  const show = useCallback((options: TNfcModalShowOptions) => {
    if (thisRef.current.isShowing) return
    thisRef.current.isShowing = true
    showOptions.current = options || {}
    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    if (!thisRef.current.isShowing) return
    thisRef.current.isShowing = false
    setVisible(false)
    setStatus('idle')
  }, [])

  const success = useCallback(async () => {
    setStatus('success')

    await UtilsHelper.sleep(2500)

    hide()
  }, [hide])

  const handleCancel = async () => {
    hide()
    await showOptions.current?.onForceHide?.()
  }

  const thisRef = useRef<TNfcModalThis>({ show, success, hide, isShowing: visible })

  useLayoutEffect(() => {
    activatedNfcModal = thisRef.current

    return () => {
      activatedNfcModal = undefined
    }
  }, [])

  if (!visible) return null

  return (
    <Animated.View className="absolute h-full w-full" entering={FadeIn} exiting={FadeOut}>
      <BlurView className="absolute h-full w-full" intensity={90} tint="dark" />

      <View className="flex-1 items-center justify-end p-3">
        <Animated.View
          className="w-full items-center rounded-[2.75rem] bg-white p-8 dark:bg-gray-800"
          entering={SlideInDown}
          exiting={SlideOutDown}
        >
          <Text className="text-center font-sans-bold text-3xl text-gray-700 dark:text-white">{t('title')}</Text>

          <Text className="mt-1 text-center font-sans-regular text-lg text-gray-300 dark:text-white">
            {showOptions.current?.message || t('description')}
          </Text>

          <View className="relative my-12 size-28 items-center justify-center overflow-hidden rounded-full border-8 border-blue">
            {status === 'success' ? <NfcModalAnimatedCheck aria-hidden /> : <NfcModalAnimatedPhone aria-hidden />}
          </View>

          <TwButton
            onPress={handleCancel}
            label={commonT('general.cancel')}
            variant="card"
            labelProps={{ className: 'dark:text-white text-asphalt' }}
            className="w-full bg-gray-300/30"
          />
        </Animated.View>
      </View>
    </Animated.View>
  )
}

export default NfcModal
