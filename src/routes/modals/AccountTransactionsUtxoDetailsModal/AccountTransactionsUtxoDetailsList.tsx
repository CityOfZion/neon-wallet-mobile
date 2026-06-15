import type { TTransactionUtxoInputOutput } from '@cityofzion/blockchain-service'
import { FlatList, type ListRenderItem, Text, View } from 'react-native'

import { TwSeparator } from '@/components/TwSeparator'

import { AccountTransactionsUtxoDetailsListItem } from './AccountTransactionsUtxoDetailsListItem'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TItem = {
  blockchain: TBlockchainServiceKey
  inputOutput: TTransactionUtxoInputOutput
}

type TProps = {
  title: string
  blockchain: TBlockchainServiceKey
  inputsOutputs: TTransactionUtxoInputOutput[]
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return <AccountTransactionsUtxoDetailsListItem blockchain={item.blockchain} inputOutput={item.inputOutput} />
}

export const AccountTransactionsUtxoDetailsList = ({ title, blockchain, inputsOutputs }: TProps) => {
  const data = inputsOutputs.map<TItem>(inputOutput => ({ blockchain, inputOutput }))

  return (
    <View className="flex gap-y-3">
      <Text className="font-sans-regular uppercase text-gray-300">{title}</Text>

      <FlatList
        data={data}
        scrollEnabled={false}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <TwSeparator containerClassName="py-3" />}
      />
    </View>
  )
}
