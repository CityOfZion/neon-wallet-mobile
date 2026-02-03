import React from 'react'

import type { TBridgeToken } from '@cityofzion/blockchain-service'
import { hasNeo3NeoXBridge } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import type { ViewProps } from 'react-native'
import { Platform, Pressable, Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { LinkHelper } from '@/helpers/LinkHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import DoraIcon from '@/assets/images/dora-icon.svg'
import SwapLinkIcon from '@/assets/images/swap-link-icon.svg'
import TbReplace2 from '@/assets/images/tb-replace-2.svg'

import { AccountTransactionsScreenTransferItem } from './AccountTransactionsScreenTransferItem'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TTransaction } from '@/types/store'

type TProps = {
  transaction: TTransaction
} & ViewProps

type TBoxLabelNumberProps = {
  label: string
  number: number
}

const BoxLabelNumber = ({ label, number }: TBoxLabelNumberProps) => {
  return (
    <View className="flex-row gap-2 rounded bg-gray-800 px-2.5 py-1">
      <Text className="font-sans-regular text-sm text-white">{label}</Text>
      <Text className="font-sans-regular text-sm text-neon">{number}</Text>
    </View>
  )
}

export const AccountTransactionsScreenTransactionItem = React.memo(({ transaction, className, ...props }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactionsScreen' })
  const { language } = useLanguageSelector()
  const navigation = useNavigation()

  const isBridgeNeo3NeoX = transaction.type === 'bridgeNeo3NeoX'

  const handleOnPressButtonExplorer = async () => {
    if (!transaction.transactionUrl) return
    await LinkHelper.open(transaction.transactionUrl)
  }

  const handleGoSwapDetails = () => {
    if (!transaction.swapRecord) return
    navigation.navigate('SwapDetailsModal', { swapRecord: transaction.swapRecord })
  }

  const handleGoToBridgeNeo3NeoXDetails = () => {
    if (!isBridgeNeo3NeoX) return

    const { account: accountToUse, data } = transaction

    const toService =
      BlockchainServiceHelper.bsAggregator.blockchainServicesByName[
        accountToUse.blockchain === 'neo3' ? 'neox' : 'neo3'
      ]

    if (!hasNeo3NeoXBridge(toService)) return

    const tokenToReceive = [toService.neo3NeoXBridgeService.gasToken, toService.neo3NeoXBridgeService.neoToken].find(
      token => token.multichainId === data.token.multichainId
    )

    if (!tokenToReceive) return

    navigation.navigate('BridgeNeo3NeoXDetailsModal', {
      tokenToUse: data.token as TBridgeToken<TBlockchainServiceKey>,
      tokenToReceive,
      accountToUse,
      addressToReceive: data.receiverAddress,
      amountToUse: data.amount,
      amountToReceive: data.amount,
      transactionHash: transaction.hash,
      confirmed: true,
    })
  }

  return (
    <View className={StyleHelper.mergeStyles('rounded bg-gray-900 p-4', className)} {...props}>
      <View className="flex-row items-center gap-1.5">
        <Text className="font-sans-regular text-lg uppercase text-white">{t('txidLabel')}</Text>

        <Text className="mr-auto w-36 font-sans-regular text-lg text-neon" ellipsizeMode="middle" numberOfLines={1}>
          {transaction.hash}
        </Text>

        {transaction.swapRecord && Platform.OS !== 'ios' && (
          <Pressable onPress={handleGoSwapDetails} aria-label={t('swapDetailsButtonLabel')}>
            <SwapLinkIcon aria-hidden className="h-7 w-7" />
          </Pressable>
        )}

        {isBridgeNeo3NeoX && (
          <TwButton
            label={t('bridgeNeo3NeoXDetailsButtonLabel')}
            variant="outline"
            className="h-8 max-h-8 min-h-8 rounded"
            labelProps={{ className: 'text-sm' }}
            contentProps={{ className: 'px-1.5 gap-x-1.5 py-0 h-8 min-h-8 max-h-8' }}
            leftElement={<TbReplace2 aria-hidden className="h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4" />}
            onPress={handleGoToBridgeNeo3NeoXDetails}
          />
        )}
      </View>

      <Text className="mt-2 font-sans-regular text-lg text-gray-100">
        {DateHelper.formatLocalized(transaction.time * 1000, { format: 'p', language })}
      </Text>

      {transaction.transfers.length > 0 && (
        <View className="mt-3 gap-6">
          {transaction.transfers.map((transfer, index) => (
            <AccountTransactionsScreenTransferItem
              key={`${transaction.hash}-transfer-${index}`}
              account={transaction.account}
              transfer={transfer}
            />
          ))}
        </View>
      )}

      {!transaction.isPending && (
        <View className="mt-6 flex-row gap-3">
          <BoxLabelNumber label={t('invocationsLabel')} number={transaction.transfers.length} />
          <BoxLabelNumber label={t('notificationsLabel')} number={transaction.notifications.length} />

          {transaction.transactionUrl && (
            <Pressable onPress={handleOnPressButtonExplorer} className="ml-auto" aria-label={t('doraButtonLabel')}>
              <DoraIcon aria-hidden className="text-neon" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  )
})
