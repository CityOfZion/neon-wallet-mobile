import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import SkeletonContent from 'react-native-skeleton-content'
import { ICustomViewStyle } from 'react-native-skeleton-content/lib/Constants'

interface Props {
  isLoading?: boolean
  boneColor?: string
  children: React.ReactNode
  containerStyle?: StyleProp<ViewStyle>
  withDefaultStyle?: boolean
  layout: ICustomViewStyle[] | ICustomViewStyle
}

export const Skeleton = ({
  children,
  boneColor,
  isLoading = false,
  layout,
  containerStyle,
  withDefaultStyle = true,
}: Props) => {
  return (
    <SkeletonContent
      containerStyle={
        containerStyle
          ? containerStyle
          : withDefaultStyle
          ? {
              flex: 1,
            }
          : {}
      }
      boneColor={boneColor ?? 'transparent'}
      highlightColor="#ffffff55"
      isLoading={isLoading}
      layout={Array.isArray(layout) ? layout : [layout]}
    >
      {children}
    </SkeletonContent>
  )
}
