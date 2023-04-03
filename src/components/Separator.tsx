import React from 'react'

import { LinearLayout } from '../styles/styled-components'
import { LinearLayoutProps } from '../types/styled-components'

type Props = {
  type?: 'horiz' | 'vert'
} & LinearLayoutProps

export const Separator = ({ type = 'horiz', ...props }: Props) => {
  return type === 'horiz' ? (
    <LinearLayout height="0.6px" bg="background.10" width="100%" {...props} />
  ) : (
    <LinearLayout width="0.6px" bg="background.10" height="100%" {...props} />
  )
}
