import React from 'react'
import { ViewProps } from 'react-native'
import SkeletonContent from 'react-native-skeleton-content'
import { ICustomViewStyle } from 'react-native-skeleton-content/lib/Constants'

interface Props extends ViewProps {
  isLoading?: boolean
  boneColor?: string
  children: React.ReactNode
  layout: ICustomViewStyle[] | ICustomViewStyle
}

export const Skeleton = ({ children, boneColor, isLoading = false, layout }: Props) => {
  return (
    <SkeletonContent
      containerStyle={{
        width: '100%',
        alignItems: 'center',
      }}
      boneColor={boneColor ?? 'transparent'}
      highlightColor="#ffffff55"
      isLoading={isLoading}
      layout={Array.isArray(layout) ? layout : [layout]}
    >
      {children}
    </SkeletonContent>
  )
}
