import type { JSX } from 'react'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = {
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  title?: string
  titleClassName?: string
}

export const TwModalLayoutHeader = (props: TProps) => {
  return (
    <View className="relative mt-6 flex-row items-center">
      <Text
        numberOfLines={1}
        className={StyleHelper.mergeStyles(
          'mx-auto max-w-[75%] flex-1 text-center font-sans-regular text-1xl text-gray-100',
          props.titleClassName
        )}
      >
        {props.title}
      </Text>

      <View className="absolute left-0">{props.leftElement}</View>
      <View className="absolute right-0">{props.rightElement}</View>
    </View>
  )
}
