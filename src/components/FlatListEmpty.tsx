import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { LinearLayout, TextView } from '../styles/styled-components'

type Props = {
  label: string
  footer?: React.ReactNode
  alignY?: 'center' | 'top'
}

export const FlatListEmpty = ({ label, footer, alignY = 'top' }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <LinearLayout
      alignItems="center"
      height={alignY === 'center' ? '100%' : undefined}
      justifyContent={alignY === 'center' ? 'center' : undefined}
    >
      <TextView color={theme.colors.text[6]} fontFamily="medium" fontSize="24px">
        {label}
      </TextView>
      {footer}
    </LinearLayout>
  )
}
