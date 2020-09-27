import React from 'react'

import {Facade} from '~src/app/Facade'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

const ClaimGasLoader = () => {
  return (
    <LinearLayout
      orientation={'horiz'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <ImageView
        mt={-2}
        mr={4}
        source={require('~/src/assets/images/icon-rotate-right-green.png')}
        width={20}
        height={20}
        resizeMode="contain"
      />

      <TextView fontSize={'sm'} color={'primary'}>
        {Facade.t('screens.getAccount.claimInProgress')}
      </TextView>
    </LinearLayout>
  )
}

export default ClaimGasLoader
