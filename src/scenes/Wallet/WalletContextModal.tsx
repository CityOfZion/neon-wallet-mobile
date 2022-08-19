import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { AlterMenuItem } from '~/src/components/AlterMenuItem'
import { Button } from '~/src/components/Button'
import { useLocalAuthentication } from '~/src/hooks/useLocalAuthentication'
import { Wallet } from '~/src/models/redux/Wallet'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { wrapper } from '~src/app/ApplicationWrapper'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout } from '~src/styles/styled-components'

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

  const handlePressCreate = () => {
    controller.close()
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
    controller.close()
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.ReorderWalletModal.name,
    })
  }

  return (
    <SwiperPanel controller={controller} noHeader padding={36} onClose={props.navigation.goBack} solidColorBG>
      <LinearLayout>
        {wallets.length > 0 && !!wallet && wallet.walletType === 'standard' && (
          <AlterMenuItem
            title={i18n.t('modals.walletContext.backup')}
            titleIcon={
              wallet.backupStatus !== 'successful' ? require('~src/assets/images/icon-warning-green.png') : undefined
            }
            icon={require('~src/assets/images/icon-circle-backup-green.png')}
            onPress={handlePressBackup}
          />
        )}

        <AlterMenuItem
          title={i18n.t('modals.walletContext.create')}
          icon={require('~src/assets/images/icon-circle-plus-green.png')}
          onPress={handlePressCreate}
        />

        {wallets.length > 0 && (
          <AlterMenuItem
            title={i18n.t('modals.walletContext.reorder')}
            icon={require('~src/assets/images/icon-circle-swap-green.png')}
            onPress={handlePressReorder}
          />
        )}

        <Button
          label={i18n.t('modals.walletContext.cancel')}
          justifyContent="center"
          mt="36px"
          labelStyle={{ fontSize: '2xl' }}
          onPress={controller.close}
        />
      </LinearLayout>
    </SwiperPanel>
  )
}
