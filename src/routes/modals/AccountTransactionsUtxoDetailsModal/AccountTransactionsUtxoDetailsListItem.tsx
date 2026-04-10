import React from 'react'

import { BSBigNumberHelper, type TTransactionUtxoInputOutput } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwIconButton } from '@/components/TwIconButton'

import { AccountHelper } from '@/helpers/AccountHelper'
import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { ExchangeHelper } from '@/helpers/ExchangeHelper'

import { useAccountsMapSelector } from '@/hooks/useAccountSelector'
import { useExchange } from '@/hooks/useExchanges'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  blockchain: TBlockchainServiceKey
  inputOutput: TTransactionUtxoInputOutput
}

export const AccountTransactionsUtxoDetailsListItem = ({ blockchain, inputOutput }: TProps) => {
  const { t } = useTranslation('common', { keyPrefix: 'general' })
  const { currency } = useCurrencySelector()
  const { data } = useExchange([{ blockchain, tokens: [inputOutput.token] }])
  const { accountsMap } = useAccountsMapSelector()

  const convertedPrice = ExchangeHelper.getExchangeConvertedPrice(inputOutput.token.hash, blockchain, data)

  const fiatAmount = CurrencyHelper.format(
    BSBigNumberHelper.fromNumber(convertedPrice).multipliedBy(inputOutput.amount).toNumber(),
    { currency }
  )

  const account = inputOutput.address
    ? accountsMap.get(AccountHelper.buildAccountKey({ address: inputOutput.address, blockchain }))
    : undefined

  return (
    <View className="flex gap-y-1">
      <View className="flex flex-row gap-x-2">
        <Text className="max-w-[92%] font-sans-medium text-sm text-gray-100" numberOfLines={1} ellipsizeMode="middle">
          {account?.name || inputOutput.address || t('emptyData')}
        </Text>

        {!!inputOutput.address && (
          <TwIconButton
            aria-label={t('copy')}
            className="mt-0.5 p-0"
            size="xs"
            icon={<TbCopy aria-hidden className="text-neon" />}
            onPress={() => ClipboardHelper.write(inputOutput.address)}
          />
        )}
      </View>

      <Text className="font-sans-regular text-sm text-white">
        {inputOutput.amount} {inputOutput.token.symbol}
        <Text className="font-sans-regular text-sm text-gray-300">{` | ${fiatAmount}`}</Text>
      </Text>
    </View>
  )
}
