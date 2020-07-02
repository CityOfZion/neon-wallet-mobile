import React from 'react'
import {NativeSyntheticEvent, NativeTouchEvent} from 'react-native'

import ThemedButton from '~src/components/themed/ThemedButton'

export interface ActionButtonOptions {
  actionTitle: string
  actionOnPress?: (
    e: NativeSyntheticEvent<NativeTouchEvent>,
    active?: boolean
  ) => void
}

const HeaderActionButton = (props?: ActionButtonOptions) => {
  return (
    props?.actionTitle && (
      <ThemedButton
        onPress={props.actionOnPress}
        label={props.actionTitle}
        flat={true}
        textColor={'primary'}
        fontSize={'lg'}
      />
    )
  )
}

export default HeaderActionButton
