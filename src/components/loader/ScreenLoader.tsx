import React from 'react'
import {ActivityIndicator} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'

const ScreenLoader = (props?: {transparent?: boolean}) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ScreenLayout
      hideOfflineBar={true}
      alignY={'center'}
      transparent={props?.transparent ?? false}
    >
      <ActivityIndicator size={'large'} color={theme.colors.text[0]} />
    </ScreenLayout>
  )
}

export default ScreenLoader
