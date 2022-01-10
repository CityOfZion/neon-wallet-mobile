import React, {useEffect, useState} from 'react'
import {Image} from 'react-native'
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
  const [imgUri, setImageUri] = useState<string | undefined>(undefined)
  const imgDefault = require('~src/assets/logos/icon-dapp-default.png')
  useEffect(() => {
    setImageUri(imageUri)
  }, [imageUri])

  return (
    <LinearLayout alignItems="center" mb={'20px'}>
      <LinearLayout
        backgroundColor={'#1c2228'}
        borderRadius={4}
        padding={4}
        width={'77px'}
        height={'75px'}
      >
        {imgUri ? (
          <Image
            source={{
              uri: imgUri,
            }}
            onError={() => {
              setImageUri(undefined)
            }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        ) : (
          <Image
            source={imgDefault}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        )}
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
