import React from 'react'

import { PriorityFee, FastPriority, FasterPriority, FastestPriority } from '~/src/models/PriorityFee'
import { LinearLayout, ButtonView, ImageView, TextView } from '~/src/styles/styled-components'

const PriorityTab = (props: {
  priority: PriorityFee
  changePriority: (p: PriorityFee) => void
  feeTokenSymbol?: string
}) => {
  const priorityIconInactive = require('~src/assets/images/icon-flash-grey.png')
  const priorityIconActive = require('~src/assets/images/icon-flash-primary.png')

  return (
    <LinearLayout orientation="horiz" bg="background.1" borderRadius={8} mb="40px" height="75px">
      <ButtonView
        bg={props.priority.equals(FastPriority()) ? 'background.0' : 'background.1'}
        weight={1}
        p="16px"
        borderBottomLeftRadius={8}
        borderTopLeftRadius={8}
        justifyContent="center"
        onPress={() => props.changePriority(FastPriority())}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView source={props.priority.equals(FastPriority()) ? priorityIconActive : priorityIconInactive} />
          <LinearLayout ml="8px">
            <TextView
              color={props.priority.equals(FastPriority()) ? 'primary' : 'text.3'}
              fontSize="16px"
              fontFamily="semibold"
            >
              {FastPriority().name}
            </TextView>
            <TextView color={props.priority.equals(FastPriority()) ? 'primary' : 'text.3'} fontSize="12px">
              {FastPriority().fee} {props.feeTokenSymbol}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
      <ButtonView
        weight={1}
        bg={props.priority.equals(FasterPriority()) ? 'background.0' : 'background.1'}
        p="16px"
        borderStyle="solid"
        borderLeftWidth={1}
        borderRightWidth={1}
        borderColor="black"
        justifyContent="center"
        onPress={() => props.changePriority(FasterPriority())}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView source={props.priority.equals(FasterPriority()) ? priorityIconActive : priorityIconInactive} />
          <LinearLayout ml="8px">
            <TextView
              color={props.priority.equals(FasterPriority()) ? 'primary' : 'text.3'}
              fontSize="16px"
              fontFamily="semibold"
            >
              {FasterPriority().name}
            </TextView>
            <TextView color={props.priority.equals(FasterPriority()) ? 'primary' : 'text.3'} fontSize="12px">
              {FasterPriority().fee} {props.feeTokenSymbol}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
      <ButtonView
        weight={1}
        bg={props.priority.equals(FastestPriority()) ? 'background.0' : 'background.1'}
        p="16px"
        borderBottomRightRadius={8}
        borderTopRightRadius={8}
        justifyContent="center"
        onPress={() => props.changePriority(FastestPriority())}
      >
        <LinearLayout orientation="horiz" alignItems="center">
          <ImageView source={props.priority.equals(FastestPriority()) ? priorityIconActive : priorityIconInactive} />
          <LinearLayout ml="8px">
            <TextView
              color={props.priority.equals(FastestPriority()) ? 'primary' : 'text.3'}
              fontSize="16px"
              fontFamily="semibold"
            >
              {FastestPriority().name}
            </TextView>
            <TextView color={props.priority.equals(FastestPriority()) ? 'primary' : 'text.3'} fontSize="12px">
              {FastestPriority().fee} {props.feeTokenSymbol}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}

export default PriorityTab
