import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwIconButton } from '@/components/TwIconButton'
import { TwSkeleton } from '@/components/TwSkeleton'

import { AlertHelper } from '@/helpers/AlertHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'

import { useBalances } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'

import type { IAccountState } from '@/types/store'

interface Props {
  selectedWalletAccounts: IAccountState[]
}

export const WalletsScreenWalletInfo = ({ selectedWalletAccounts }: Props) => {
  const { currency } = useCurrencySelector()
  const { t } = useTranslation('screens', { keyPrefix: 'walletsScreen' })
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
    <View className="mb-6 mt-9 w-full items-center">
      <TwSkeleton isLoading={balances.isLoading} layout={{ width: 100, height: 36 }}>
        <View className="flex-row items-center">
          <Text className="font-sans-regular text-4xl text-white">
            {CurrencyHelper.format(balances.exchangeTotal, { currency })}
          </Text>

          {showBalanceAlert && (
            <TwIconButton icon={<TbAlertTriangle aria-hidden className="h-5 w-5 text-neon" />} onPress={handlePress} />
          )}
        </View>
      </TwSkeleton>
    </View>
  )
}
