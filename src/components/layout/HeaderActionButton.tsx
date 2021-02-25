import React from 'react'
import {NativeSyntheticEvent, NativeTouchEvent, View} from 'react-native'

import {LinearLayout} from '~/src/styles/styled-components'
import ThemedAddButton from '~src/components/themed/ThemedAddButton'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'

export interface HeaderActionButtonProps {
  actionTitle?: string
  actionButtonStyle?: 'default' | 'highlight' | 'close' | 'add'
  actionOnPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
}

const HeaderActionButton: React.FC<HeaderActionButtonProps> = (
  props?: HeaderActionButtonProps
) => {
  const actionButtonStyle = props?.actionButtonStyle ?? 'default'

  if (actionButtonStyle === 'default' && props?.actionTitle) {
    return (
      <LinearLayout mt={3}>
        <ThemedButton
          onPress={props.actionOnPress}
          label={props.actionTitle}
          flat={true}
          textColor={'text.0'}
          fontSize={'lg'}
        />
      </LinearLayout>
    )
  }

  if (actionButtonStyle === 'highlight' && props?.actionTitle) {
    return (
      <ThemedButton
        onPress={props.actionOnPress}
        label={props.actionTitle}
        flat={true}
        fontFamily={'light'}
        textColor={'primary'}
        fontSize={'lg'}
      />
    )
  }

  if (actionButtonStyle === 'close') {
    return (
      <LinearLayout mt={2}>
        <ThemedCloseButton onPress={props?.actionOnPress} />
      </LinearLayout>
    )
  }

  if (actionButtonStyle === 'add') {
    return <ThemedAddButton onPress={props?.actionOnPress} />
  }

  return <View />
}

HeaderActionButton.defaultProps = {
  actionButtonStyle: 'default',
}

export default HeaderActionButton
