import { cloneElement, type JSX, type ReactNode } from 'react'

import { Text } from 'react-native'

import { PressableScale } from '@/components/PressableScale'
import { Tooltip } from '@/components/Tooltip'

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
          {typeof value === 'object' ? value : <Text className="font-sans-regular text-sm text-white">{value}</Text>}
        </PressableScale>
      </Tooltip.Trigger>

      <Tooltip.Content>{label}</Tooltip.Content>
    </Tooltip.Root>
  )
}
