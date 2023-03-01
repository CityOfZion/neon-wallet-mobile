import React from 'react'
import { useSelector } from 'react-redux'

import { WithAccountsToBackup } from './WithAccountsToBackup'
import { WithoutAccountsToBackup } from './WithoutAccountsToBackup'

import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'

export const SecurityBackupCheckPage = () => {
  const wallets = useSelector(selectWallets)

  const standartWallets = wallets.filter(wallet => wallet.walletType === 'standard')

  const walletWithoutBackup = standartWallets.filter(wallet => wallet.backupStatus !== 'successful')

  return (
    <ScreenLayout darkerSolidColorBG scrollable={false}>
      {walletWithoutBackup.length > 0 ? (
        <WithAccountsToBackup wallets={walletWithoutBackup} />
      ) : (
        <WithoutAccountsToBackup wallets={standartWallets} />
      )}
    </ScreenLayout>
  )
}
