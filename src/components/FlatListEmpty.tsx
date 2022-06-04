import React from 'react'
import {useSelector} from 'react-redux'

import {wrapper} from '../app/ApplicationWrapper'
import {LinearLayout, TextView} from '../styles/styled-components'

type Props = {
  label: string
}

export const FlatListEmpty = ({label}: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <LinearLayout alignItems="center" justifyContent="center">
      <TextView color={theme.colors.text[6]} fontFamily="bold" fontSize="24px">
        {label}
      </TextView>
    </LinearLayout>
  )
}
