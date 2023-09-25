import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { Normalize } from '~/src/app/Normalize'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface SendTransactionConfirmationModalParams {
  transactionHash: string
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SendTransactionConfirmationModal'>
}

const SendTransactionConfirmationModal = (props: Props) => {
  const controller = useSwiperController(true)

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.sendTransactionConfirmationModal.title')}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={props.navigation.goBack}
    >
      <LinearLayout alignItems="center" flexGrow={1}>
        <ImageView
          resizeMode="contain"
          source={require('~src/assets/images/transaction-sent.png')}
          style={{
            width: '66%',
          }}
        />

        <LinearLayout orientation="horiz">
          <ImageView
            source={require('~/src/assets/images/icon-circle-check-green.png')}
            alignSelf="center"
            height={Normalize.scale(24)}
            width={Normalize.scale(24)}
            resizeMode="contain"
            mr={2}
          />
          <TextView color="text.0" fontSize="18px" fontFamily="medium" mb="5px" numberOfLines={1}>
            {i18n.t('modals.sendTransactionConfirmationModal.header')}
          </TextView>
        </LinearLayout>

        <TextView color="text.2" fontSize="14px" fontFamily="medium" textAlign="center" mb="40px">
          {i18n.t('modals.sendTransactionConfirmationModal.subheader')}
        </TextView>

        <TextView color="text.2" fontSize="14px" fontFamily="medium" mb="12px">
          {i18n.t('modals.sendTransactionConfirmationModal.transactionId')}
        </TextView>
        <ButtonView
          orientation="horiz"
          alignItems="center"
          onPress={() => UtilsHelper.copyToClipboard(props.route.params.transactionHash)}
        >
          <TextView maxWidth="80%" color="primary" fontSize="14px" fontFamily="medium" mr="16px" textAlign="center">
            {props.route.params.transactionHash}
          </TextView>
          <ImageView
            height={Normalize.scale(16)}
            width={Normalize.scale(16)}
            resizeMode="contain"
            source={require('~src/assets/images/icon-copy-green.png')}
          />
        </ButtonView>
      </LinearLayout>

      <LinearLayout mt="40px" width="100%">
        <ThemedButton onPress={controller.close} fontSize="22px" label={i18n.t('app.close')} />
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendTransactionConfirmationModal
