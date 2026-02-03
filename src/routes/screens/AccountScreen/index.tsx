import React from 'react'

import { hasWalletConnect, isClaimable } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Dimensions, Platform, View } from 'react-native'

import { AccountCard } from '@/components/AccountCard'
import { RefreshControl } from '@/components/RefreshControl'
import { TwIconButton } from '@/components/TwIconButton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useAccountByIdSelector } from '@/hooks/useAccountSelector'
import { useBalance } from '@/hooks/useBalances'
import { useBridgeNeo3NeoXValidations } from '@/hooks/useBridgeNeo3NeoXValidations'
import { useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'
import { useUnclaimed } from '@/hooks/useUnclaimedQuery'
import { useIsConnectedSelector } from '@/hooks/useUtilitySelector'
import { useWalletByIdSelector } from '@/hooks/useWalletSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import { AccountScreenActionButton } from '@/routes/screens/AccountScreen/AccountScreenActionButton'
import { AccountScreenMenuItem } from '@/routes/screens/AccountScreen/AccountScreenMenuItem'

import MdMoreHoriz from '@/assets/images/md-more-horiz.svg'
import TbArrowsExchange from '@/assets/images/tb-arrows-exchange.svg'
import TbBriefcase from '@/assets/images/tb-briefcase.svg'
import TbChartBarPopular from '@/assets/images/tb-chart-bar-popular.svg'
import TbDiamond from '@/assets/images/tb-diamond.svg'
import TbPlug from '@/assets/images/tb-plug.svg'
import TbReplace2 from '@/assets/images/tb-replace-2.svg'
import TbShoppingBag from '@/assets/images/tb-shopping-bag.svg'
import TbStepInto from '@/assets/images/tb-step-into.svg'
import TbStepOut from '@/assets/images/tb-step-out.svg'
import TbTransform from '@/assets/images/tb-transform.svg'

import { AccountScreenClaimButton } from './AccountScreenClaimButton'
import { AccountScreenTitle } from './AccountScreenTitle'

import type { TWalletsStackScreenProps } from '@/types/stacks'

export const AccountScreen = ({ navigation, route }: TWalletsStackScreenProps<'AccountScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountScreen' })
  const { account } = useAccountByIdSelector(route.params.account.id)
  const { wallet } = useWalletByIdSelector(route.params.wallet.id)
  const { selectedNetwork } = useSelectedNetworkSelector(account.blockchain)
  const { isNotConnected } = useIsConnectedSelector()
  const { canAccountBridge } = useBridgeNeo3NeoXValidations(account)

  const balanceQuery = useBalance(account)
  const unclaimedQuery = useUnclaimed(account)

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
  const isServiceClaimable = isClaimable(service)

  const tokenBalances = balanceQuery.data?.tokensBalances ?? []

  const isIos = Platform.OS === 'ios'
  const isAndroid = Platform.OS === 'android'

  const isCustomNetwork = selectedNetwork.type === 'custom'
  const isWatchAccount = account.type === 'watch'

  const isSendDisabled =
    isNotConnected ||
    isWatchAccount ||
    tokenBalances.length === 0 ||
    tokenBalances.every(balance => balance.amountNumber <= 0)

  const isNeo3Account = account.blockchain === 'neo3'

  const handleRefetch = () => {
    balanceQuery.refetch()
    unclaimedQuery.refetch()
  }

  const handlePressReceiveButton = () => {
    navigation.navigate('ReceiveScreen', { account })
  }

  const handlePressSendButton = () => {
    navigation.navigate('SendScreen', { account })
  }

  const handlePressAssetsButton = () => {
    navigation.navigate('AccountAssetsScreen', {
      account,
      wallet,
    })
  }

  const handlePressTransactionsButton = () => {
    navigation.navigate('AccountTransactionsScreen', {
      account,
    })
  }

  const handlePressNFTsButton = () => {
    navigation.navigate('AccountNftsScreen', {
      account,
    })
  }

  const handlePressConnectionsButton = () => {
    navigation.navigate('AccountConnectionsScreen', {
      account,
    })
  }

  const handleMorePress = () => {
    navigation.navigate('AccountSettingsScreen', {
      account,
      wallet,
    })
  }

  const handlePressBuyAndSellButton = () => {
    navigation.navigate('BuyAndSellTokensScreen', { account })
  }

  const handlePressSwapButton = () => {
    navigation.navigate('SwapScreen', { account })
  }

  const handlePressVoteNeo3Button = () => {
    if (!isNeo3Account) return

    navigation.navigate('VoteNeo3Screen', { defaultNeo3Account: account })
  }

  const handlePressBridgeNeo3NeoXButton = () => {
    if (isWatchAccount || !canAccountBridge) return

    navigation.navigate('BridgeNeo3NeoXScreen', { account })
  }

  return (
    <TwScreenLayout
      className="-mt-1"
      contentContainerClassName="px-4"
      headerClassName="h-16"
      title={<AccountScreenTitle account={account} />}
      refreshControl={
        <RefreshControl
          refreshing={balanceQuery.isRefetching || unclaimedQuery.isRefetching}
          onRefresh={handleRefetch}
        />
      }
      rightElement={
        <TwIconButton icon={<MdMoreHoriz aria-hidden className="text-white" />} size="md" onPress={handleMorePress} />
      }
    >
      <AccountCard hideBalance={false} account={account} width={Dimensions.get('window').width - 32} />

      <View
        className={StyleHelper.mergeStyles('mt-5 flex flex-shrink flex-row gap-x-3', {
          hidden: !isServiceClaimable && isIos,
        })}
      >
        {isServiceClaimable && <AccountScreenClaimButton account={account} />}

        <AccountScreenActionButton
          label={t('buttons.buyAndSell')}
          className={StyleHelper.mergeStyles('w-[35%] flex-shrink-0 flex-grow-0', {
            hidden: isIos,
            'w-full': !isServiceClaimable,
          })}
          disabled={isWatchAccount}
          icon={<TbShoppingBag aria-hidden className="h-5 w-5 text-neon" />}
          onPress={handlePressBuyAndSellButton}
        />
      </View>

      <View className="mt-3 flex flex-shrink flex-row gap-x-3">
        <AccountScreenActionButton
          label={t('buttons.receive')}
          className="w-full"
          icon={<TbStepInto aria-hidden className="h-5 w-5 text-neon" />}
          onPress={handlePressReceiveButton}
        />

        <AccountScreenActionButton
          label={t('buttons.send')}
          className="w-full"
          disabled={isSendDisabled}
          icon={<TbStepOut aria-hidden className="h-5 w-5 text-neon" />}
          onPress={handlePressSendButton}
        />
      </View>

      {(isAndroid || canAccountBridge) && (
        <View className="mt-3 flex flex-shrink flex-row gap-x-3">
          {isAndroid && (
            <AccountScreenActionButton
              label={t('buttons.swap')}
              className="w-full"
              disabled={isWatchAccount}
              icon={<TbTransform aria-hidden className="h-5 w-5 text-neon" />}
              onPress={handlePressSwapButton}
            />
          )}

          {canAccountBridge && (
            <AccountScreenActionButton
              label={t('buttons.bridgeNeo3NeoX')}
              className="w-full"
              disabled={isWatchAccount}
              icon={<TbReplace2 aria-hidden className="h-5 w-5 text-neon" />}
              onPress={handlePressBridgeNeo3NeoXButton}
            />
          )}
        </View>
      )}

      {isNeo3Account && (
        <View className="mt-3 flex flex-shrink flex-row gap-x-3">
          <AccountScreenActionButton
            label={t('buttons.voteNeo3')}
            className="w-full"
            icon={<TbChartBarPopular aria-hidden className="h-5 w-5 text-neon" />}
            onPress={handlePressVoteNeo3Button}
          />
        </View>
      )}

      <View className="mt-5 flex w-full flex-col gap-y-3">
        <AccountScreenMenuItem
          label={t('tokens')}
          icon={<TbBriefcase aria-hidden className="text-neon" />}
          onPress={handlePressAssetsButton}
        />

        <AccountScreenMenuItem
          label={t('transactions')}
          disabled={isCustomNetwork}
          icon={<TbArrowsExchange aria-hidden className="text-neon" />}
          onPress={handlePressTransactionsButton}
        />

        <AccountScreenMenuItem
          label={t('nfts')}
          disabled={isCustomNetwork}
          icon={<TbDiamond aria-hidden className="text-neon" />}
          onPress={handlePressNFTsButton}
        />

        <AccountScreenMenuItem
          label={t('connections')}
          disabled={isWatchAccount || !hasWalletConnect(service)}
          icon={<TbPlug aria-hidden className="text-neon" />}
          onPress={handlePressConnectionsButton}
        />
      </View>
    </TwScreenLayout>
  )
}
