import React, { useEffect } from 'react'

import { BSBigNumberHelper, hasNeo3NeoXBridge } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { TwIconButton } from '@/components/TwIconButton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { LinkHelper } from '@/helpers/LinkHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useLanguageSelector } from '@/hooks/useSettingsSelector'
import { useSwapRecordSelector } from '@/hooks/useUtilitySelector'

import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import SwapLinkIcon from '@/assets/images/swap-link-icon.svg'
import TbBell from '@/assets/images/tb-bell.svg'
import TbClock from '@/assets/images/tb-clock.svg'
import TbCodeCircle from '@/assets/images/tb-code-circle.svg'
import TbCoffee from '@/assets/images/tb-coffee.svg'
import TbCoin from '@/assets/images/tb-coin.svg'
import TbCube from '@/assets/images/tb-cube.svg'
import TbReplace2 from '@/assets/images/tb-replace-2.svg'

import { AccountTransactionsScreenCardDetails } from './AccountTransactionsScreenCardDetails'
import { AccountTransactionsScreenTransferItem } from './AccountTransactionsScreenTransferItem'

import type { TUseTransactionsTransaction } from '@/types/store'

type TProps = {
  transaction: TUseTransactionsTransaction
} & ViewProps

const ANIMATION_DURATION = 800

export const AccountTransactionsScreenTransactionItem = React.memo(({ transaction, className, ...props }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactionsScreen' })
  const { language } = useLanguageSelector()
  const navigation = useNavigation()
  const { swapRecord } = useSwapRecordSelector(transaction.txId)

  const opacity = useSharedValue(1)

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const isBridgeNeo3NeoX = transaction.type === 'bridgeNeo3NeoX'
  const feeBn = BSBigNumberHelper.fromNumber(transaction.networkFeeAmount ?? 0).plus(transaction.systemFeeAmount ?? 0)

  const handleGoSwapDetails = () => {
    if (!swapRecord) return
    navigation.navigate('SwapDetailsModal', { swapRecord })
  }

  const handleGoToBridgeNeo3NeoXDetails = () => {
    if (!isBridgeNeo3NeoX) return

    const toService =
      BlockchainServiceHelper.bsAggregator.blockchainServicesByName[transaction.blockchain === 'neo3' ? 'neox' : 'neo3']
    if (!hasNeo3NeoXBridge(toService)) return

    const tokenToReceive = toService.neo3NeoXBridgeService.getTokenByMultichainId(
      transaction.data.tokenToUse.multichainId
    )
    if (!tokenToReceive) return

    navigation.navigate('BridgeNeo3NeoXDetailsModal', {
      tokenToUse: transaction.data.tokenToUse,
      tokenToReceive,
      accountToUse: transaction.account,
      addressToReceive: transaction.data.receiverAddress,
      amountToUse: transaction.data.amount,
      amountToReceive: transaction.data.amount,
      transactionHash: transaction.txId,
      confirmed: true,
    })
  }

  useEffect(() => {
    if (transaction.isPending) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: ANIMATION_DURATION }),
          withTiming(1, { duration: ANIMATION_DURATION })
        ),
        -1,
        false
      )
    }
  }, [opacity, transaction.isPending])

  return (
    <Animated.View
      className={StyleHelper.mergeStyles('rounded-xl bg-gray-900 p-4', className)}
      style={pulseStyle}
      {...props}
    >
      {transaction.isPending && (
        <View className="mb-2 flex-row items-center gap-1">
          <TbCoffee aria-hidden className="size-6 text-orange" />
          <Text className="font-sans-bold text-sm text-orange">{t('processingLabel')}</Text>
        </View>
      )}

      <View className="flex-row items-center gap-1.5">
        <Text className="font-sans-medium text-lg uppercase text-white">{t('txidLabel')}</Text>

        <Text className="mr-auto w-36 font-sans-bold text-lg text-neon" ellipsizeMode="middle" numberOfLines={1}>
          {transaction.txId}
        </Text>

        <View className="flex-row">
          {swapRecord && (
            <TwIconButton
              icon={<SwapLinkIcon aria-hidden className="text-blue" />}
              onPress={handleGoSwapDetails}
              className="p-1"
              aria-label={t('seeOnExplorerButtonLabel')}
            />
          )}

          {isBridgeNeo3NeoX && (
            <TwIconButton
              icon={<TbReplace2 aria-hidden className="text-neon" />}
              onPress={handleGoToBridgeNeo3NeoXDetails}
              className="p-1"
              aria-label={t('seeOnExplorerButtonLabel')}
            />
          )}

          {transaction.txIdUrl && (
            <TwIconButton
              icon={<MdOpenInNew aria-hidden className="text-neon" />}
              onPress={LinkHelper.open.bind(null, transaction.txIdUrl)}
              className="p-1"
              aria-label={t('seeOnExplorerButtonLabel')}
            />
          )}
        </View>
      </View>

      <View className="mt-2 flex-row flex-wrap gap-2">
        <AccountTransactionsScreenCardDetails
          icon={<TbClock aria-hidden />}
          value={DateHelper.formatLocalized(transaction.date, { format: 'p', language })}
          label={DateHelper.formatLocalized(transaction.date, { format: 'Pp', language })}
        />

        {feeBn.isGreaterThan(0) && (
          <AccountTransactionsScreenCardDetails
            icon={<TbCoin aria-hidden />}
            value={feeBn.toString()}
            label={t('feeTooltipLabel', {
              networkFee: transaction.networkFeeAmount,
              systemFee: transaction.systemFeeAmount,
            })}
          />
        )}

        {transaction.block > 0 && (
          <AccountTransactionsScreenCardDetails
            icon={<TbCube aria-hidden />}
            value={transaction.block}
            label={t('blockToolTipLabel', { block: transaction.block })}
          />
        )}

        {transaction.invocationCount > 0 && (
          <AccountTransactionsScreenCardDetails
            icon={<TbCodeCircle aria-hidden />}
            value={transaction.invocationCount}
            label={t('invocationsToolTipLabel', { invocations: transaction.invocationCount })}
          />
        )}

        {transaction.notificationCount > 0 && (
          <AccountTransactionsScreenCardDetails
            icon={<TbBell aria-hidden />}
            value={transaction.notificationCount}
            label={t('notificationToolTipLabel', { notifications: transaction.notificationCount })}
          />
        )}
      </View>

      {transaction.events.length > 0 && (
        <View className="mt-4 gap-6">
          {transaction.events.map((event, index) => (
            <AccountTransactionsScreenTransferItem
              key={`${transaction.txId}-event-${index}`}
              account={transaction.account}
              event={event}
            />
          ))}
        </View>
      )}
    </Animated.View>
  )
})
