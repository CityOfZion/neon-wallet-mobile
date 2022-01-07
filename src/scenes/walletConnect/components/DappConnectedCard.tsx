import moment from 'moment'
import React from 'react'
import {TouchableHighlight} from 'react-native'

import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'

export interface DappConnectedCardProps {
  onPress?: () => void
  iconUri: string
  approvedDate: number
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
  return (
    <TouchableHighlight onPress={onPress}>
      <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
        <LinearLayout orientation={'horiz'}>
          <LinearLayout
            borderRadius={'4px'}
            p={'5px'}
            width={'42px'}
            height={'41px'}
            backgroundColor={'background.14'}
            alignSelf={'center'}
            mr={'10px'}
          >
            <ImageView
              resizeMode="contain"
              source={{
                uri: iconUri,
              }}
              width={'100%'}
              height={'100%'}
            />
          </LinearLayout>
          <LinearLayout>
            <TextView color={'text.10'} fontSize={'12px'}>
              {moment.unix(approvedDate).format('HH:mm Do MMM YYYY')}
            </TextView>
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
