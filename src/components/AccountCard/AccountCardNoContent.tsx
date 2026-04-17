import { Image } from 'expo-image'
import type { ReactNode } from 'react'
import type { PressableProps, ViewStyle } from 'react-native'
import { Dimensions, Pressable, View } from 'react-native'

import { SkinHelper } from '@/helpers/SkinHelper'

import type { TAccount } from '@/types/store'

export type TAccountCardNoContentProps = {
  account: TAccount
  width?: number
  height?: number
  style?: ViewStyle
  children?: ReactNode
  withShadow?: boolean
} & Omit<PressableProps, 'style' | 'children'>

export const ACCOUNT_CARD_WIDTH = 385
export const ACCOUNT_CARD_HEIGHT = 255
export const ACCOUNT_CARD_HEIGHT_RATIO = ACCOUNT_CARD_HEIGHT / ACCOUNT_CARD_WIDTH
export const ACCOUNT_CARD_WIDTH_RATIO = ACCOUNT_CARD_WIDTH / ACCOUNT_CARD_HEIGHT
const DEFAULT_COLOR = SkinHelper.getSkinColor()

export const getAccountCardDimensions = (width?: number, height?: number) => {
  if (height && !width) {
    return {
      height,
      width: height * ACCOUNT_CARD_WIDTH_RATIO,
    }
  }

  let newWidth = ACCOUNT_CARD_WIDTH

  if (width) newWidth = width
  else newWidth = Math.min(newWidth, Dimensions.get('window').width * 0.9)

  return {
    width: newWidth,
    height: newWidth * ACCOUNT_CARD_HEIGHT_RATIO,
  }
}

export const AccountCardNoContent = ({
  account,
  width,
  height,
  style,
  children,
  withShadow = true,
  ...props
}: TAccountCardNoContentProps) => {
  const accountCardDimensions = getAccountCardDimensions(width, height)
  const scaleX = accountCardDimensions.width / ACCOUNT_CARD_WIDTH
  const scaleY = accountCardDimensions.height / ACCOUNT_CARD_HEIGHT

  return (
    <Pressable
      style={{
        ...style,
        width: accountCardDimensions.width,
        height: accountCardDimensions.height,
      }}
      {...props}
    >
      <View
        style={{
          width: ACCOUNT_CARD_WIDTH,
          height: ACCOUNT_CARD_HEIGHT,
          transform: [{ scaleX }, { scaleY }],
          transformOrigin: 'top left',
        }}
      >
        <View
          className="relative size-full overflow-hidden rounded-2xl"
          style={{
            backgroundColor: account.skin.type === 'color' ? account.skin.id : DEFAULT_COLOR,
            boxShadow: withShadow
              ? '1px 1px 2px 0px #FFFFFF inset, -1px -1px 2px 0px #1A2026 inset, 5px 5px 20px 0px #1A202666'
              : undefined,
          }}
        >
          <Image
            className="absolute size-full"
            source={require('@/assets/images/account-placeholder.png')}
            contentFit="cover"
            priority="high"
            cachePolicy="memory-disk"
            aria-hidden
          />

          {children}
        </View>
      </View>
    </Pressable>
  )
}
