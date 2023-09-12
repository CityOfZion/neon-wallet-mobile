import React from 'react'

import { LinearLayout } from '../styles/styled-components'
import { Loader } from './loader/loader'

type Props = {
  hide?: boolean
}

export const FlatListFooter = ({ hide }: Props) => {
  return (
    <LinearLayout mt="12px" alignItems="center" opacity={hide ? 0 : 1}>
      <Loader />
    </LinearLayout>
  )
}
