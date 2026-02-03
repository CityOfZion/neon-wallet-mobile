import React from 'react'

import { MotiView } from 'moti'
import { Skeleton as SkeletonMoti } from 'moti/skeleton'
import type { ViewProps } from 'react-native'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'

import { StyleHelper } from '@/helpers/StyleHelper'

import type { TMotiSkeletonProps } from '@/types/components'

type TColorSchema = 'black' | 'gray'

type TProps = {
  isLoading?: boolean
  colorSchema?: TColorSchema
  layout: TMotiSkeletonProps | TMotiSkeletonProps[]
} & ViewProps

const { theme } = resolveConfig(tailwindConfig)

const COLORS_BY_SCHEMA: Record<TColorSchema, string> = {
  black: theme.colors.black.DEFAULT + '33',
  gray: theme.colors.gray['700'],
}

export const TwSkeleton = ({
  children,
  colorSchema = 'black',
  isLoading = false,
  layout,
  className,
  ...props
}: TProps) => {
  const layouts = Array.isArray(layout) ? layout : [layout]

  return isLoading ? (
    <MotiView className={StyleHelper.mergeStyles('flex-col gap-2', className)} {...props}>
      <SkeletonMoti.Group show>
        {layouts.map((layout, index) => (
          <SkeletonMoti
            key={index}
            colors={[COLORS_BY_SCHEMA[colorSchema], 'transparent']}
            backgroundColor="transparent"
            height="100%"
            transition={{
              duration: 100,
            }}
            width="100%"
            {...layout}
          />
        ))}
      </SkeletonMoti.Group>
    </MotiView>
  ) : (
    children
  )
}
