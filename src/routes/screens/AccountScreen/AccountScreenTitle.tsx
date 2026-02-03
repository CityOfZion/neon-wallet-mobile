import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwSkeleton } from '@/components/TwSkeleton'

import { useBlockHeightQuery } from '@/hooks/useBlockHeightQuery'

import type { IAccountState } from '@/types/store'

type TProps = {
  account: IAccountState
}

export const AccountScreenTitle = ({ account: { blockchain } }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'accountScreen' })
  const { t: tCommonBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })
  const { data, isLoading } = useBlockHeightQuery(blockchain)

  return (
    <TwSkeleton
      isLoading={isLoading}
      className="mx-auto -mt-4 flex items-center justify-center"
      layout={{ width: 100, height: 40 }}
    >
      <View className="-mt-4 flex w-full flex-col items-center justify-center">
        <Text className="text-center font-sans-regular text-1xs uppercase text-gray-300">
          {t('blockHeightTitle', { blockchain: tCommonBlockchainServices(`${blockchain}.label`) })}
        </Text>

        <Text className="text-center font-sans-medium text-lg text-white">{data}</Text>
      </View>
    </TwSkeleton>
  )
}
