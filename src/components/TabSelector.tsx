import React from 'react'
import {ButtonView, LinearLayout, TextView} from '~src/styles/styled-components'

interface TabSelectorProps {
  isFirstTabSelected: boolean
  setFirstTabAsSelected: React.Dispatch<React.SetStateAction<boolean>>
  firstTabLabel: string
  secondTabLabel: string
  mb?: number
}

const TabSelector = (props: TabSelectorProps) => {
  return (
    <LinearLayout orientation="horiz" mt="36px" mb={props.mb ?? '0px'}>
      <ButtonView
        activeOpacity={1}
        onPress={() => props.setFirstTabAsSelected(true)}
        weight={1}
        alignItems="center"
        borderBottomWidth={!props.isFirstTabSelected ? '0px' : '3px'}
        borderColor="text.0"
      >
        <TextView
          width={'100%'}
          textAlign={'center'}
          fontSize="16px"
          pb="8px"
          fontFamily="semibold"
          borderBottomWidth={'1px'}
          borderColor="text.0"
          color={props.isFirstTabSelected ? 'text.0' : 'primary'}
        >
          {props.firstTabLabel}
        </TextView>
      </ButtonView>
      <ButtonView
        activeOpacity={1}
        onPress={() => props.setFirstTabAsSelected(false)}
        weight={1}
        alignItems="center"
        borderBottomWidth={props.isFirstTabSelected ? '0px' : '3px'}
        borderColor="text.0"
      >
        <TextView
          width={'100%'}
          textAlign={'center'}
          fontSize="16px"
          pb="8px"
          fontFamily="semibold"
          borderBottomWidth={'1px'}
          borderColor="text.0"
          color={props.isFirstTabSelected ? 'primary' : 'text.0'}
        >
          {props.secondTabLabel}
        </TextView>
      </ButtonView>
    </LinearLayout>
  )
}

export default TabSelector
