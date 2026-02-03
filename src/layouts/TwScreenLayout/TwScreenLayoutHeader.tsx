import { useNavigation } from '@react-navigation/native'
import type { JSX, ReactNode } from 'react'
import { Text, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { TwIconButton } from '@/components/TwIconButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import TbArrowLeft from '@/assets/images/tb-arrow-left.svg'

type TProps = {
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  withoutBackButton?: boolean
  title?: ReactNode
  className?: string
  onBack?(): void
}

export const TwScreenLayoutHeader = ({
  leftElement,
  rightElement,
  withoutBackButton = false,
  title,
  className,
  onBack,
}: TProps) => {
  const navigation = useNavigation()

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    navigation.goBack()
  }

  return (
    <View className={StyleHelper.mergeStyles(`relative h-[44px] flex-row items-center justify-center`, className)}>
      {title && typeof title === 'string' ? (
        <Text className="max-w-[55%] flex-1 text-center font-sans-medium text-xl text-white" numberOfLines={1}>
          {title}
        </Text>
      ) : (
        title
      )}

      {match({ leftElement, withoutBackButton })
        .with({ leftElement: P.nonNullable }, { withoutBackButton: false }, () => (
          <View className="absolute left-0">
            {leftElement ?? (
              <TwIconButton icon={<TbArrowLeft aria-hidden className="text-white" />} onPress={handleBack} />
            )}
          </View>
        ))
        .otherwise(() => null)}

      {rightElement && <View className="absolute right-0">{rightElement}</View>}
    </View>
  )
}
