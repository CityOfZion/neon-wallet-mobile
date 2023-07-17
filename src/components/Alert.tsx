import { BlurView } from 'expo-blur'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Modal } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { RootState } from '../store/RootStore'
import { ButtonView, LinearLayout, TextView } from '../styles/styled-components'
import { Button } from './Button'
import { Separator } from './Separator'

type AlertShowButtonOption = {
  onPress?: () => void
  label: string
}

type AlertThis = {
  show: (options: AlertShowOptions) => void
  hide: () => void
}

type AlertShowOptions = {
  title?: string
  subtitle?: string
  buttons?: AlertShowButtonOption[]
  hideable?: boolean
  onHide?: () => void
}

let activatedAlert: AlertThis | undefined

export const showAlert = (options: AlertShowOptions) => {
  if (!activatedAlert) return
  activatedAlert.show(options)
}

export const hideAlert = () => {
  if (!activatedAlert) return
  activatedAlert.hide()
}

export const Alert = () => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const [visible, setVisible] = useState(false)
  const showOptions = useRef<AlertShowOptions>()

  const show = useCallback((options: AlertShowOptions) => {
    showOptions.current = options
    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    if (!showOptions.current?.hideable === false) return
    setVisible(false)

    if (showOptions.current?.onHide) showOptions.current.onHide()
  }, [])

  const thisRef = useRef<AlertThis>({ show, hide })

  const handlePressButon = (option: AlertShowButtonOption) => {
    hide()
    option.onPress?.()
  }

  useEffect(() => {
    activatedAlert = thisRef.current

    return () => {
      activatedAlert = undefined
    }
  }, [])

  return (
    <Modal visible={visible} transparent onRequestClose={hide}>
      <ButtonView onPress={hide} activeOpacity={0}>
        <BlurView
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          intensity={100}
          tint="dark"
        >
          <ButtonView activeOpacity={0} maxWidth="75%">
            <LinearLayout backgroundColor={`${theme.colors.black}B3`} borderRadius="14px">
              <LinearLayout px="18px" pt="18px">
                {showOptions.current?.title && (
                  <TextView color={theme.colors.primary} fontFamily="medium" fontSize="xl" textAlign="center">
                    {showOptions.current.title}
                  </TextView>
                )}

                {showOptions.current?.subtitle && (
                  <TextView color="text.0" fontFamily="regular" fontSize="md" textAlign="center" mt="12px">
                    {showOptions.current.subtitle}
                  </TextView>
                )}
              </LinearLayout>

              <Separator mt="28px" />

              <LinearLayout orientation="horiz" width="100%">
                <LinearLayout orientation="horiz" justifyContent="space-between" p="3px" width="100%">
                  {showOptions.current?.buttons?.map((it, index, array) => (
                    <>
                      <Button
                        onPress={() => handlePressButon(it)}
                        label={it.label}
                        p="12px"
                        labelStyle={{ fontSize: 'xl' }}
                        weight={1}
                      />
                      {index !== array.length - 1 && <Separator type="vert" />}
                    </>
                  ))}
                </LinearLayout>
              </LinearLayout>
            </LinearLayout>
          </ButtonView>
        </BlurView>
      </ButtonView>
    </Modal>
  )
}
