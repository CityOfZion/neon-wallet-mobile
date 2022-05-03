import React from 'react'

import {LinearLayout} from '../styles/styled-components'
import {Loader} from './loader/loader'

export const FlatListFooter = () => {
  return (
    <LinearLayout mt="12px" alignItems="center">
      <Loader />
    </LinearLayout>
  )
}
