import { cloneElement, type JSX, type ReactNode } from 'react'

import { Text } from 'react-native'

import { PressableScale } from '@/components/PressableScale'
import { Tooltip } from '@/components/Tooltip'

import { ElementHelper } from '@/helpers/ElementHelper'

type TProps = {
  value: ReactNode
  label: string
  icon: JSX.Element
}

export const AccountTransactionsScreenCardDetails = ({ value, icon, label }: TProps) => {
  return (
    <Tooltip.Root type="press">
      <Tooltip.Trigger>
        <PressableScale className="flex-row items-center gap-1 rounded bg-gray-800 px-2.5 py-1">
          {cloneElement(icon, { className: 'text-gray-300 size-4' })}
          {ElementHelper.isTextContentValid(value) ? (
            <Text className="font-sans-regular text-sm text-white">{value}</Text>
          ) : (
            value
          )}
        </PressableScale>
      </Tooltip.Trigger>

      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  )
}
