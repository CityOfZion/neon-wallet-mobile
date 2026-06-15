import type { TBSToken } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwBlockchainIcon } from './TwBlockchainIcon'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TProps = {
  token: TBSToken
  blockchain: TBlockchainServiceKey
}

export const BlockchainIconWithLabel = ({ token, blockchain }: TProps) => {
  const { t: tBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })

  return (
    <View className="flex flex-row items-center gap-x-2">
      <TwBlockchainIcon blockchain={blockchain} className="mt-0.5 size-3.5 text-gray-300" />

      <Text className="font-sans-regular text-base text-white">
        {token.name}
        <Text className="text-gray-100">{` | ${tBlockchainServices(`${blockchain}.label`)}`}</Text>
      </Text>
    </View>
  )
}
