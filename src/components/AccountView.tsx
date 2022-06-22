import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import I18n from 'i18n-js'
import React from 'react'
import { View } from 'react-native'

import { getBlockchainByAddress } from '~/src/blockchain'
import { wrapper } from '~src/app/ApplicationWrapper'
import { Normalize } from '~src/app/Normalize'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  contactName?: string | undefined
  address: string
  walletName?: string | undefined
  accountName?: string | undefined
  hideTitles?: boolean
  hideButton?: boolean
}

export const AccountView = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()
  const blockchain = getBlockchainByAddress(props.address)
  return (
    <LinearLayout borderRadius="7px" bg="background.14" pt="12px" pb="12px" pl="16px" pr="16px" mt={4}>
      {props.contactName && (
        <TextView width="100%" fontFamily="medium" color="text.0" fontSize="14px">
          {props.contactName}
        </TextView>
      )}
      {props.accountName && (
        <LinearLayout orientation="horiz">
          <LinearLayout weight={1}>
            {props.hideTitles ? (
              <></>
            ) : (
              <TextView color="text.10" fontSize="14px">
                Wallet
              </TextView>
            )}
            <TextView fontSize="16px" color="text.0">
              {props.walletName}
            </TextView>
          </LinearLayout>
          <LinearLayout weight={1}>
            {props.hideTitles ? (
              <></>
            ) : (
              <TextView fontSize="14px" fontWeight={500} fontFamily="medium" color="text.10">
                Account
              </TextView>
            )}
            <TextView fontSize="16px" fontWeight={500} fontFamily="medium" color="text.0" mb={2}>
              {props.accountName}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      )}
      <LinearLayout orientation="horiz">
        <View>
          <TextView color="text.10" fontSize="14px">
            {blockchain !== null ? I18n.t(`blockchainServices.${blockchain}.id`) : ''}
          </TextView>
          <TextView
            mr={4}
            alignSelf="center"
            weight={1}
            numberOfLines={1}
            color="primary"
            fontSize="16px"
            ellipsizeMode="middle"
            fontFamily="medium"
          >
            {props.address}
          </TextView>
        </View>

        {!props.contactName && !props.walletName && !props.hideButton && blockchain && (
          <ButtonView
            onPress={() => {
              navigation.navigate(wrapper.route.Modal.name, {
                screen: wrapper.route.PersistContact.name,
                params: {
                  startingAddress: props.address,
                },
              })
            }}
          >
            <ImageView
              width={Normalize.scale(25)}
              height={Normalize.scale(25)}
              resizeMode="contain"
              source={require('~/src/assets/images/icon-circle-plus-green-small.png')}
            />
          </ButtonView>
        )}
      </LinearLayout>
    </LinearLayout>
  )
}
