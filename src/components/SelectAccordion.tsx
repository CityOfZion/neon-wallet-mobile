import { createContext, forwardRef, useContext } from 'react'

import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import type { TTwAccordionRootProps, TTwAccordionTriggerProps } from './TwAccordion'
import { TwAccordion } from './TwAccordion'

type TContextValue = {
  value?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SelectAccordionContext = createContext<TContextValue | null>(null)

const useSelectAccordion = () => {
  const context = useContext(SelectAccordionContext)

  if (!context) {
    throw new Error('SelectAccordion compound components cannot be rendered outside the SelectAccordion.Root component')
  }

  return context
}

type TRootProps = TContextValue & Omit<TTwAccordionRootProps, 'value'>

const Root = ({ value, open, onOpenChange, ...props }: TRootProps) => {
  return (
    <SelectAccordionContext.Provider value={{ value }}>
      <TwAccordion.Root value={open} onValueChange={onOpenChange} {...props} />
    </SelectAccordionContext.Provider>
  )
}

type TTriggerProps = TTwAccordionTriggerProps

const Trigger = forwardRef<View, TTriggerProps>(({ className, label, ...props }, ref) => {
  const { value: selectAccordionValue } = useSelectAccordion()

  return (
    <TwAccordion.Trigger
      {...props}
      ref={ref}
      iconClassName="text-neon"
      label={
        <View className="flex-1 flex-row justify-between gap-3">
          <Text className="font-sans-regular text-lg text-white">{label}</Text>

          {selectAccordionValue && (
            <Text
              className="max-w-48 flex-shrink font-sans-regular text-lg text-gray-100"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {selectAccordionValue}
            </Text>
          )}
        </View>
      }
      className={StyleHelper.mergeStyles('bg-asphalt px-5 py-4', className)}
    />
  )
})

const Content = TwAccordion.Content

export const SelectAccordion = { Root, Trigger, Content }
