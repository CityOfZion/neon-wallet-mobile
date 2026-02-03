import { Text, View } from 'react-native'

type TProps = {
  index: number
  title: string
  body: string
}

export const CreateWalletStep1ScreenItem = ({ body, index, title }: TProps) => {
  return (
    <View className="flex-row gap-3">
      <Text className="mt-1 size-7 rounded-full bg-neon text-center font-sans-bold text-base text-black">{index}</Text>

      <View className="flex-shrink">
        <Text className="font-sans-bold text-lg text-white">{title}</Text>

        <Text className="font-sans-light text-base text-white">{body}</Text>
      </View>
    </View>
  )
}
