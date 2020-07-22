import React from 'react'
import {ActivityIndicator} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'

const ScreenLoader = () => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ScreenLayout alignY={'center'}>
      <ActivityIndicator size={'large'} color={theme.colors.text[0]} />
    </ScreenLayout>
  )
}

export default ScreenLoader
