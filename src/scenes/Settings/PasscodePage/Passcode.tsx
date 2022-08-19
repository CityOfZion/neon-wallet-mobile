import React from 'react'

import Keypad from '~src/components/Keypad'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export const PASSCODE_LENGTH = 5

type Props = {
  passcode: number[]
  onChange: (code: number) => void
  leftButton?: React.ReactNode
  rightButton?: React.ReactNode
  error?: string
  title: string
}

export const Passcode = ({ onChange, passcode, leftButton, rightButton, error, title }: Props) => {
  return (
    <LinearLayout flex={1} mt="32px" alignItems="center">
      <LinearLayout orientation="horiz">
        <LinearLayout flex={1} alignItems="flex-start">
          {leftButton}
        </LinearLayout>

        <LinearLayout flex={1} alignItems="center">
          <ImageView source={require('~/src/assets/images/icon-lock.png')} />
        </LinearLayout>

        <LinearLayout flex={1} alignItems="flex-end">
          {rightButton}
        </LinearLayout>
      </LinearLayout>

      <TextView fontSize="2xl" color="text.0" mt="64px" mb="18px">
        {title}
      </TextView>

      <LinearLayout orientation="horiz">
        {[...Array(PASSCODE_LENGTH)].map((item, index) => (
          <LinearLayout
            width="14px"
            height="14px"
            borderRadius="8px"
            borderWidth="2px"
            borderColor="text.0"
            backgroundColor={index < passcode.length ? 'text.0' : 'transparent'}
            mx="12px"
          />
        ))}
      </LinearLayout>

      {error && (
        <TextView color="primary" fontSize="2xl" my="18px">
          {error}
        </TextView>
      )}

      <LinearLayout flex={1} justifyContent="center">
        <Keypad onClick={onChange} disabled={passcode.length >= PASSCODE_LENGTH} />
      </LinearLayout>
    </LinearLayout>
  )
}
