import React, { memo } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { AccountTransactionsTransactionCard } from '@/components/AccountTransactionsTransactionCard'

import type { TUseTransactionsTransactionUtxo } from '@/types/store'

type TProps = {
  transaction: TUseTransactionsTransactionUtxo
}

export const AccountTransactionsScreenTransactionUtxo = memo(({ transaction }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactionsScreen' })
  const inputsLength = transaction.inputs.length
  const outputsLength = transaction.outputs.length

  return (
    <AccountTransactionsTransactionCard transaction={transaction} showDetailsButton>
      <View className="mt-4 flex-row items-center justify-between gap-x-4">
        <View className="flex-grow">
          <Text className="font-sans-regular text-base uppercase text-gray-300">{t('fromLabel')}</Text>
          <Text className="font-sans-medium text-base text-white">
            {t(inputsLength === 1 ? 'inputLabel' : 'inputsLabel', { value: inputsLength })}
          </Text>
        </View>

        <View className="flex-grow">
          <Text className="font-sans-regular text-base uppercase text-gray-300">{t('toLabel')}</Text>
          <Text className="font-sans-medium text-base text-white">
            {t(outputsLength === 1 ? 'outputLabel' : 'outputsLabel', { value: outputsLength })}
          </Text>
        </View>
      </View>
    </AccountTransactionsTransactionCard>
  )
})
