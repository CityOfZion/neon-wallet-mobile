import i18n from 'i18n-js'
import React from 'react'
import {ScrollView} from 'react-native'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const SendTransactionConfirmationModal = (props: Props) => {
  const controller = useSwiperController(true)

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={0}
      paddingLeft={0}
      title={i18n.t('modals.send.title')}
      rightButton={'X    '}
      onRightPress={() => controller.close()}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/upload-white.png')}
    >
      <ScrollView>
        <LinearLayout
          height="100%"
          width="100%"
          px="15px"
          orientation="verti"
          alignItems="center"
        >
          <ImageView
            width="66%"
            resizeMode="contain"
            source={require('~src/assets/images/transaction-sent.png')}
          />
          <TextView color="text.0" fontSize="24px" fontFamily="medium" mb="5px">
            {i18n.t('modals.send.transactionConfirmation.header')}
          </TextView>
          <TextView
            color="text.2"
            fontSize="18px"
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
          <LinearLayout orientation="horiz" alignItems="center" mb="24px">
            <TextView
              maxWidth="80%"
              color="primary"
              fontSize="14px"
              fontFamily="medium"
              mr="16px"
            >
              AN8iLVt18CKoATdexztCQj923hw5gkc41A
            </TextView>
            <ImageView
              width="16px"
              resizeMode="contain"
              source={require('~src/assets/images/icon-copy-green.png')}
            />
          </LinearLayout>
          <LinearLayout mt="auto" px="20px" width="100%">
            <ThemedButton
              onPress={() => controller.close()}
              fontSize="22px"
              label={i18n.t('app.close')}
            />
          </LinearLayout>
        </LinearLayout>
      </ScrollView>
    </SwiperPanel>
  )
}

export default SendTransactionConfirmationModal
