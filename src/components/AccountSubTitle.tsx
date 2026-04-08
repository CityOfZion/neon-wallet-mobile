import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import type { TAccount } from '@/types/store'

type TProps = {
  account: TAccount
  className?: string
}

export const AccountSubTitle = ({ account, className }: TProps) => {
  return (
    <View className={StyleHelper.mergeStyles('flex-row items-center justify-center gap-2', className)}>
      <View
        className={StyleHelper.mergeStyles('size-3 rounded-full bg-neon')}
        style={{
          backgroundColor: account.skin.type === 'color' ? account.skin.id : undefined,
        }}
      />

      <Text className="font-sans-regular text-sm uppercase text-gray-300">{account.name}</Text>
    </View>
  )
}

export default AccountSubTitle
