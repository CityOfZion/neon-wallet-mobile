import React from 'react'

import type { ISwapOrchestrator, TSwapOrchestratorState, TSwapToken, TSwapTokenToUse } from '@cityofzion/bs-multichain'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ActionAddressButton } from '@/components/ActionAddressButton'
import { ActionStep } from '@/components/ActionStep'
import { ActionTokenButton } from '@/components/ActionTokenButton'
import { TwSeparator } from '@/components/TwSeparator'

import { StringHelper } from '@/helpers/StringHelper'

import TbDiamond from '@/assets/images/tb-diamond.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import type { TAccount } from '@/types/store'

type TProps = {
  swapOrchestrator: ISwapOrchestrator
  state: TSwapOrchestratorState
  accountToUse?: TAccount
  isLoadingBalance: boolean
  disabled: boolean
}

export const SwapScreenAssetsCard = ({ swapOrchestrator, state, accountToUse, isLoadingBalance, disabled }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'swap.assetsCard' })
  const navigation = useNavigation()

  const tokenToUse = state.tokenToUse.value
  const tokenToReceive = state.tokenToReceive.value
  const tokenToReceiveBlockchain = tokenToReceive?.blockchain

  const handleSelectTokenToUse = async (token: TSwapTokenToUse) => {
    await swapOrchestrator.setAmountToUse(null)
    await swapOrchestrator.setTokenToUse(token)
  }

  const handleSelectTokenToReceive = (token: TSwapToken) => {
    swapOrchestrator.setTokenToReceive(token)
  }

  const handleSelectAddressToReceive = (address: string) => {
    swapOrchestrator.setAddressToReceive(StringHelper.removeSpecialCharacters(address, { allowSpaces: false }) || null)
  }

  return (
    <View className="rounded bg-gray-700/60 px-1 pb-3 pt-2">
      <ActionStep
        title={t('assets')}
        titleClassName="font-sans-bold"
        leftElement={<TbDiamond aria-hidden className="text-blue" />}
      />

      <TwSeparator />

      <ActionStep
        title={t('tokenToUseTitle')}
        leftElement={<VscCircleFilled aria-hidden className="size-2 min-size-2 max-size-2" />}
      >
        <ActionTokenButton
          label={t('selectPlaceholder')}
          token={tokenToUse}
          isLoading={state.availableTokensToUse.loading || isLoadingBalance}
          disabled={disabled || !accountToUse}
          onPress={() =>
            navigation.navigate('TokenSelectionModal', {
              onSelect: handleSelectTokenToUse,
              account: accountToUse,
              blockchain: accountToUse?.blockchain,
              selectedToken: tokenToUse || undefined,
              title: t('tokenToUseModalTitle'),
              tokens: state.availableTokensToUse.value || [],
            })
          }
        />
      </ActionStep>

      <TwSeparator />

      <ActionStep
        title={t('tokenToReceiveTitle')}
        leftElement={<VscCircleFilled aria-hidden className="size-2 min-size-2 max-size-2" />}
      >
        <ActionTokenButton
          label={t('selectPlaceholder')}
          token={tokenToReceive}
          isLoading={state.availableTokensToReceive.loading}
          disabled={disabled || !tokenToUse}
          onPress={() =>
            navigation.navigate('TokenSelectionModal', {
              onSelect: handleSelectTokenToReceive,
              selectedToken: tokenToReceive || undefined,
              title: t('tokenToReceiveModalTitle'),
              tokens: state.availableTokensToReceive.value || [],
            })
          }
        />
      </ActionStep>

      <TwSeparator />

      <ActionStep
        title={t('addressToReceiveTitle')}
        leftElement={<VscCircleFilled aria-hidden className="size-2 min-size-2 max-size-2" />}
        error={state.addressToReceive.valid === false}
      >
        <ActionAddressButton
          className="w-40"
          label={t('selectPlaceholder')}
          address={state.addressToReceive.value}
          blockchain={state.addressToReceive.value ? tokenToReceiveBlockchain : undefined}
          isLoading={state.addressToReceive.formatting || state.addressToReceive.validating}
          disabled={disabled || !tokenToReceive}
          error={state.addressToReceive.valid === false}
          onPress={() =>
            navigation.navigate('AddressSelectionModal', {
              onSelect: handleSelectAddressToReceive,
              title: t('addressToReceiveModalTitle'),
              blockchain: tokenToReceiveBlockchain,
            })
          }
        />
      </ActionStep>
    </View>
  )
}
