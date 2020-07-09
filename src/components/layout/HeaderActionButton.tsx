import React from 'react'
import {NativeSyntheticEvent, NativeTouchEvent, View} from 'react-native'

import ThemedAddButton from '~src/components/themed/ThemedAddButton'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'

export interface HeaderActionButtonProps {
  actionTitle?: string
  actionButtonStyle?: 'default' | 'close' | 'add'
  actionOnPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
}

const HeaderActionButton: React.FC<HeaderActionButtonProps> = (
  props?: HeaderActionButtonProps
) => {
  const actionButtonStyle = props?.actionButtonStyle ?? 'default'

  if (actionButtonStyle === 'default' && props?.actionTitle) {
    return (
      <ThemedButton
        onPress={props.actionOnPress}
        label={props.actionTitle}
        flat={true}
        textColor={'primary'}
        fontSize={'lg'}
      />
    )
  }

  if (actionButtonStyle === 'close') {
    return <ThemedCloseButton onPress={props?.actionOnPress} />
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
