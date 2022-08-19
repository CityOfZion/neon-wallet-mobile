import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import { wrapper } from '../app/ApplicationWrapper'
import { AlterMenuItem } from '../components/AlterMenuItem'
import SwiperPanel, { useSwiperController } from '../components/SwiperPanel'
import { RootStackParamList } from '../navigation/AppNavigation'
import { ModalStackParamList } from '../navigation/ModalStackNavigation'

export interface AddressScanQuickToolsModalParams {
  address: string
}

export interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'AddressScanQuickToolsModal'>
}

export const AddressScanQuickToolsModal = (props: Props) => {
  const controller = useSwiperController(true)

  const handlePressSend = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionWalletSelectionModal.name,
      params: {
        address: props.route.params.address,
      },
    })
  }

  const handlePressImport = () => {
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.More.name,
      params: {
        screen: wrapper.route.ImportReadAccount.name,
        params: {
          address: props.route.params.address,
        },
      },
    })
  }

  const handlePressContact = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.PersistContact.name,
      params: {
        startingAddress: props.route.params.address,
      },
    })
  }

  const runClosing = (callback: () => void) => {
    controller.close()
    props.navigation.reset({
      index: 0,
      routes: [
        {
          name: wrapper.route.Tab.name,
        },
      ],
    })
    callback()
  }

  return (
    <SwiperPanel
      controller={controller}
      noHeader
      draggable
      paddingTop={36}
      solidColorBG
      onClose={props.navigation.goBack}
    >
      <AlterMenuItem
        onPress={() => runClosing(handlePressSend)}
        icon={require('~src/assets/images/icon-circle-send-primary.png')}
        title={i18n.t('modals.handleQrCode.send.title')}
        subtitle={i18n.t('modals.handleQrCode.send.subtitle')}
      />

      <AlterMenuItem
        onPress={() => runClosing(handlePressImport)}
        icon={require('~src/assets/images/icon-cicle-watch-primary.png')}
        title={i18n.t('modals.handleQrCode.watch.title')}
        subtitle={i18n.t('modals.handleQrCode.watch.subtitle')}
      />

      <AlterMenuItem
        onPress={() => runClosing(handlePressContact)}
        icon={require('~src/assets/images/icon-cicle-contacts-primary.png')}
        title={i18n.t('modals.handleQrCode.contact.title')}
        subtitle={i18n.t('modals.handleQrCode.contact.subtitle')}
        withSeparator={false}
      />
    </SwiperPanel>
  )
}
