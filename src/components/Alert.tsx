import React from 'react'

import { LinearLayout, TextView } from '../styles/styled-components'
import { AlertBox } from './AlertBox'
import { Button } from './Button'
import { Separator } from './Separator'

type Props = {
  visible: boolean
  onRequestClose?: () => void
  title: string
  subtitle?: string
  children?: React.ReactNode
}

type AlertButtonProps = {
  onPress?: () => void
  label: string
}

type AlertButtonGroupProps = {
  children: React.ReactNode[]
}

export const AlertButton = ({ onPress, label }: AlertButtonProps) => {
  return <Button onPress={onPress} label={label} p="12px" labelStyle={{ fontSize: 'xl' }} weight={1} />
}

export const AlertButtonGroup = ({ children }: AlertButtonGroupProps) => {
  return (
    <LinearLayout orientation="horiz" justifyContent="space-between" p="3px" width="100%">
      {children.map((it, index) => (
        <>
          {it}
          {index !== children.length - 1 && <Separator type="vert" />}
        </>
      ))}
    </LinearLayout>
  )
}

export const Alert = ({ onRequestClose, visible, children, title, subtitle }: Props) => {
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

      <LinearLayout orientation="horiz" width="100%">
        {children}
      </LinearLayout>
    </AlertBox>
  )
}
