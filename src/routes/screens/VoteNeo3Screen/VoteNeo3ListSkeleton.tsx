import { View } from 'react-native'

import { TwDashedSeparator } from '@/components/TwDashedSeparator'
import { TwSkeleton } from '@/components/TwSkeleton'

import type { TMotiSkeletonProps } from '@/types/components'

export const VoteNeo3ListSkeleton = () => {
  const defaultLayout: TMotiSkeletonProps = { width: '100%', radius: 4 }
  const layout: TMotiSkeletonProps = { ...defaultLayout, height: 42 }

  return (
    <View className="flex flex-col gap-y-2">
      <TwSkeleton isLoading colorSchema="gray" layout={{ ...defaultLayout, height: 28 }} />

      <TwSkeleton isLoading colorSchema="gray" layout={layout} />

      <TwDashedSeparator className="my-2" />

      <TwSkeleton
        isLoading
        className="gap-y-2"
        colorSchema="gray"
        layout={[
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
          layout,
        ]}
      />
    </View>
  )
}
