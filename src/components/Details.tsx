import { cloneElement, type ComponentProps, type JSX } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import TbCopy from '@/assets/images/tb-copy.svg'

import { TwIconButton } from './TwIconButton'
import { TwSeparator } from './TwSeparator'

type THeaderProps = {
  rightElement?: JSX.Element
  leftElement?: JSX.Element
  labelClassName?: string
} & ViewProps

type TPanelProps = { label?: string; labelClassName?: string } & ViewProps

type TItemProps = {
  label?: string | JSX.Element
  description?: string | JSX.Element
  textToCopy?: string
  contentClassName?: string
} & ViewProps

const Root = ({ children, className, ...props }: ViewProps) => {
  return (
    <View
      className={StyleHelper.mergeStyles('w-full gap-3 rounded bg-asphalt p-3', className)}
      role="region"
      {...props}
    >
      {children}
    </View>
  )
}

const Header = ({ leftElement, rightElement, children, className, labelClassName, ...props }: THeaderProps) => {
  return (
    <View
      className={StyleHelper.mergeStyles('flex w-full flex-row items-center gap-2.5', className)}
      role="banner"
      {...props}
    >
      {leftElement &&
        cloneElement(leftElement, {
          'aria-hidden': true,
          className: StyleHelper.mergeStyles('text-blue size-6', leftElement.props.className),
        })}

      <View className="flex-grow">
        {typeof children === 'string' ? (
          <Text
            className={StyleHelper.mergeStyles('font-sans-medium text-base text-white', labelClassName)}
            role="heading"
            aria-level={2}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>

      {rightElement}
    </View>
  )
}

const HeaderSeparator = (props: ComponentProps<typeof TwSeparator>) => {
  return <TwSeparator {...props} />
}

const Body = ({ children, className, ...props }: ViewProps) => {
  return (
    <View className={StyleHelper.mergeStyles('w-full gap-4', className)} {...props}>
      {children}
    </View>
  )
}

const Panel = ({ className, children, label, labelClassName, ...props }: TPanelProps) => {
  return (
    <View className={StyleHelper.mergeStyles('w-full', className)} role="group" {...props}>
      {label && (
        <Text
          className={StyleHelper.mergeStyles(
            'w-full bg-gray-300/15 px-3.5 py-1.5 font-sans-bold text-base text-blue',
            labelClassName
          )}
          role="heading"
          aria-level={3}
        >
          {label}
        </Text>
      )}
      <View className="mt-4 gap-4">{children}</View>
    </View>
  )
}

const Item = ({ label, className, children, description, textToCopy, contentClassName, ...props }: TItemProps) => {
  const { t: tCommon } = useTranslation('common')

  return (
    <View className={StyleHelper.mergeStyles('w-full gap-2 px-2', className)} role="listitem" {...props}>
      {label && (
        <View className="flex-row items-center justify-between gap-x-2">
          {typeof label === 'object' ? (
            label
          ) : (
            <Text className="font-sans-bold text-sm uppercase text-gray-100" accessibilityRole="text">
              {label}
            </Text>
          )}

          {typeof description === 'object'
            ? description
            : description && (
                <Text className="font-sans-medium text-sm uppercase text-gray-100" accessibilityRole="text">
                  {description}
                </Text>
              )}
        </View>
      )}

      <View className={StyleHelper.mergeStyles('flex-row items-center justify-between gap-x-2', contentClassName)}>
        {typeof children === 'object' ? (
          children
        ) : (
          <Text className="w-[85%] flex-shrink font-sans-medium text-base text-white" accessibilityRole="text">
            {children}
          </Text>
        )}

        {textToCopy && (
          <TwIconButton
            aria-label={tCommon('general.copyToClipboard')}
            className="p-0"
            icon={<TbCopy aria-hidden className="text-neon" />}
            onPress={() => ClipboardHelper.write(textToCopy)}
          />
        )}
      </View>
    </View>
  )
}

const ItemSeparator = (props: ComponentProps<typeof TwSeparator>) => {
  return <TwSeparator {...props} />
}

export const Details = {
  Root,
  Header,
  HeaderSeparator,
  Body,
  Panel,
  Item,
  ItemSeparator,
}
