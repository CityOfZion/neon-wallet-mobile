import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { IconButton } from '~/src/components/IconButton'
import { WalletCardIcon } from '~/src/components/WalletCardIcon'
import { useLocalAuthentication } from '~/src/hooks/useLocalAuthentication'
import { Wallet } from '~/src/store/wallet/Wallet'
import { ButtonView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  wallet: Wallet
  success?: boolean
}

export const Item = React.memo(({ wallet, success }: Props) => {
  const navigation = useNavigation()
  const { authenticate } = useLocalAuthentication()

  const handlePress = async () => {
    try {
      await authenticate()

      navigation.navigate(wrapper.route.Step1BackupWallet.name, {
        wallet,
      })
    } catch {}
  }

  return (
    <ButtonView disabled={success} onPress={handlePress}>
      <LinearLayout orientation="horiz" alignItems="center" p="12px" justifyContent="space-between">
        <LinearLayout orientation="horiz" alignItems="center">
          <WalletCardIcon wallet={wallet} />
          <TextView color="text.0" fontFamily="regular" fontSize="lg" ml="18px">
            {wallet.name}
          </TextView>
        </LinearLayout>

        <IconButton type={success ? 'check-green' : 'alter-right-arrow-green'} width={18} height={18} />
      </LinearLayout>
    </ButtonView>
  )
})
