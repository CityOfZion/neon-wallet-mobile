import React from 'react'

import {LinearLayout, TextView} from '~src/styles/styled-components'

export const SelectedContactView = (props: {
  selectedContact: {name: string | undefined; address: string | undefined}
}) => {
  return (
    <LinearLayout width={'100%'}>
      <TextView
        width={'100%'}
        fontFamily={'regular'}
        color={'text.0'}
        fontSize={'18px'}
      >
        {props.selectedContact?.name}
      </TextView>
      <TextView
        width={'100%'}
        fontFamily={'medium'}
        color={'text.10'}
        fontSize={'16px'}
      >
        {props.selectedContact?.address}
      </TextView>
    </LinearLayout>
  )
}
