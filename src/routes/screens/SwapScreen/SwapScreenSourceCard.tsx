import React, { useEffect } from 'react'

import { type ISwapOrchestrator, SwapHelper } from '@cityofzion/bs-multichain'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ActionAddressButton } from '@/components/ActionAddressButton'
import { ActionStep } from '@/components/ActionStep'
import { TwSeparator } from '@/components/TwSeparator'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useLazyBalance } from '@/hooks/useBalances'

import TbWallet from '@/assets/images/tb-wallet.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import type { TAccount } from '@/types/store'

type TProps = {
  swapOrchestrator: ISwapOrchestrator
  accountToUse?: TAccount
  initialAccount?: TAccount
  isLoading: boolean
  disabled: boolean
}

export const SwapScreenSourceCard = ({
  swapOrchestrator,
  accountToUse,
  initialAccount,
  isLoading,
  disabled,
}: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'swap.sourceCard' })
  const navigation = useNavigation()
  const { getBalance } = useLazyBalance()

  const supportedBlockchains = BlockchainServiceHelper.blockchainNames.filter(blockchain =>
    SwapHelper.isBlockchainSupported(blockchain, BlockchainServiceHelper.bsAggregator)
  )

  const handleSelectAccountToUse = async (account: TAccount) => {
    if (account.type === 'watch') return

    try {
      const serviceAccount = await BlockchainServiceHelper.getServiceAccount(account)
      await swapOrchestrator.setAccountToUse(serviceAccount)

      const balance = await getBalance(account)
      await swapOrchestrator.setAccountToUseBalances(balance?.tokensBalances || null)
    } catch (error) {
      LoggerHelper.error(error, { where: 'SwapScreenSourceCard', operation: 'handleSelectAccountToUse' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  // The orchestrator is recreated on restart, so the initial account must be selected again
  useEffect(() => {
    if (initialAccount && supportedBlockchains.includes(initialAccount.blockchain)) {
      handleSelectAccountToUse(initialAccount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAccount, swapOrchestrator])

  return (
    <View className="rounded bg-gray-700/60 px-1 pb-3 pt-2">
      <ActionStep
        title={t('source')}
        titleClassName="font-sans-bold"
        leftElement={<TbWallet aria-hidden className="text-blue" />}
      />

      <TwSeparator />

      <ActionStep
        title={t('accountToUseTitle')}
        leftElement={<VscCircleFilled aria-hidden className="size-2 min-size-2 max-size-2" />}
      >
        <ActionAddressButton
          className="w-40"
          label={t('selectPlaceholder')}
          address={accountToUse?.address}
          blockchain={accountToUse?.blockchain}
          isLoading={isLoading}
          disabled={disabled}
          onPress={() =>
            navigation.navigate('AccountSelectionModal', {
              title: t('accountToUseModalTitle'),
              onSelect: handleSelectAccountToUse,
              blockchains: supportedBlockchains,
            })
          }
        />
      </ActionStep>
    </View>
  )
}
