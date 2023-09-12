import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'

import { AlterMenuItem } from '~/src/components/AlterMenuItem'
import { Button } from '~/src/components/Button'
import { useLocalAuthentication } from '~/src/hooks/useLocalAuthentication'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { Wallet } from '~/src/store/wallet/Wallet'
import { wrapper } from '~src/app/ApplicationWrapper'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'

export interface WalletContextModalParams {
  wallet?: Wallet
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & WalletStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WalletContextModal'>
}

export default function WalletContextModal(props: Props) {
  const { wallet } = props.route.params

  const wallets = useSelector(selectWallets)
  const controller = useSwiperController(true)
  const { authenticate } = useLocalAuthentication()

  const callback = useRef<() => Promise<void> | void>()

  const handlePressCreate = () => {
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.More.name,
      params: {
        screen: wrapper.route.Step1CreateWallet.name,
        initial: false,
        params: {
          source: wrapper.route.WalletContextModal.name,
        },
      },
    })
  }

  const handlePressBackup = async () => {
    if (!wallet) return

    try {
      await authenticate()
      props.navigation.navigate(wrapper.route.Step1BackupWallet.name, {
        wallet,
      })
    } catch {}
  }

  const handlePressReorder = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.ReorderWalletModal.name,
    })
  }

  const run = (cb: () => void) => {
    callback.current = cb
    controller.close()
  }

  const handleClose = () => {
    props.navigation.goBack()

    if (callback.current) {
      callback.current()
    }
  }

  return (
    <SwiperPanel controller={controller} size="dinamic" withoutHeader onClose={handleClose}>
      {wallets.length > 0 && !!wallet && wallet.walletType === 'standard' && (
        <AlterMenuItem
          title={i18n.t('modals.walletContext.backup')}
          titleIcon={
            wallet.backupStatus !== 'successful' ? require('~src/assets/images/icon-warning-green.png') : undefined
          }
          icon={require('~src/assets/images/icon-circle-backup-green.png')}
          onPress={() => run(handlePressBackup)}
        />
      )}

      <AlterMenuItem
        title={i18n.t('modals.walletContext.create')}
        icon={require('~src/assets/images/icon-circle-plus-green.png')}
        onPress={() => run(handlePressCreate)}
      />

      {wallets.length > 0 && (
        <AlterMenuItem
          title={i18n.t('modals.walletContext.reorder')}
          icon={require('~src/assets/images/icon-circle-swap-green.png')}
          onPress={() => run(handlePressReorder)}
        />
      )}

      <Button
        label={i18n.t('modals.walletContext.cancel')}
        justifyContent="center"
        mt="36px"
        labelStyle={{ fontSize: '2xl' }}
        onPress={controller.close}
      />
    </SwiperPanel>
  )
}
