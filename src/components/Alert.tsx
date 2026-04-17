import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { BlurView } from 'expo-blur'
import { type GestureResponderEvent, Modal, Platform, Text, View } from 'react-native'

import { UtilsHelper } from '@/helpers/UtilsHelper'

import { TwButton } from './TwButton'
import { TwSeparator } from './TwSeparator'

import type { TAlertShowButtonOption, TAlertShowOptions, TAlertThis } from '@/types/components'

export let activatedAlert: TAlertThis | undefined

const Alert = () => {
  const [visible, setVisible] = useState(false)
  const showOptions = useRef<TAlertShowOptions>(undefined)

  const show = useCallback((options: TAlertShowOptions) => {
    if (thisRef.current.isShowing) return

    thisRef.current.isShowing = true
    showOptions.current = options

    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    if (!thisRef.current.isShowing || showOptions.current?.hideable === true) return

    thisRef.current.isShowing = false

    setVisible(false)

    if (showOptions.current?.onHide) showOptions.current.onHide()
  }, [])

  const thisRef = useRef<TAlertThis>({ show, hide, isShowing: visible })

  const handlePressButton = async (option: TAlertShowButtonOption) => {
    hide()
    await UtilsHelper.sleep(500) // wait for the alert to close
    option.onPress?.()
  }

  const handleContentPress = (event: GestureResponderEvent) => {
    event.stopPropagation()
  }

  useEffect(() => {
    activatedAlert = thisRef.current

    return () => {
      activatedAlert = undefined
    }
  }, [])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      className="items-center justify-center"
      onRequestClose={hide}
    >
      <BlurView
        className="size-full items-center justify-center"
        intensity={Platform.OS === 'ios' ? 15 : 90}
        tint="dark"
        onTouchStart={hide}
      >
        <View className="w-full max-w-[80%] rounded-2xl bg-black/85" onTouchStart={handleContentPress}>
          <View className="gap-3 p-5">
            {showOptions.current?.title && (
              <Text className="text-center font-sans-medium text-lg text-neon">{showOptions.current.title}</Text>
            )}

            {showOptions.current?.subtitle && (
              <Text className="text-center font-sans-regular text-base text-white">{showOptions.current.subtitle}</Text>
            )}
          </View>

          <TwSeparator withoutContainer />

          <View className="flex-row justify-between">
            {showOptions.current?.buttons?.map((button, index, array) => (
              <Fragment key={index}>
                <TwButton
                  onPress={() => handlePressButton(button)}
                  variant="text"
                  className="flex-1"
                  label={button.label}
                />

                {index !== array.length - 1 && <TwSeparator withoutContainer variant="vert" />}
              </Fragment>
            ))}
          </View>
        </View>
      </BlurView>
    </Modal>
  )
}

export default Alert
