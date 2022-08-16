import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import {
  blockchainServices,
  getBlockchainByWif,
  validateAddressAllBlockchains,
  validatePrivateKeyWithPasswordAllBlockchains,
  validateWifAllBlockchains,
} from '../blockchain'
import { QuickToolsItem, QuickToolsItemSeparator } from '../components/QuickToolsItem'
import { UriHelper } from '../helpers/UriHelper'
import { WalletConnectHelper } from '../helpers/WalletConnectHelper'
import { useBlockchainActions } from '../hooks/useBlockchainActions'
import { ModalStackParamList } from '../navigation/ModalStackNavigation'
import { WalletStackParamList } from '../navigation/WalletsStackNavigation'
import { selectAccounts } from '../store/account/SelectorAccount'
import { selectWallets } from '../store/wallet/SelectorWallet'

import { wrapper } from '~src/app/ApplicationWrapper'
import SwiperPanel, { SwiperController } from '~src/components/SwiperPanel'
import { applicationConfig } from '~src/config/ApplicationConfig'
import { RootStackParamList } from '~src/navigation/AppNavigation'

interface Props {
  controller: SwiperController
}

export default function QuickToolsMenu(props: Props) {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList & WalletStackParamList>>()
  const blockchainActions = useBlockchainActions()
  const wallets = useSelector(selectWallets)
  const accounts = useSelector(selectAccounts)

  const handleScanQrCode = async (data: string) => {
    const sendUri = UriHelper.validateAndParse(data)

    if (sendUri) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.SendTransactionWalletSelectionModal.name,
        params: {
          address: sendUri.address,
        },
      })
      return
    }

    if (WalletConnectHelper.isValidURI(data)) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WCConnectionRequestModal.name,
        params: {
          uri: data,
        },
      })
      return
    }

    if (validateAddressAllBlockchains(data)) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.AddressScanQuickToolsModal.name,
        params: {
          address: data,
        },
      })
      return
    }

    if (validatePrivateKeyWithPasswordAllBlockchains(data)) {
      navigation.navigate(wrapper.route.Tab.name, {
        screen: wrapper.route.More.name,
        params: {
          screen: wrapper.route.Passphrase.name,
          initial: false,
          params: {
            encryptedKey: data,
          },
        },
      })
      return
    }

    if (validateWifAllBlockchains(data)) {
      const blockchain = getBlockchainByWif(data)
      if (blockchain) {
        const address = blockchainServices[blockchain].generateAccountFromWif(data)

        if (accounts.some(account => account.address === address)) {
          showMessage({ message: i18n.t('quickTools.send.accountAlreadyExists') })
          return
        }

        const walletId = await blockchainActions.createLegacyWallet(i18n.t('modals.blockchainList.encryptedWallet'))

        await blockchainActions.importAccounts([{ address, blockchain, type: 'account', walletId, wif: data }])

        const account = accounts.find(account => account.address === address)
        const wallet = wallets.find(wallet => wallet.id === walletId)

        if (!account || !wallet) return

        navigation.navigate(wrapper.route.GetWallet.name, { wallet })
        navigation.navigate(wrapper.route.GetAccount.name, { account, wallet })
        navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.EditAccountModal.name,
          params: { account },
        })
      }
    }
  }

  const handlePressQrCode = () => {
    navigation.navigate(wrapper.route.QRCodeScan.name, {
      onScan: handleScanQrCode,
    })
  }

  const handlePressSend = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionWalletSelectionModal.name,
      params: {},
    })
  }

  const handlePressReceive = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.ReceiveTransactionWalletSelectionModal.name,
      params: {},
    })
  }

  const runClosing = (callback: () => void) => {
    props.controller.close()
    callback()
  }

  return (
    <SwiperPanel
      controller={props.controller}
      noHeader
      draggable
      paddingTop={20}
      paddingBottom={24 + applicationConfig.footerHeight + useSafeAreaInsets().bottom}
      paddingLeft={0}
      paddingRight={0}
      solidColorBG
    >
      <QuickToolsItem
        onPress={() => runClosing(handlePressQrCode)}
        sourceIcon={require('~src/assets/images/icon-circle-qr-primary.png')}
        title={i18n.t('quickTools.qrCode.title')}
        subtitle={i18n.t('quickTools.qrCode.subtitle')}
      />

      <QuickToolsItemSeparator />

      <QuickToolsItem
        onPress={() => runClosing(handlePressSend)}
        sourceIcon={require('~src/assets/images/icon-circle-send-primary.png')}
        title={i18n.t('quickTools.send.title')}
        subtitle={i18n.t('quickTools.send.subtitle')}
      />

      <QuickToolsItemSeparator />

      <QuickToolsItem
        onPress={() => runClosing(handlePressReceive)}
        sourceIcon={require('~src/assets/images/icon-circle-receive-primary.png')}
        title={i18n.t('quickTools.receive.title')}
        subtitle={i18n.t('quickTools.receive.subtitle')}
      />
    </SwiperPanel>
  )
}
