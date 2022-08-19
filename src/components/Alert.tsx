import i18n from 'i18n-js'
import React from 'react'

import { LinearLayout, TextView } from '../styles/styled-components'
import { AlertBox } from './AlertBox'
import { Button } from './Button'
import { Separator } from './Separator'

type Props = {
  visible: boolean
  onRequestClose?: () => void
  onPress?: () => void
  title: string
  subtitle?: string
  buttonLabel?: string
}

export const Alert = ({ onRequestClose, visible, onPress, title, subtitle, buttonLabel }: Props) => {
  const handlePress = () => {
    if (onRequestClose) onRequestClose()
    if (onPress) onPress()
  }

  return (
    <AlertBox visible={visible} onRequestClose={onRequestClose}>
      <LinearLayout px="18px" pt="18px">
        <TextView color="primary" fontFamily="medium" fontSize="xl" textAlign="center">
          {title}
        </TextView>

        {subtitle && (
          <TextView color="text.0" fontFamily="regular" fontSize="md" textAlign="center" mt="12px">
            {subtitle}
          </TextView>
        )}
      </LinearLayout>

      <Separator mt="28px" />

      <Button
        onPress={handlePress}
        label={buttonLabel ?? i18n.t('app.continue')}
        p="12px"
        labelStyle={{ fontSize: 'xl' }}
      />
    </AlertBox>
  )
}
