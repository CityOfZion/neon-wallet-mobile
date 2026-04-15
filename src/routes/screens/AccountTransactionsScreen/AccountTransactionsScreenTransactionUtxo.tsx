import React, { memo } from 'react'

import type { TTransactionUtxo } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'

import { AccountTransactionsTransactionCard } from '@/components/AccountTransactionsTransactionCard'

import TbChevronRight from '@/assets/images/tb-chevron-right.svg'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  transaction: TTransactionUtxo<TBlockchainServiceKey>
}

export const AccountTransactionsScreenTransactionUtxo = memo(({ transaction }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactions' })
  const navigation = useNavigation()

  const inputsLength = transaction.inputs.length
  const outputsLength = transaction.outputs.length

  const handleDetails = () => {
    navigation.navigate('AccountTransactionsUtxoDetailsModal', { transaction })
  }

  return (
    <Pressable onPress={handleDetails} aria-label={t('detailsButtonLabel')}>
      <AccountTransactionsTransactionCard transaction={transaction}>
        <TbChevronRight aria-hidden className="absolute right-3 top-4 p-0 text-gray-300" />

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
    </Pressable>
  )
})
