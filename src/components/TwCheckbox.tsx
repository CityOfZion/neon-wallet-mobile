import * as CheckboxPrimitive from '@rn-primitives/checkbox'
import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import TbCheck from '@/assets/images/tb-check.svg'

type TProps = {
  checked: boolean
  label: string
  labelClassName?: string
  onCheckedChange(checked: boolean): void
} & ViewProps

export const TwCheckbox = ({ checked, onCheckedChange, label, className, labelClassName, ...props }: TProps) => {
  return (
    <View className={StyleHelper.mergeStyles('flex-row items-center gap-2.5', className)} {...props}>
      <Text className={StyleHelper.mergeStyles('font-sans-medium text-sm text-white', labelClassName)}>{label}</Text>

      <CheckboxPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={StyleHelper.mergeStyles('h-6 w-6 items-center justify-center rounded', {
          'border-2 border-gray-300': !checked,
          'bg-neon': checked,
        })}
      >
        <CheckboxPrimitive.Indicator>
          <TbCheck aria-hidden className="h-5 w-5 text-gray-850" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </View>
  )
}
