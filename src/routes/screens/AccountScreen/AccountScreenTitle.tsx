import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { Skeleton } from '@/components/Skeleton'

import { useBlockHeightQuery } from '@/hooks/useBlockHeightQuery'

import type { TAccount } from '@/types/store'

type TProps = {
  account: TAccount
}

export const AccountScreenTitle = ({ account: { blockchain } }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'account' })
  const { t: tCommonBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })
  const { data, isLoading } = useBlockHeightQuery(blockchain)

  return (
    <Skeleton.Root loading={isLoading}>
      <Skeleton.Group>
        <Skeleton.Item className="h-10 w-30" />
      </Skeleton.Group>

      <Skeleton.Content className="flex w-full flex-col items-center justify-center">
        <Text className="text-center font-sans-regular text-1xs uppercase text-gray-300">
          {t('blockHeightTitle', { blockchain: tCommonBlockchainServices(`${blockchain}.label`) })}
        </Text>

        <Text className="text-center font-sans-medium text-lg text-white">{data}</Text>
      </Skeleton.Content>
    </Skeleton.Root>
  )
}
