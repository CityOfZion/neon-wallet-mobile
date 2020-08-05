import {RouteProp} from '@react-navigation/native'
import React, {Fragment, useState} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {NeoURI} from '~src/helpers/UriHelper'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export enum Priority {
  FAST,
  FASTER,
  FASTEST,
}

export interface SendTransactionInputModalParams {
  walletTitle: string
  account: Account
  uri?: NeoURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SendTransactionInputModal'>
}

const SendTransactionInputModal = (prop: Props) => {
  const controller = useSwiperController(true)
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const [text, setText] = useState(prop.route.params?.uri?.address ?? '')
  const [amount, setAmount] = useState(prop.route.params?.uri?.amount ?? 0)
  // TODO: convert hash into TokenValue
  // const hash = props.route.params?.uri?.asset ?? ''
  const [token, setToken] = useState<TokenAsset | null>(null)

  // Typeguard
  function isURI(object: any): object is NeoURI {
    return !!(object as NeoURI).address
  }

  const handleQrCode = (data: NeoURI | string) => {
    if (isURI(data)) {
      setText(data.address)
    } else {
      setText(data)
    }
  }

  const priorityIconInactive = require('~src/assets/images/icon-flash-grey.png')
  const priorityIconActive = require('~src/assets/images/icon-flash-primary.png')

  const PriorityTab = () => {
    const [priority, setPriority] = useState(Priority.FAST)

    return (
      <LinearLayout
        orientation="horiz"
        bg="background.1"
        borderRadius={8}
        mb="58px"
        height="75px"
      >
        <ButtonView
          bg={priority === Priority.FAST ? 'background.0' : 'background.1'}
          weight={1}
          p="16px"
          borderBottomLeftRadius={8}
          borderTopLeftRadius={8}
          justifyContent="center"
          onPress={() => setPriority(Priority.FAST)}
        >
          <LinearLayout orientation="horiz" alignItems="center">
            <ImageView
              source={
                priority === Priority.FAST
                  ? priorityIconActive
                  : priorityIconInactive
              }
            />
            <LinearLayout ml="8px">
              <TextView
                color={priority === Priority.FAST ? 'primary' : 'text.3'}
                fontSize="16px"
                fontFamily="semibold"
              >
                Fast
              </TextView>
              <TextView
                color={priority === Priority.FAST ? 'primary' : 'text.3'}
                fontSize="12px"
              >
                0.00001 GAS
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </ButtonView>
        <ButtonView
          weight={1}
          bg={priority === Priority.FASTER ? 'background.0' : 'background.1'}
          p="16px"
          borderStyle="solid"
          borderLeftWidth={1}
          borderRightWidth={1}
          borderColor="black"
          justifyContent="center"
          onPress={() => setPriority(Priority.FASTER)}
        >
          <LinearLayout orientation="horiz" alignItems="center">
            <ImageView
              source={
                priority === Priority.FASTER
                  ? priorityIconActive
                  : priorityIconInactive
              }
            />
            <LinearLayout ml="8px">
              <TextView
                color={priority === Priority.FASTER ? 'primary' : 'text.3'}
                fontSize="16px"
                fontFamily="semibold"
              >
                Faster
              </TextView>
              <TextView
                color={priority === Priority.FASTER ? 'primary' : 'text.3'}
                fontSize="12px"
              >
                0.00001 GAS
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </ButtonView>
        <ButtonView
          weight={1}
          bg={priority === Priority.FASTEST ? 'background.0' : 'background.1'}
          p="16px"
          borderBottomRightRadius={8}
          borderTopRightRadius={8}
          justifyContent="center"
          onPress={() => setPriority(Priority.FASTEST)}
        >
          <LinearLayout orientation="horiz" alignItems="center">
            <ImageView
              source={
                priority === Priority.FASTEST
                  ? priorityIconActive
                  : priorityIconInactive
              }
            />
            <LinearLayout ml="8px">
              <TextView
                color={priority === Priority.FASTEST ? 'primary' : 'text.3'}
                fontSize="16px"
                fontFamily="semibold"
              >
                Fastest
              </TextView>
              <TextView
                color={priority === Priority.FASTEST ? 'primary' : 'text.3'}
                fontSize="12px"
              >
                0.00001 GAS
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </ButtonView>
      </LinearLayout>
    )
  }

  const DestinationAddressField = () => {
    return (
      <Fragment>
        <InputLabel
          title={Facade.t('modals.send.transactionInput.destinationAddress')}
          color={'text.0'}
          marginTop={30}
          marginBottom={30}
          capitalize={true}
        />
        <InputWithValidation
          onChangeText={setText}
          color={theme.colors.text[0]}
          invalidColor={theme.colors.text[10]}
          value={text}
          placeholder={Facade.t(
            'modals.send.transactionInput.enterDestination'
          )}
          validator={() => true}
          separatorColor={theme.colors.background[13]}
          sideMargins={0}
          showContacts={true}
          onScan={handleQrCode}
        />
      </Fragment>
    )
  }

  const TokenField = () => {
    return (
      <Fragment>
        <InputLabel
          title={Facade.t('modals.send.transactionInput.token')}
          color={'text.0'}
          marginTop={50}
          marginBottom={30}
          capitalize={true}
        />

        <ButtonView
          onPress={() => {
            prop.navigation.navigate(Facade.route.ListTokenModal.name, {
              selectedToken: token,
              setToken,
              account: prop.route.params.account,
              filterBy: 'send',
            })
          }}
        >
          <LinearLayout position="relative">
            <InputWithValidation
              color={theme.colors.text[0]}
              invalidColor={theme.colors.text[10]}
              fontStyle={'normal'}
              value={token?.name ?? ''}
              placeholder={Facade.t('modals.send.transactionInput.selectToken')}
              validator={() => true}
              separatorColor={theme.colors.background[13]}
              sideMargins={0}
              hidePaste={true}
              hideScan={true}
              editable={false}
            />
            <ImageView
              position="absolute"
              top="10px"
              right="15px"
              resizeMode="contain"
              width="12px"
              source={require('~/src/assets/images/icon-arrow-down-green.png')}
            />
          </LinearLayout>
        </ButtonView>
      </Fragment>
    )
  }

  const AmountField = () => {
    return (
      <Fragment>
        <InputLabel
          title={Facade.t('modals.send.transactionInput.amount')}
          color={'text.0'}
          marginTop={30}
          marginBottom={20}
          capitalize={true}
        />
        <InputWithValidation
          onChangeText={(text) => setAmount(Number(text))}
          color={theme.colors.text[0]}
          invalidColor={theme.colors.text[10]}
          value={String(amount)}
          placeholder={Facade.t('modals.send.transactionInput.enterAmount')}
          validator={() => true}
          separatorColor={theme.colors.background[13]}
          sideMargins={0}
          hidePaste={true}
          hideScan={true}
          keyboardType="numeric"
        />
      </Fragment>
    )
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={8}
      paddingLeft={0}
      title={Facade.t('modals.send.title')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
      onClose={() => prop.navigation.goBack()}
      image={require('~/src/assets/images/upload-white.png')}
    >
      <LinearLayout height="100%" width="100%" px="15px" orientation="verti">
        <TextView
          mb="24px"
          alignSelf="center"
          color="text.3"
          fontSize="md"
          fontFamily="bold"
        >
          {prop.route.params.walletTitle}
        </TextView>
        <AccountCard account={prop.route.params.account} />
        <TouchableWithoutFeedback onPress={() => prop.navigation.goBack()}>
          <LinearLayout
            orientation="horiz"
            alignSelf="center"
            alignItems="center"
            mt="40px"
          >
            <ImageView
              source={require('~/src/assets/images/icon-reselect-green.png')}
            />
            <TextView ml="6px" color="primary" fontFamily="medium">
              {Facade.t('modals.send.transactionInput.selectDifferentAccount')}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>
        <TextView
          mt="40px"
          alignSelf="center"
          color="text.3"
          fontSize="md"
          fontFamily="bold"
        >
          {Facade.t('modals.send.transactionInput.transactionDetails')}
        </TextView>
        <DestinationAddressField />
        <TokenField />
        <AmountField />
        <TextView
          mt="56px"
          mb="24px"
          fontFamily="semibold"
          color="text.0"
          alignSelf="center"
          fontSize="14px"
        >
          {Facade.t(
            'modals.send.transactionInput.prioritiseTransfer'
          ).toUpperCase()}
        </TextView>
        <PriorityTab />
        <LinearLayout mb="58px" px="24px" alignSelf="center" width="100%">
          <ThemedButton
            label={Facade.t('app.next')}
            onPress={() =>
              prop.navigation.navigate(
                Facade.route.SendTransactionReviewModal.name
              )
            }
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendTransactionInputModal
