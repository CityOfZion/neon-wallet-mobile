import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { Skeleton } from '@/components/Skeleton'
import { TwIconButton } from '@/components/TwIconButton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'

import { useBalances } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'

import type { TAccount } from '@/types/store'

type Props = {
  selectedWalletAccounts: TAccount[]
}

export const WalletsScreenWalletInfo = ({ selectedWalletAccounts }: Props) => {
  const { currency } = useCurrencySelector()
  const { t } = useTranslation('screens', { keyPrefix: 'wallets' })
  const balances = useBalances(selectedWalletAccounts)

  const showBalanceAlert = balances.data.some(item =>
    item.tokensBalances.some(tokenBalance => tokenBalance.exchangeConvertedPrice <= 0)
  )

  const handlePress = () => {
    AlertHelper.show({
      title: t('incompleteBalanceWarningTitle'),
      subtitle: t('incompleteBalanceWarningText'),
      buttons: [{ label: t('incompleteBalanceWarningButton') }],
    })
  }

  return (
    <Skeleton.Root loading={balances.isLoading} className="mb-6 mt-9 h-10 items-center">
      <Skeleton.Group>
        <Skeleton.Item className="w-48" />
      </Skeleton.Group>

      <Skeleton.Content className="flex-row items-center">
        <Text className="font-sans-regular text-4xl text-white">
          {CurrencyHelper.format(balances.exchangeTotal, { currency })}
        </Text>

        {showBalanceAlert && (
          <TwIconButton icon={<TbAlertTriangle aria-hidden className="size-5 text-neon" />} onPress={handlePress} />
        )}
      </Skeleton.Content>
    </Skeleton.Root>
  )
}
