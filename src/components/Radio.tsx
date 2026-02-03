import * as React from 'react'

import { type GestureResponderEvent, Pressable, type PressableProps, Text, View, type ViewProps } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import MdRadioButtonChecked from '@/assets/images/md-radio-button-checked.svg'
import MdRadioButtonUnchecked from '@/assets/images/md-radio-button-unchecked.svg'

type TRootProps = {
  value?: any
  label?: React.ReactNode
  onValueChange: (value: any) => void
  disabled?: boolean
} & ViewProps

type TItemProps = {
  value: any
  label?: string | React.JSX.Element
  leftElement?: React.JSX.Element
  id: string
} & PressableProps

const validateItemValue = (value: any) => {
  if (typeof value === 'string') return
  if (typeof value === 'object' && value?.id && typeof value.id === 'string') return

  throw new Error('Invalid value type. Expected string or object with id property.')
}

const RadioGroupContext = React.createContext<TRootProps | null>(null)
export const useRadioGroupContext = () => {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error('RadioGroup compound components cannot be rendered outside the RadioGroup.Root component')
  }

  return context
}

const Root = React.forwardRef<View, TRootProps>(
  ({ value, onValueChange, label, className, disabled = false, children, ...viewProps }, ref) => {
    if (value) validateItemValue(value)

    return (
      <RadioGroupContext.Provider
        value={{
          value,
          disabled,
          onValueChange,
        }}
        {...viewProps}
      >
        <View className="w-full gap-y-5">
          {typeof label === 'string' ? (
            <Text className="font-sans-semibold text-sm uppercase text-gray-100">{label}</Text>
          ) : (
            label
          )}

          <View ref={ref} role="radiogroup" className={StyleHelper.mergeStyles('rounded-md bg-gray-900', className)}>
            {children}
          </View>
        </View>
      </RadioGroupContext.Provider>
    )
  }
)

const Item = React.forwardRef<View, TItemProps>(
  ({ value, label, id, leftElement, className, disabled: disabledProp = false, onPress, ...props }, ref) => {
    const context = useRadioGroupContext()

    validateItemValue(value)
    if (context.value && typeof context.value !== typeof value) {
      throw new Error('Root value and Item value must be the same type')
    }

    const isChecked = typeof context.value === 'object' ? context.value.id === value.id : context.value === value
    const isDisabled = (context.disabled || disabledProp) ?? false

    function handlePress(event: GestureResponderEvent) {
      if (isDisabled) return
      context.onValueChange(value)
      onPress?.(event)
    }

    return (
      <Pressable
        ref={ref}
        role="radio"
        onPress={handlePress}
        aria-checked={isChecked}
        disabled={isDisabled}
        accessibilityState={{
          disabled: isDisabled,
          checked: isChecked,
        }}
        aria-labelledby={id}
        className={StyleHelper.mergeStyles('w-full flex-row items-center gap-x-2.5 p-3.5', className)}
        {...props}
      >
        {leftElement}

        {label && (
          <React.Fragment>
            {typeof label === 'string' ? (
              <Text
                nativeID={id}
                numberOfLines={1}
                className="mr-auto flex-shrink font-sans-regular text-lg text-white"
              >
                {label}
              </Text>
            ) : (
              React.cloneElement(label, { nativeID: id })
            )}
          </React.Fragment>
        )}

        {isChecked ? (
          <MdRadioButtonChecked aria-hidden role="presentation" className="h-6 w-6 text-neon" />
        ) : (
          <MdRadioButtonUnchecked aria-hidden role="presentation" className="h-6 w-6 text-gray-300" />
        )}
      </Pressable>
    )
  }
)

export const Radio = { Root, Item }
