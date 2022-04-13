import I18n from 'i18n-js'
import moment from 'moment'
import React, {useEffect, useState} from 'react'
import {TouchableHighlight, Image} from 'react-native'

import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'

export interface DappConnectedCardProps {
  onPress?: () => void
  iconUri: string
  approvedDate?: number
  dAppName: string
  footer?: React.ReactNode
}

const DappConnectedCard = ({
  dAppName,
  footer,
  iconUri,
  approvedDate,
  onPress,
}: DappConnectedCardProps) => {
  const [imgUri, setImageUri] = useState<string | undefined>(undefined)
  const imgDefault = require('~src/assets/logos/icon-dapp-default.png')
  useEffect(() => {
    setImageUri(iconUri)
  }, [iconUri])

  return (
    <TouchableHighlight onPress={onPress}>
      <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
        <LinearLayout orientation={'horiz'}>
          <LinearLayout
            borderRadius={'4px'}
            width={'42px'}
            height={'41px'}
            alignSelf={'center'}
            mr={'10px'}
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
          <LinearLayout>
            {!!approvedDate && (
              <TextView color={'text.10'} fontSize={'12px'}>
                {moment
                  .unix(approvedDate)
                  .format(I18n.t('formatters.dappApprovedDate'))}
              </TextView>
            )}
            <TextView color={'white'} fontFamily={'medium'} fontSize={'18px'}>
              {dAppName}
            </TextView>
            {footer}
          </LinearLayout>
        </LinearLayout>
        <ImageView
          source={require('~src/assets/images/icon-arrow-right-green.png')}
          width={12}
          height={19}
          alignSelf={'center'}
          mr={'5px'}
        />
      </LinearLayout>
    </TouchableHighlight>
  )
}

export default DappConnectedCard
