import {RouteProp} from '@react-navigation/native'
import {AwaitActivity} from '@simpli/react-native-await'
import React from 'react'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface SendTransactionConfirmationModalParams {
  transactionHash: string
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & WalletStackParamList>
  route: RouteProp<ModalStackParamList, 'SendTransactionConfirmationModal'>
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
      title={Facade.t('modals.send.title')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/upload-white.png')}
    >
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
          {Facade.t('modals.send.transactionConfirmation.header')}
        </TextView>

        <TextView
          color="text.2"
          fontSize="18px"
          fontFamily="medium"
          textAlign="center"
          mb="40px"
        >
          {Facade.t('modals.send.transactionConfirmation.subheader')}
        </TextView>

        <TextView color="text.2" fontSize="14px" fontFamily="medium" mb="12px">
          {Facade.t('modals.send.transactionConfirmation.transactionId')}
        </TextView>

        <ButtonView
          orientation="horiz"
          alignItems="center"
          mb="24px"
          onPress={() =>
            Facade.utils.copyToClipboard(props.route.params.transactionHash)
          }
        >
          <TextView
            maxWidth="80%"
            color="primary"
            fontSize="14px"
            fontFamily="medium"
            mr="16px"
          >
            {props.route.params.transactionHash}
          </TextView>
          <ImageView
            width="16px"
            resizeMode="contain"
            source={require('~src/assets/images/icon-copy-green.png')}
          />
        </ButtonView>

        <LinearLayout mt="auto" px="20px" width="100%">
          <ThemedButton
            onPress={() => {
              controller.close()
              // TODO: make the entire SendTransaction flux be inside a single modal and remove the line below
              props.navigation.navigate(Facade.route.ListWallets.name)
            }}
            fontSize="22px"
            label={Facade.t('app.close')}
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendTransactionConfirmationModal
