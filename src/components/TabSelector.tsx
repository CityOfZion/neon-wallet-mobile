import React from 'react'

import { ButtonWithoutFeedbackView, LinearLayout, TextView } from '../styles/styled-components'

type TabProps<T extends string> = {
  onPress: (tab: T) => void
  isSelected: boolean
  id: T
  label: string
}

type Props<T extends string> = {
  tabs: Omit<TabProps<T>, 'isSelected' | 'onPress'>[]
  selected: T
  onPress: (tab: T) => void
}

const Tab = <T extends string = string>({ onPress, isSelected, label, id }: TabProps<T>) => {
  return (
    <ButtonWithoutFeedbackView onPress={() => onPress(id)}>
      <LinearLayout orientation="verti" weight={1}>
        <TextView
          width="100%"
          fontFamily="bold"
          fontSize="16px"
          textAlign="center"
          color={isSelected ? 'text.0' : 'background.3'}
          my="16px"
        >
          {label}
        </TextView>
        <LinearLayout width="100%" height={isSelected ? '4px' : '2px'} bg={isSelected ? 'primary' : 'background.3'} />
      </LinearLayout>
    </ButtonWithoutFeedbackView>
  )
}

export const TabSelector = <T extends string = string>({ selected, tabs, onPress }: Props<T>) => {
  return (
    <LinearLayout orientation="horiz" mx="16px">
      {tabs.map(({ label, id }) => (
        <Tab key={id} id={id} onPress={onPress} isSelected={selected === id} label={label} />
      ))}
    </LinearLayout>
  )
}
