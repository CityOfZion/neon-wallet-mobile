import React from 'react'

import type { ReactElement } from 'react'

import { TwButton } from '@/components/TwButton'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'

type TProps = {
  label: string
  icon: ReactElement
  disabled?: boolean
  onPress(): void
}

export const AccountScreenMenuItem = ({ label, disabled, icon, onPress }: TProps) => (
  <TwButton
    label={label}
    variant="contained-darker"
    className="h-20"
    disabled={disabled}
    contentProps={{ className: 'px-4 gap-x-4' }}
    labelProps={{ className: 'uppercase flex-grow text-white font-sans-regular' }}
    leftElement={icon}
    rightElement={<MdChevronRight aria-hidden className="text-neon" />}
    onPress={onPress}
  />
)
