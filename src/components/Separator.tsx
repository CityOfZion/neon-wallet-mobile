import React from 'react'

import { LinearLayout } from '../styles/styled-components'
import { LinearLayoutProps } from '../types/styled-components'

type Props = LinearLayoutProps

export const Separator = (props: Props) => {
  return <LinearLayout height="0.5px" bg="background.10" width="100%" {...props} />
}
