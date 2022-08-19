import React from 'react'
import { useSelector } from 'react-redux'

import { WithAccountsToBackup } from './WithAccountsToBackup'
import { WithoutAccountsToBackup } from './WithoutAccountsToBackup'

import ScreenLayoutWithoutScroll from '~/src/components/layout/ScreenLayoutWithoutScroll'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'

export const SecurityBackupCheckPage = () => {
  const wallets = useSelector(selectWallets)

  const standartWallets = wallets.filter(wallet => wallet.walletType === 'standard')

  const walletWithoutBackup = standartWallets.filter(wallet => wallet.backupStatus !== 'successful')

  return (
    <ScreenLayoutWithoutScroll darkerSolidColorBG>
      {walletWithoutBackup.length > 0 ? (
        <WithAccountsToBackup wallets={walletWithoutBackup} />
      ) : (
        <WithoutAccountsToBackup wallets={standartWallets} />
      )}
    </ScreenLayoutWithoutScroll>
  )
}
