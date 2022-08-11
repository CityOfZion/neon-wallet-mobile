import React from 'react'
import { useSelector } from 'react-redux'

import { UtilsHelper } from '../helpers/UtilsHelper'
import { selectAccounts } from '../store/account/SelectorAccount'

import { Wallet } from '~src/models/redux/Wallet'
import { ImageView, LinearLayout } from '~src/styles/styled-components'

type Props = {
  wallet: Wallet
}

export const WalletCardIcon = ({ wallet }: Props) => {
  const viewWidth = 28
  const viewHeight = 38

  const accounts = useSelector(selectAccounts)

  const walletAccounts = accounts.filter(account => account.idWallet === wallet.id)
  const randomColor = walletAccounts.length
    ? walletAccounts[UtilsHelper.getRandomNumber(walletAccounts.length)].backgroundColor
    : 'primary'

  return (
    <LinearLayout width={viewWidth} height={viewHeight}>
      <LinearLayout
        left="1px"
        top="1px"
        position="absolute"
        borderRadius="2px"
        backgroundColor={randomColor}
        width={viewWidth - 2}
        height={viewHeight - 2}
      />

      <ImageView
        position="absolute"
        left="-6px"
        top="-10px"
        resizeMode="cover"
        source={require('~src/assets/images/wallet-icon-front.png')}
        style={{ width: viewWidth + 14, height: viewHeight + 22 }}
      />
    </LinearLayout>
  )
}
