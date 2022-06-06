import React from 'react'
import {NativeSyntheticEvent, NativeTouchEvent, View} from 'react-native'

import {LinearLayout} from '~/src/styles/styled-components'
import ThemedAddButton from '~src/components/themed/ThemedAddButton'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'

export interface HeaderActionButtonProps {
  actionTitle?: string
  actionButtonStyle?:
    | 'default'
    | 'highlight'
    | 'close'
    | 'add'
    | 'more'
    | 'hightlightdisabled'
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

  if (actionButtonStyle === 'hightlightdisabled' && props?.actionTitle) {
    return (
      <ThemedButton
        onPress={props.actionOnPress}
        label={props.actionTitle}
        flat={true}
        fontFamily={'light'}
        textColor={'primary'}
        fontSize={'lg'}
        disabled={true}
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

  if (actionButtonStyle === 'more') {
    return (
      <LinearLayout mt={3}>
        <ThemedMoreButton onPress={props?.actionOnPress} />
      </LinearLayout>
    )
  }

  return <View />
}

HeaderActionButton.defaultProps = {
  actionButtonStyle: 'default',
}

export default HeaderActionButton
