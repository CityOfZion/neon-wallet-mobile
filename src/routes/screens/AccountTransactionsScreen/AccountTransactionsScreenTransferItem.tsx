import React from 'react'

import type { TTransactionTransferAsset, TTransactionTransferNft } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import { AccountTransactionsScreenTransferAssetItem } from './AccountTransactionsScreenTransferAssetItem'
import { AccountTransactionsScreenTransferNFTItem } from './AccountTransactionsScreenTransferNFTItem'

import type { IAccountState } from '@/types/store'

type TProps = {
  account: IAccountState
  transfer: TTransactionTransferAsset | TTransactionTransferNft
}

export const AccountTransactionsScreenTransferItem = ({ account, transfer }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountTransactionsScreen' })

  const isReceiver = transfer.to === account.address
  const label = isReceiver ? t('receivedFromLabel') : t('sentToLabel')
  const address = isReceiver ? transfer.from : transfer.to

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="font-sans-regular text-sm uppercase text-gray-300">{label}</Text>
        <Text className="font-sans-regular text-sm uppercase text-gray-300">{t(`type.${transfer.type}`)}</Text>
      </View>

      <Text
        className={StyleHelper.mergeStyles('w-32 font-sans-regular text-lg', {
          'text-neon': !!address,
          'text-white': !address,
        })}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {address || '--'}
      </Text>

      {transfer.type === 'token' ? (
        <AccountTransactionsScreenTransferAssetItem account={account} transfer={transfer} />
      ) : (
        <AccountTransactionsScreenTransferNFTItem account={account} transfer={transfer} />
      )}
    </View>
  )
}
