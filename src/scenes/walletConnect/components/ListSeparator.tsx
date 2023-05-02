import React from 'react'

import { LinearLayout } from '~/src/styles/styled-components'
import { LinearLayoutProps } from '~/src/types/styled-components'

const ListSeparator = (props: LinearLayoutProps) => {
  return <LinearLayout height="1px" bg="background.10" my="10px" {...props} />
}

export default ListSeparator
