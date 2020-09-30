import {useNavigation} from '@react-navigation/native'
import React from 'react'

import {Facade} from '~src/app/Facade'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  contactName?: string | undefined
  address: string
  walletName?: string | undefined
  accountName?: string | undefined
}

export const AccountView = (props: Props) => {
  const navigation = useNavigation()
  return (
    <LinearLayout
      borderRadius={'7px'}
      bg={'background.14'}
      pt={'12px'}
      pb={'12px'}
      pl={'16px'}
      pr={'16px'}
      mt={4}
    >
      {props.contactName && (
        <TextView
          width={'100%'}
          fontFamily={'medium'}
          color={'text.0'}
          fontSize={'14px'}
        >
          {props.contactName}
        </TextView>
      )}
      {props.accountName && (
        <LinearLayout orientation={'horiz'}>
          <LinearLayout weight={1}>
            <TextView
              fontSize={'14px'}
              fontWeight={500}
              fontFamily={'medium'}
              color={'text.10'}
            >
              Wallet
            </TextView>
            <TextView
              fontSize={'14px'}
              fontWeight={500}
              fontFamily={'medium'}
              color={'text.0'}
            >
              {props.walletName}
            </TextView>
          </LinearLayout>
          <LinearLayout weight={1}>
            <TextView color={'text.10'}>Account</TextView>
            <TextView color={'text.0'}>{props.accountName}</TextView>
          </LinearLayout>
        </LinearLayout>
      )}
      <LinearLayout orientation={'horiz'}>
        <TextView
          mr={4}
          alignSelf={'center'}
          weight={1}
          numberOfLines={1}
          color={'primary'}
          fontSize={'16px'}
          ellipsizeMode={'middle'}
          fontFamily={'medium'}
        >
          {props.address}
        </TextView>

        {!props.contactName && !props.walletName && (
          <ButtonView
            onPress={() => {
              navigation.navigate(Facade.route.Modal.name, {
                screen: Facade.route.PersistContact.name,
                params: {
                  startingAddress: props.address,
                },
              })
            }}
          >
            <ImageView
              resizeMode={'cover'}
              source={require('~/src/assets/images/icon-circle-plus-green.png')}
            />
          </ButtonView>
        )}
      </LinearLayout>
    </LinearLayout>
  )
}
