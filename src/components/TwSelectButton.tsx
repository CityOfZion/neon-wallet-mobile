import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import TbChevronDown from '@/assets/images/tb-chevron-down.svg'

import type { TTwButtonProps } from './TwButton'
import { TwButton } from './TwButton'
import { TwInputLabel } from './TwInputLabel'

type TProps = {
  label?: string
  labelDescription?: string
  placeholder?: string
  value?: ReactNode
  containerProps?: ViewProps
} & Omit<TTwButtonProps, 'variant'>

export const TwSelectButton = ({
  label,
  labelDescription,
  placeholder,
  value,
  containerProps,
  labelProps,
  contentProps,
  ...props
}: TProps) => {
  return (
    <View {...containerProps}>
      {label && <TwInputLabel label={label} description={labelDescription} />}

      <TwButton
        label={value || placeholder}
        variant="contained-darker"
        style={{ boxShadow: undefined }}
        iconsOnEdge
        rightElement={<TbChevronDown aria-hidden className="text-neon" />}
        contentProps={{
          ...contentProps,
          className: StyleHelper.mergeStyles('px-5', contentProps?.className),
        }}
        labelProps={{
          ...labelProps,
          className: StyleHelper.mergeStyles(
            'text-white text-left',
            { 'text-gray-300': !value },
            labelProps?.className
          ),
        }}
        {...props}
      />
    </View>
  )
}
