import React from 'react'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {LinearLayout, TextView, ImageView} from '~/src/styles/styled-components'

type Props = {
  imageUri: string
  title: string
}

const WalletConnectBox = ({imageUri, title}: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <LinearLayout alignItems="center" mb={'20px'}>
      <LinearLayout backgroundColor={'#1c2228'} padding={20} borderRadius={4}>
        <ImageView
          resizeMode="contain"
          source={{uri: imageUri}}
          height="40px"
          width="40px"
        />
      </LinearLayout>
      <TextView
        mt={'14px'}
        fontFamily={'regular'}
        fontSize={'18px'}
        fontWeight={'500'}
        color={theme.colors.text[0]}
        textAlign={'center'}
      >
        {title}
      </TextView>
    </LinearLayout>
  )
}

export default WalletConnectBox
