import React from 'react'

import { BSBigHumanAmount } from '@cityofzion/blockchain-service'
import type { ISwapOrchestrator, TSwapOrchestratorState } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { ActionInput } from '@/components/ActionInput'
import { ActionStep } from '@/components/ActionStep'
import { Loader } from '@/components/Loader'
import { Tooltip } from '@/components/Tooltip'
import { TwSeparator } from '@/components/TwSeparator'

import { StyleHelper } from '@/helpers/StyleHelper'

import TbCoin from '@/assets/images/tb-coin.svg'
import TbWand from '@/assets/images/tb-wand.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import type { TTokenBalance } from '@/types/query'

type TProps = {
  swapOrchestrator: ISwapOrchestrator
  state: TSwapOrchestratorState
  tokenToUseBalance?: TTokenBalance
  disabled: boolean
}

export const SwapScreenAmountsCard = ({ swapOrchestrator, state, tokenToUseBalance, disabled }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'swap.amountsCard' })

  const isDisabled = disabled || !state.tokenToReceive.value || state.addressToReceive.valid !== true
  const hasAmountToUseError = !!state.amountToUse.error

  const handleChangeAmountToUse = (amount: string) => {
    swapOrchestrator.setAmountToUse(amount || null)
  }

  return (
    <View className="rounded bg-gray-700/60 px-1 py-2">
      <ActionStep
        title={t('amounts')}
        titleClassName="font-sans-bold"
        leftElement={<TbCoin aria-hidden className="text-blue" />}
      />

      <TwSeparator />

      <ActionStep
        title={t('amountToUseTitle')}
        leftElement={<VscCircleFilled aria-hidden className="size-2 min-size-2 max-size-2" />}
        error={hasAmountToUseError}
      >
        <Tooltip.Root type="focus">
          <Tooltip.Trigger>
            <ActionInput
              aria-label={t('amountToUseTitle')}
              onChangeText={handleChangeAmountToUse}
              placeholder={t('amountPlaceholder')}
              value={state.amountToUse.value || ''}
              disabled={isDisabled}
              editable
              autoCorrect={false}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              keyboardType="decimal-pad"
              error={hasAmountToUseError}
            />
          </Tooltip.Trigger>
          <Tooltip.Content className="w-60 items-center gap-3">
            <TbWand aria-hidden className="size-5 text-blue min-size-5 max-size-5" />
            <Text className="flex-shrink font-sans-regular text-sm text-white">{t('tooltipTitle')}</Text>
          </Tooltip.Content>
        </Tooltip.Root>
      </ActionStep>

      <View className="-mt-1 flex-row justify-between pb-4 pl-9.5 pr-3">
        <Text className="font-sans-regular text-sm italic text-gray-300">{t('balanceLabel')}</Text>
        <Text className="font-sans-regular text-sm italic text-gray-300">{tokenToUseBalance?.amount || '0.00'}</Text>
      </View>

      <TwSeparator />

      <ActionStep
        title={t('amountToReceiveTitle')}
        description={t('amountToReceiveDescription')}
        leftElement={<VscCircleFilled aria-hidden className="size-2 min-size-2 max-size-2" />}
        className="mb-5"
      >
        {state.quote.loading ? (
          <Loader />
        ) : (
          <Text
            className={StyleHelper.mergeStyles('w-32 text-right font-sans-regular text-lg text-white', {
              'opacity-50': isDisabled,
            })}
          >
            {new BSBigHumanAmount(state.quote.value?.amountToReceive || 0, 10).toFormatted()}
          </Text>
        )}
      </ActionStep>
    </View>
  )
}
