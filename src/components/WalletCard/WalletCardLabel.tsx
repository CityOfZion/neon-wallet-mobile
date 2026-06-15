import type { JSX } from 'react'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import WalletIconLedger from '@/assets/images/wallet-icon-ledger.svg'
import WalletIconNonStandard from '@/assets/images/wallet-icon-non-standard.svg'
import WalletIconStandard from '@/assets/images/wallet-icon-standard.svg'

import type { TWallet, TWalletType } from '@/types/store'

type TProps = {
  wallet: TWallet
  isInactive?: boolean
}

const WALLET_ICON_BY_TYPE: Record<TWalletType, JSX.Element> = {
  'non-standard': <WalletIconNonStandard className="h-[80%] w-[16%]" />,
  standard: <WalletIconStandard className="h-[80%] w-[16%]" />,
  hardware: <WalletIconLedger className="h-[50%] w-[15%]" />,
}

export const WalletCardLabel = ({ wallet, isInactive }: TProps) => {
  return (
    <View
      className="absolute bottom-[72px] left-0 h-[56px] w-[232px] rounded-r-full bg-gray-700"
      style={{
        boxShadow: '-1px -1px 2px 0px #FFFFFF34 inset, 0px 1px 2px 0px #00000080 inset',
      }}
    >
      {wallet.type && (
        <View className="size-full flex-row items-center gap-4 px-4">
          {WALLET_ICON_BY_TYPE[wallet.type]}

          <Text
            className={StyleHelper.mergeStyles('flex-shrink font-sans-bold text-base uppercase leading-5 text-white', {
              'text-gray-300/50': isInactive,
            })}
            numberOfLines={1}
          >
            {wallet.name}
          </Text>
        </View>
      )}
    </View>
  )
}
