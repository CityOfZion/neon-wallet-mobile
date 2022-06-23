import React from 'react'
import { View, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import { wrapper } from '~src/app/ApplicationWrapper'

export const HeaderNavigationDefault = () => {
  const insets = useSafeAreaInsets()
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  return (
    <View
      style={{
        paddingTop: insets.top - Dimensions.get('screen').height * 0.035,
        backgroundColor: theme.colors.background[14],
      }}
    />
  )
}
