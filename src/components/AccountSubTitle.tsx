import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import type { IAccountState } from '@/types/store'

type TProps = {
  account: IAccountState
}

export const AccountSubTitle = ({ account }: TProps) => {
  return (
    <View className="flex-row items-center justify-center gap-2.5">
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
