import { useNavigation } from '@react-navigation/native'
import I18n from 'i18n-js'
import React from 'react'
import { useDispatch } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Button } from '~/src/components/Button'
import { IconButton } from '~/src/components/IconButton'
import { Wallet } from '~/src/store/wallet/Wallet'
import { walletReducerActions } from '~/src/store/wallet/WalletReducer'
import { ImageView, LinearLayout } from '~/src/styles/styled-components'

type Props = {
  selectedWallet?: Wallet
}

export const Header = ({ selectedWallet }: Props) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const handlePressMore = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WalletContextModal.name,
      params: { wallet: selectedWallet },
    })
  }

  const handlePressWarning = () => {
    if (!selectedWallet) return

    selectedWallet.backupStatus = 'unsuccessful_with_knowledge'
    dispatch(walletReducerActions.saveWallet(selectedWallet))
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.BackupInfoModal.name,
      params: {
        wallet: selectedWallet,
      },
    })
  }

  return (
    <LinearLayout orientation="horiz" width="100%" px="22px" mt="16px" justifyContent="flex-end" alignItems="center">
      {selectedWallet?.backupStatus === 'unsuccessful' ? (
        <LinearLayout orientation="horiz" alignItems="center" flex={1} justifyContent="center" marginLeft="32px">
          <Button
            label={I18n.t('screens.listWalletView.walletBackupButtonLabel')}
            icon={require('~src/assets/images/icon-warning-green.png')}
            labelStyle={{ letterSpacing: 0.6, fontSize: 'xs' }}
            iconStyle={{ width: 20, height: 18 }}
            onPress={handlePressWarning}
          />
        </LinearLayout>
      ) : (
        selectedWallet?.backupStatus === 'unsuccessful_with_knowledge' && (
          <ImageView source={require('~src/assets/images/icon-warning-green.png')} style={{ width: 20, height: 18 }} />
        )
      )}

      <IconButton type="more-primary" onPress={handlePressMore} />
    </LinearLayout>
  )
}
