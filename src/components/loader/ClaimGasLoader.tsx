import i18n from 'i18n-js'
import React from 'react'

import {
  ImageView,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

const ClaimGasLoader = () => {
  return (
    <RelativeLayout
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
        {i18n.t('screens.getAccount.claimInProgress')}
      </TextView>
    </RelativeLayout>
  )
}

export default ClaimGasLoader
