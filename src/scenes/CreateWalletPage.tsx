import React from 'react'

import ScreenLayout from '~src/components/ScreenLayout'
import {TextView} from '~src/styles/styled-components'

interface Props {}

const CreateWalletPage: React.FC<Props> = (props) => {
  return (
    <ScreenLayout alignX={'center'}>
      <TextView mb={5} color={'text.0'} fontSize={36} fontFamily={'bold'}>
        Hello world
      </TextView>
    </ScreenLayout>
  )
}

export default CreateWalletPage
