import type { TTransactionUtxoInputOutput } from '@cityofzion/blockchain-service'
import type { TBSServiceName } from '@cityofzion/bs-multichain'
import { FlatList, type ListRenderItem, Text, View } from 'react-native'

import { TwSeparator } from '@/components/TwSeparator'

import { AccountTransactionsUtxoDetailsListItem } from './AccountTransactionsUtxoDetailsListItem'

type TItem = {
  blockchain: TBSServiceName
  inputOutput: TTransactionUtxoInputOutput
}

type TProps = {
  title: string
  blockchain: TBSServiceName
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
