import React, { Fragment, useEffect } from 'react'

import { BSBigNumberHelper, hasNeo3NeoXBridge } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import type { GestureResponderEvent, ViewProps } from 'react-native'
import { Text, View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { AccountTransactionsTransactionBadge } from '@/components/AccountTransactionsTransactionBadge'
import { TwButton } from '@/components/TwButton'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { LinkHelper } from '@/helpers/LinkHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useAccountsMapSelector } from '@/hooks/useAccountSelector'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'
import { useSwapRecordSelector } from '@/hooks/useUtilitySelector'

import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import TbBell from '@/assets/images/tb-bell.svg'
import TbCashBanknote from '@/assets/images/tb-cash-banknote.svg'
import TbClock from '@/assets/images/tb-clock.svg'
import TbCodeCircle from '@/assets/images/tb-code-circle.svg'
import TbCoin from '@/assets/images/tb-coin.svg'
import TbCube from '@/assets/images/tb-cube.svg'
import TbMug from '@/assets/images/tb-mug.svg'
import TbPhoto from '@/assets/images/tb-photo.svg'
import TbReplace2 from '@/assets/images/tb-replace-2.svg'
import TbTransform from '@/assets/images/tb-transform.svg'

import { PressableScale } from './PressableScale'

import type { TUseTransactionsTransaction } from '@/types/hooks'

type TProps = {
  transaction: TUseTransactionsTransaction
  className?: string
} & ViewProps

const ANIMATION_DURATION = 800
const DEFAULT_OPACITY = 1

export const AccountTransactionsTransactionCard = ({ transaction, className, children, ...props }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'accountTransactionsTransactionCard' })
  const navigation = useNavigation()
  const { language } = useLanguageSelector()
  const { swapRecord } = useSwapRecordSelector(transaction.txId)
  const { accountsMap } = useAccountsMapSelector()

  const opacity = useSharedValue(DEFAULT_OPACITY)
  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByNameRecord[transaction.blockchain]

  const bridgeData = hasNeo3NeoXBridge(service)
    ? service.neo3NeoXBridgeService.getTransactionData(transaction)
    : undefined

  const isUtxo = transaction.view === 'utxo'
  const feeBn = BSBigNumberHelper.fromNumber(transaction.networkFeeAmount || 0).plus(transaction.systemFeeAmount || 0)

  const handleSwapPress = (event: GestureResponderEvent) => {
    event.stopPropagation()
    if (!swapRecord) return
    navigation.navigate('SwapDetailsModal', { swapRecord })
  }

  const handleNeo3NeoXBridgePress = (event: GestureResponderEvent) => {
    event.stopPropagation()
    if (!bridgeData || !hasNeo3NeoXBridge(service)) return

    const toService =
      BlockchainServiceHelper.bsAggregator.blockchainServicesByName[service.name === 'neo3' ? 'neox' : 'neo3']
    if (!toService) return

    const tokenToReceive = toService.neo3NeoXBridgeService.getTokenByMultichainId(
      bridgeData.neo3NeoxBridge.tokenToUse.multichainId
    )

    if (!tokenToReceive) return

    const accountToUse = transaction.relatedAddress
      ? accountsMap.get(
          AccountHelper.buildAccountKey({ address: transaction.relatedAddress, blockchain: transaction.blockchain })
        )
      : undefined

    if (!accountToUse) return

    navigation.navigate('Neo3NeoXBridgeDetailsModal', {
      tokenToUse: bridgeData.neo3NeoxBridge.tokenToUse,
      tokenToReceive,
      accountToUse,
      addressToReceive: bridgeData.neo3NeoxBridge.receiverAddress,
      amountToUse: bridgeData.neo3NeoxBridge.amount,
      amountToReceive: bridgeData.neo3NeoxBridge.amount,
      transactionHash: transaction.txId,
      confirmed: true,
    })
  }

  useEffect(() => {
    if (transaction.isPending) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: ANIMATION_DURATION }),
          withTiming(DEFAULT_OPACITY, { duration: ANIMATION_DURATION })
        ),
        -1,
        false
      )
    } else {
      opacity.value = DEFAULT_OPACITY
    }

    return () => {
      cancelAnimation(opacity)
      opacity.value = DEFAULT_OPACITY
    }
  }, [opacity, transaction.isPending])

  return (
    <Animated.View
      className={StyleHelper.mergeStyles('relative rounded bg-gray-900 p-4', className)}
      style={pulseStyle}
      {...props}
    >
      {transaction.isPending && (
        <View className="mb-2 flex-row items-center gap-x-1.5">
          <TbMug aria-hidden className="size-5 text-orange" />
          <Text className="font-sans-medium text-base text-orange">{t('pendingLabel')}</Text>
        </View>
      )}

      <View className="flex flex-row items-center gap-x-1.5">
        <Text className="font-sans-regular text-base uppercase text-gray-300">{t('txIdLabel')}</Text>

        <PressableScale
          className="flex-row items-center gap-2"
          aria-label={t('seeOnExplorerButtonLabel')}
          onPress={transaction.txIdUrl ? LinkHelper.open.bind(null, transaction.txIdUrl) : undefined}
        >
          <Text className="w-28 font-sans-medium text-base text-neon" ellipsizeMode="middle" numberOfLines={1}>
            {transaction.txId}
          </Text>

          <MdOpenInNew aria-hidden className="size-5 text-neon" />
        </PressableScale>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        <AccountTransactionsTransactionBadge
          icon={<TbClock aria-hidden />}
          value={DateHelper.formatLocalized(transaction.date, { format: 'p', language })}
          label={DateHelper.formatLocalized(transaction.date, { format: 'Pp', language })}
        />

        {typeof transaction.block === 'number' && (
          <AccountTransactionsTransactionBadge
            icon={<TbCube aria-hidden />}
            value={transaction.block}
            label={t('blockToolTipLabel', { block: transaction.block })}
          />
        )}

        {feeBn.isGreaterThan(0) && (
          <AccountTransactionsTransactionBadge
            icon={<TbCoin aria-hidden />}
            value={feeBn.toString()}
            label={t('feeTooltipLabel', {
              networkFee: transaction.networkFeeAmount || '0',
              systemFee: transaction.systemFeeAmount || '0',
            })}
          />
        )}

        {isUtxo && (
          <Fragment>
            <AccountTransactionsTransactionBadge
              icon={<TbCashBanknote aria-hidden />}
              value={transaction.totalAmount}
              label={t('totalAmountTooltipLabel', {
                totalAmount: transaction.totalAmount,
              })}
            />

            {transaction.nfts.length > 0 && (
              <AccountTransactionsTransactionBadge
                icon={<TbPhoto aria-hidden />}
                value={transaction.nfts.length}
                label={t('nftsTooltipLabel', {
                  nfts: transaction.nfts.length,
                })}
              />
            )}
          </Fragment>
        )}

        {typeof transaction.invocationCount === 'number' && (
          <AccountTransactionsTransactionBadge
            icon={<TbCodeCircle aria-hidden />}
            value={transaction.invocationCount}
            label={t('invocationsToolTipLabel', { invocations: transaction.invocationCount })}
          />
        )}

        {typeof transaction.notificationCount === 'number' && (
          <AccountTransactionsTransactionBadge
            icon={<TbBell aria-hidden />}
            value={transaction.notificationCount}
            label={t('notificationToolTipLabel', { notifications: transaction.notificationCount })}
          />
        )}
      </View>

      {(swapRecord || bridgeData) && (
        <View className="mt-4 flex-row items-center gap-3">
          {swapRecord && (
            <TwButton
              label={t('swapButtonLabel')}
              variant="text-slim"
              labelProps={{ className: 'text-blue text-base' }}
              contentProps={{ className: 'shrink-0 grow-0 gap-x-1.5' }}
              leftElement={<TbTransform aria-hidden className="size-5 text-blue" />}
              onPress={handleSwapPress}
            />
          )}

          {bridgeData && (
            <TwButton
              label={t('bridgeNeo3NeoXButtonLabel')}
              variant="text-slim"
              labelProps={{ className: 'text-base' }}
              contentProps={{ className: 'shrink-0 grow-0 gap-x-1.5' }}
              leftElement={<TbReplace2 aria-hidden className="size-5 text-neon" />}
              onPress={handleNeo3NeoXBridgePress}
            />
          )}
        </View>
      )}

      {children}
    </Animated.View>
  )
}
