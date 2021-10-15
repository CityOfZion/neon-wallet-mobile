import {RouteProp, useNavigationState} from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import {ScrollView, TouchableHighlight} from 'react-native'

import {useHeaderHeight} from '~/node_modules/@react-navigation/stack'
import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {wrapper} from '~/src/app/ApplicationWrapper'
import {UtilsHelper} from '~/src/helpers/UtilsHelper'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {SendModalStackParamList} from '~src/navigation/SendModalStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface SendTransactionConfirmationModalParams {
  transactionHash?: string
}

interface Props {
  navigation: StackNavigationProp<SendModalStackParamList>
  route: RouteProp<SendModalStackParamList, 'SendTransactionConfirmationModal'>
}

const SendTransactionConfirmationModal = (props: Props) => {
  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      wrapper.route.SendTransactionConfirmationModal.name
  )

  return show ? (
    <ScrollView
      style={{
        width: '100%',
        marginTop: useHeaderHeight(),
      }}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: PANEL_OFFSET + 20,
        paddingLeft: 15,
        paddingRight: 15,
      }}
    >
      <TouchableHighlight>
        <LinearLayout
          height="100%"
          width="100%"
          orientation="verti"
          alignItems="center"
        >
          <ImageView
            width="66%"
            resizeMode="contain"
            source={require('~src/assets/images/transaction-sent.png')}
          />

          <LinearLayout orientation={'horiz'}>
            <ImageView
              source={require('~/src/assets/images/icon-circle-check-green.png')}
              alignSelf={'center'}
              maxHeight={'24px'}
              resizeMode={'contain'}
              mr={2}
            />
            <TextView
              color="text.0"
              fontSize="18px"
              fontFamily="medium"
              mb="5px"
              numberOfLines={1}
            >
              {i18n.t('modals.send.transactionConfirmation.header')}
            </TextView>
          </LinearLayout>
          {props.route.params.transactionHash && (
            <>
              <TextView
                color="text.2"
                fontSize="14px"
                fontFamily="medium"
                textAlign="center"
                mb="40px"
              >
                {i18n.t('modals.send.transactionConfirmation.subheader')}
              </TextView>

              <TextView
                color="text.2"
                fontSize="14px"
                fontFamily="medium"
                mb="12px"
              >
                {i18n.t('modals.send.transactionConfirmation.transactionId')}
              </TextView>
              <ButtonView
                orientation="horiz"
                alignItems="center"
                mb="24px"
                onPress={() =>
                  UtilsHelper.copyToClipboard(
                    props.route.params.transactionHash
                  )
                }
              >
                <TextView
                  maxWidth="80%"
                  color="primary"
                  fontSize="14px"
                  fontFamily="medium"
                  mr="16px"
                  textAlign="center"
                >
                  {props.route.params.transactionHash}
                </TextView>
                <ImageView
                  width="16px"
                  resizeMode="contain"
                  source={require('~src/assets/images/icon-copy-green.png')}
                />
              </ButtonView>
            </>
          )}

          <LinearLayout mt="auto" px="20px" width="100%">
            <ThemedButton
              onPress={() => {
                props.navigation.pop()
              }}
              fontSize="22px"
              label={i18n.t('app.close')}
            />
          </LinearLayout>
        </LinearLayout>
      </TouchableHighlight>
    </ScrollView>
  ) : (
    <LinearLayout />
  )
}

export default SendTransactionConfirmationModal
