import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import I18n from 'i18n-js'
import React from 'react'

import { useBlockchainServiceUtils } from '../hooks/useBlockchainServices'
import { RootStackParamList } from '../navigation/AppNavigation'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Normalize } from '~src/app/Normalize'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  contactName?: string
  address?: string
  walletName?: string
  accountName?: string
  hideTitles?: boolean
  hideButton?: boolean
}

export const TransactionAccountCard = (props: Props) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()
  const { getBlockchainByAddress } = useBlockchainServiceUtils()
  const blockchain = props.address ? getBlockchainByAddress(props.address) : undefined

  const handlePress = () => {
    if (!props.address) {
      return
    }

    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.PersistContactModal.name,
      params: {
        startingAddress: props.address,
      },
    })
  }

  return (
    <LinearLayout borderRadius="7px" bg="background.14" pt="12px" pb="12px" pl="16px" pr="16px" mt={4}>
      {props.contactName && (
        <TextView width="100%" fontFamily="medium" color="text.0" fontSize="14px">
          {props.contactName}
        </TextView>
      )}

      {props.accountName && props.walletName && (
        <LinearLayout orientation="horiz">
          {props.walletName && (
            <LinearLayout weight={1}>
              {!props.hideTitles && (
                <TextView color="text.10" fontSize="14px">
                  Wallet
                </TextView>
              )}

              <TextView fontSize="16px" color="text.0">
                {props.walletName}
              </TextView>
            </LinearLayout>
          )}

          {props.accountName && (
            <LinearLayout weight={1}>
              {!props.hideTitles && (
                <TextView fontSize="14px" fontWeight={500} fontFamily="medium" color="text.10">
                  Account
                </TextView>
              )}

              <TextView fontSize="16px" fontWeight={500} fontFamily="medium" color="text.0" mb={2}>
                {props.accountName}
              </TextView>
            </LinearLayout>
          )}
        </LinearLayout>
      )}

      {props.address && (
        <LinearLayout>
          <LinearLayout orientation="horiz" alignItems="center">
            {blockchain && (
              <TextView color="text.10" fontSize="14px">
                {I18n.t(`blockchainServices.${blockchain}.id`)}
              </TextView>
            )}

            {!props.hideButton && !props.contactName && (
              <ButtonView onPress={handlePress} ml="4px">
                <ImageView
                  width={Normalize.scale(20)}
                  height={Normalize.scale(20)}
                  resizeMode="contain"
                  source={require('~/src/assets/images/icon-circle-plus-green-small.png')}
                />
              </ButtonView>
            )}
          </LinearLayout>
          <TextView numberOfLines={1} color="primary" fontSize="16px" ellipsizeMode="middle" fontFamily="medium">
            {props.address}
          </TextView>
        </LinearLayout>
      )}
    </LinearLayout>
  )
}
