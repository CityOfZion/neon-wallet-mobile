import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Button } from '~/src/components/Button'
import SwiperPanel, { CloseButton, useSwiperController } from '~/src/components/SwiperPanel'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { Wallet } from '~/src/store/wallet/Wallet'
import { ImageView, TextView } from '~/src/styles/styled-components'

export interface BackupInfoModalParams {
  wallet: Wallet
}
interface Props {
  navigation: StackNavigationProp<RootStackParamList & TabStackParamList & WalletStackParamList>
  route: RouteProp<ModalStackParamList, 'BackupInfoModal'>
}

export const BackupInfoModal = (props: Props) => {
  const { wallet } = props.route.params

  const controller = useSwiperController(true)

  const handlePress = () => {
    controller.close()
    props.navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.Step1BackupWallet.name,
        params: {
          wallet,
        },
      },
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.backupInfoModal.title')}
      onClose={props.navigation.goBack}
      rightButton={<CloseButton onPress={controller.close} />}
      contentStyle={{ alignItems: 'center' }}
    >
      <ImageView source={require('~src/assets/images/backup-info-feature.png')} />

      <TextView fontFamily="bold" color="text.0" fontSize="lg" textAlign="center">
        {i18n.t('modals.backupInfoModal.description1')}
      </TextView>
      <TextView fontFamily="bold" color="text.0" fontSize="lg" textAlign="center" mt="24px">
        {i18n.t('modals.backupInfoModal.description2')}
      </TextView>

      <Button label={i18n.t('modals.backupInfoModal.buttonLabel')} my="32px" onPress={handlePress} />

      <ImageView source={require('~src/assets/images/backup-info-explanation.png')} />

      <TextView fontFamily="regular" color="text.0" fontSize="lg" textAlign="center">
        {i18n.t('modals.backupInfoModal.description3')}
      </TextView>
    </SwiperPanel>
  )
}
