import React, { forwardRef } from 'react'

import * as TabsPrimitive from '@rn-primitives/tabs'
import { ScrollView, Text } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

const Root = forwardRef<TabsPrimitive.RootRef, TabsPrimitive.RootProps>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Root className={StyleHelper.mergeStyles('flex-shrink flex-grow', className)} ref={ref} {...props}>
    {children}
  </TabsPrimitive.Root>
))

const List = forwardRef<TabsPrimitive.ListRef, TabsPrimitive.ListProps>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.List className={StyleHelper.mergeStyles('flex-row', className)} ref={ref} {...props}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      disableScrollViewPanResponder
      alwaysBounceHorizontal={false}
      horizontal
      className="mx-auto"
      contentContainerClassName="gap-2 justify-center flex-grow"
    >
      {children}
    </ScrollView>
  </TabsPrimitive.List>
))

const Content = forwardRef<TabsPrimitive.ContentRef, TabsPrimitive.ContentProps>(
  ({ className, children, ...props }, ref) => (
    <TabsPrimitive.Content
      className={StyleHelper.mergeStyles('mt-6 flex-shrink flex-grow', className)}
      ref={ref}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  )
)

type TTriggerProps = TabsPrimitive.TriggerProps & {
  label: string
}
const Trigger = forwardRef<TabsPrimitive.TriggerRef, TTriggerProps>(({ className, label, disabled, ...props }, ref) => {
  const { value } = TabsPrimitive.useRootContext()

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      disabled={disabled}
      className={StyleHelper.mergeStyles(
        'rounded-full bg-gray-300/15 px-4 py-2',
        {
          'bg-gray-100': value === props.value,
          'opacity-50': disabled,
        },
        className
      )}
      {...props}
    >
      <Text
        className={StyleHelper.mergeStyles('font-sans-semibold text-sm leading-4 text-neon', {
          'text-asphalt': value === props.value,
          'text-gray-300': disabled,
        })}
      >
        {label}
      </Text>
    </TabsPrimitive.Trigger>
  )
})

export const TwTabs = {
  Root,
  List,
  Content,
  Trigger,
}
