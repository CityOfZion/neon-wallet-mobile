import React, { useMemo } from 'react'

import { Image } from 'expo-image'
import { View } from 'react-native'

import { NumberHelper } from '@/helpers/NumberHelper'
import { SkinHelper } from '@/helpers/SkinHelper'

import { useAccountsByWalletIdSelector } from '@/hooks/useAccountSelector'

import type { IWalletState } from '@/types/store'

type Props = {
  wallet: IWalletState
}

export const WalletCardIcon = ({ wallet }: Props) => {
  const { accountsByWalletId } = useAccountsByWalletIdSelector(wallet.id)

  const color = useMemo(() => {
    const randomAccount = accountsByWalletId[NumberHelper.getRandomNumber(accountsByWalletId.length)]
    if (randomAccount.skin.type === 'color') {
      return randomAccount.skin.id
    }

    return SkinHelper.getSkinColor()
  }, [accountsByWalletId])

  return (
    <View className="relative">
      <View className="h-10 w-7 rounded-sm" style={{ backgroundColor: color }} />

      <Image
        contentFit="cover"
        source={require('@/assets/images/wallet-icon-front.png')}
        className="absolute left-1/2 top-1/2 h-[150%] w-[190%] -translate-x-[50%] -translate-y-[50%]"
      />
    </View>
  )
}
