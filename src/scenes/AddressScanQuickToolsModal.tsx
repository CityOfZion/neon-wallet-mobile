import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useRef } from 'react'

import { wrapper } from '../app/ApplicationWrapper'
import { AlterMenuItem } from '../components/AlterMenuItem'
import SwiperPanel, { useSwiperController } from '../components/SwiperPanel'
import { useBlockchainServiceUtils } from '../hooks/useBlockchainServices'
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
  const { getBlockchainByAddress } = useBlockchainServiceUtils()

  const callback = useRef<() => Promise<void> | void>()

  const handlePressSend = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WalletSelectionModal.name,
      params: {
        textSchema: 'modals.sendSelectionModal',
        disconnectDisable: true,
        noBalanceDisable: true,
        onFinish: params => {
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.SendTransactionModal.name,
            params: {
              ...params,
              address: props.route.params.address,
            },
          })
        },
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
    const blockchain = getBlockchainByAddress(props.route.params.address)
    if (!blockchain) return
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.PersistContactModal.name,
      params: {
        startingAddress: {
          blockchain,
          addressOrDomain: props.route.params.address,
        },
      },
    })
  }

  const run = (cb: () => void) => {
    callback.current = cb
    controller.close()
  }

  const handleClose = () => {
    props.navigation.reset({
      index: 0,
      routes: [
        {
          name: wrapper.route.Tab.name,
        },
      ],
    })

    if (callback.current) {
      callback.current()
    }
  }

  return (
    <SwiperPanel controller={controller} size="dinamic" withoutHeader onClose={handleClose}>
      <AlterMenuItem
        onPress={() => run(handlePressSend)}
        icon={require('~src/assets/images/icon-circle-send-primary.png')}
        title={i18n.t('modals.handleQrCode.send.title')}
        subtitle={i18n.t('modals.handleQrCode.send.subtitle')}
      />

      <AlterMenuItem
        onPress={() => run(handlePressImport)}
        icon={require('~src/assets/images/icon-cicle-watch-primary.png')}
        title={i18n.t('modals.handleQrCode.watch.title')}
        subtitle={i18n.t('modals.handleQrCode.watch.subtitle')}
      />

      <AlterMenuItem
        onPress={() => run(handlePressContact)}
        icon={require('~src/assets/images/icon-cicle-contacts-primary.png')}
        title={i18n.t('modals.handleQrCode.contact.title')}
        subtitle={i18n.t('modals.handleQrCode.contact.subtitle')}
        withSeparator={false}
      />
    </SwiperPanel>
  )
}
