import { FlatList, type ListRenderItem, Text, View } from 'react-native'

import { TwSeparator } from '@/components/TwSeparator'

import { AccountTransactionsUtxoDetailsListItem } from './AccountTransactionsUtxoDetailsListItem'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TUseTransactionsTransactionInputOutput } from '@/types/store'

type TItem = {
  blockchain: TBlockchainServiceKey
  inputOutput: TUseTransactionsTransactionInputOutput
}

type TProps = {
  title: string
  blockchain: TBlockchainServiceKey
  inputsOutputs: TUseTransactionsTransactionInputOutput[]
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return <AccountTransactionsUtxoDetailsListItem blockchain={item.blockchain} inputOutput={item.inputOutput} />
}

export const AccountTransactionsUtxoDetailsList = ({ title, blockchain, inputsOutputs }: TProps) => {
  return (
    <View className="flex gap-y-3">
      <Text className="font-sans-regular uppercase text-gray-300">{title}</Text>

      <FlatList
        data={inputsOutputs.map(inputOutput => ({ blockchain, inputOutput }))}
        scrollEnabled={false}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <TwSeparator containerClassName="py-3" />}
      />
    </View>
  )
}
