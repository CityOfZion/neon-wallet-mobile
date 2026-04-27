import { useTranslation } from 'react-i18next'
import { Text, View, type ViewProps } from 'react-native'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { PressableScale } from './PressableScale'
import { TwBlockchainIcon } from './TwBlockchainIcon'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TAccount } from '@/types/store'

type TProps = {
  selectedBlockchains?: TBlockchainServiceKey[]
  onSelect: (blockchains: TBlockchainServiceKey[]) => void
  isMulti?: boolean
  walletAccounts?: TAccount[]
  blockchains?: TBlockchainServiceKey[]
} & ViewProps

export const BlockchainList = ({
  onSelect,
  selectedBlockchains = [],
  isMulti,
  walletAccounts,
  blockchains,
  className,
  ...props
}: TProps) => {
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const { t } = useTranslation('components', { keyPrefix: 'blockchainList' })

  const blockchainsToIterate = blockchains || BlockchainServiceHelper.blockchainNames

  const handlePress = (blockchain: TBlockchainServiceKey) => {
    if (isMulti) {
      onSelect(
        selectedBlockchains.includes(blockchain)
          ? selectedBlockchains.filter(selectedBlockchain => selectedBlockchain !== blockchain)
          : [...selectedBlockchains, blockchain]
      )
      return
    }

    onSelect([blockchain])
  }

  return (
    <View className={StyleHelper.mergeStyles('gap-2', className)} {...props}>
      {blockchainsToIterate.map(blockchain => {
        const isSelected = selectedBlockchains.includes(blockchain)

        return (
          <PressableScale
            key={blockchain}
            onPress={handlePress.bind(null, blockchain)}
            className={StyleHelper.mergeStyles(
              'h-[52px] flex-row items-center justify-between gap-4.5 rounded-md border border-transparent bg-gray-300/15 px-4',
              {
                'border-neon bg-transparent': isSelected,
              }
            )}
          >
            <TwBlockchainIcon blockchain={blockchain} className="size-4" />

            <Text className="flex-1 font-sans-bold text-base text-white">{tCommonBlockchain(blockchain)}</Text>

            {walletAccounts && (
              <Text className="font-sans-regular text-sm text-gray-400">
                {t('xExisting', {
                  amount: walletAccounts.filter(account => account.blockchain === blockchain).length,
                })}
              </Text>
            )}
          </PressableScale>
        )
      })}
    </View>
  )
}
