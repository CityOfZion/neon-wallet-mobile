import React from 'react'

import type { ReactElement } from 'react'

import { TwButton } from '@/components/TwButton'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  label: string
  icon: ReactElement
  className?: string
  labelClassName?: string
  disabled?: boolean
  onPress(): void
}

export const AccountScreenActionButton = ({ label, icon, className, labelClassName, disabled, onPress }: TProps) => (
  <TwButton
    label={label}
    variant="contained-light"
    className={StyleHelper.mergeStyles('h-11 flex-shrink flex-grow', className)}
    labelProps={{ className: StyleHelper.mergeStyles('text-sm font-sans-medium', labelClassName) }}
    contentProps={{ className: 'px-2 gap-x-1.5' }}
    leftElement={icon}
    disabled={disabled}
    onPress={onPress}
  />
)
