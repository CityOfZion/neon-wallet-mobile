import React, { cloneElement } from 'react'

import type { TBSToken } from '@cityofzion/blockchain-service'
import type { ComponentProps, JSX, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { TextProps } from 'react-native'
import { Text, View } from 'react-native'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'

import { StyleHelper } from '@/helpers/StyleHelper'

import { TwSeparator } from './TwSeparator'

import type { TBlockchainServiceKey } from '@/types/blockchain'

type TContentProps = {
  title: string
  subtitle?: string
  className?: string
  children: ReactNode
}

type TStepProps = {
  label: string
}

type TBlockchainTokenProps = {
  token: TBSToken
  blockchain: TBlockchainServiceKey
}

type TRootProps = {
  children: ReactNode
} & ViewProps

type TItemProps = {
  label?: string | JSX.Element
  value?: string | JSX.Element
  labelClassName?: string
  valueProps?: TextProps
} & ViewProps

const Content = ({ title, subtitle, className, children }: TContentProps) => (
  <View className={StyleHelper.mergeStyles('flex flex-col gap-y-1.5', className)}>
    <View className="flex flex-row items-center justify-between gap-x-2">
      <Text className="font-sans-light text-sm uppercase text-gray-100">{title}</Text>
      {!!subtitle && <Text className="font-sans-regular text-sm text-gray-100">{subtitle}</Text>}
    </View>

    {children}
  </View>
)

const Step = ({ label }: TStepProps) => (
  <View className="mt-1 bg-gray-300/15 px-2 py-1.5">
    <Text className="font-sans-medium text-base tracking-wide text-blue">{label}</Text>
  </View>
)

const BlockchainToken = ({ token, blockchain }: TBlockchainTokenProps) => {
  const { t: tBlockchainServices } = useTranslation('common', { keyPrefix: 'blockchainServices' })

  return (
    <View className="flex flex-row items-center gap-x-2">
      <TwBlockchainIcon blockchain={blockchain} type="gray" className="mt-0.5 h-3.5 w-3.5" />

      <Text className="font-sans-regular text-base text-white">
        {token.name} <Text className="text-gray-100">| {tBlockchainServices(`${blockchain}.label`)}</Text>
      </Text>
    </View>
  )
}

const Item = ({ label, value, className, labelClassName, valueProps, children, ...props }: TItemProps) => {
  const fixedValue = children ?? value
  const fixedValueProps = children ? {} : valueProps

  return (
    <View className={StyleHelper.mergeStyles('flex-1 gap-2', className)} {...props}>
      {typeof label === 'string' ? (
        <Text className={StyleHelper.mergeStyles('font-sans-bold text-xs uppercase text-gray-100', labelClassName)}>
          {label}
        </Text>
      ) : (
        label
      )}

      {typeof fixedValue === 'string' ? (
        <Text
          {...fixedValueProps}
          className={StyleHelper.mergeStyles('font-sans-semibold text-base text-white', fixedValueProps?.className)}
        >
          {fixedValue}
        </Text>
      ) : (
        fixedValue
      )}
    </View>
  )
}

const Row = ({ children }: TRootProps) => {
  return <View className="w-full flex-row gap-3">{children}</View>
}

const Root = ({ children, className, ...props }: TRootProps) => {
  return (
    <View className={StyleHelper.mergeStyles('gap-3 rounded bg-asphalt p-3', className)} {...props}>
      {children}
    </View>
  )
}

type THeaderProps = {
  rightElement?: JSX.Element
  leftElement?: JSX.Element
} & ViewProps

const Header = ({ leftElement, rightElement, children, className, ...props }: THeaderProps) => {
  return (
    <View className={StyleHelper.mergeStyles('flex w-full flex-row items-center gap-2.5', className)} {...props}>
      {leftElement &&
        cloneElement(leftElement, {
          'aria-hidden': true,
          className: StyleHelper.mergeStyles('text-blue size-6', leftElement.props.className),
        })}

      <View className="flex-grow">
        {typeof children === 'string' ? (
          <Text className="font-sans-regular text-sm text-white">{children}</Text>
        ) : (
          children
        )}
      </View>

      {rightElement}
    </View>
  )
}

type THeaderSeparatorProps = ComponentProps<typeof TwSeparator>

const HeaderSeparator = (props: THeaderSeparatorProps) => {
  return <TwSeparator {...props} />
}

type TPanelProps = { label?: string } & ViewProps

const ItemPanel = ({ className, children, label, ...props }: TPanelProps) => {
  return (
    <View className={StyleHelper.mergeStyles('w-full', className)} {...props}>
      {label && <Text className="w-full bg-gray-300/15 px-3.5 py-1.5 font-sans-bold text-blue">{label}</Text>}

      <View className="px-1 py-2">
        {typeof children === 'string' ? (
          <Text className="font-sans-semibold text-base text-white">{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  )
}

export const TwDetailsCard = { Root, Row, Item, BlockchainToken, Step, Content, Header, HeaderSeparator, ItemPanel }
