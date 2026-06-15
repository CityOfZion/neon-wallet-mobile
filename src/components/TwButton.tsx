import { cloneElement, Fragment, useRef } from 'react'

import { LinearGradient } from 'expo-linear-gradient'
import type { JSX, ReactNode } from 'react'
import type { GestureResponderEvent, TextProps, TouchableOpacityProps, ViewProps, ViewStyle } from 'react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import { match } from 'ts-pattern'

import { ElementHelper } from '@/helpers/ElementHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { Loader } from './Loader'
import { PressableScale } from './PressableScale'

type TTwButtonVariant = 'text' | 'text-slim' | 'contained' | 'outline' | 'contained-light' | 'contained-darker' | 'card'

type TTwButtonColorSchema = 'neon' | 'pink' | 'white' | 'gray'

type TTwButtonAnimation = 'opacity' | 'scale'

export type TTwButtonProps = Omit<TouchableOpacityProps, 'style' | 'children' | 'onPress'> & {
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  label?: ReactNode
  onPress?: ((event: GestureResponderEvent) => void) | ((event: GestureResponderEvent) => Promise<void>)
  variant?: TTwButtonVariant
  disabled?: boolean
  iconsOnEdge?: boolean
  isLoading?: boolean
  contentProps?: ViewProps
  labelProps?: TextProps
  style?: ViewStyle
  colorSchema?: TTwButtonColorSchema
  animation?: TTwButtonAnimation
}

type TBaseProps = TTwButtonProps & {
  children?: JSX.Element
}

const BOX_SHADOW = '12px 12px 36px 0px #121517FD, 1px 1px 1px 0px #D6D2D223 inset, -1px -1px 1px 0px #00000051 inset'

export const ContainedButton = ({
  className,
  labelProps,
  leftElement,
  rightElement,
  colorSchema,
  ...props
}: TTwButtonProps) => {
  return (
    <BaseButton
      className={StyleHelper.mergeStyles(
        {
          'bg-neon': colorSchema === 'neon',
          'bg-pink': colorSchema === 'pink',
          'bg-gray-400': colorSchema === 'gray',
        },
        className
      )}
      leftElement={
        leftElement
          ? cloneElement(leftElement, {
              ...leftElement.props,
              className: StyleHelper.mergeStyles('text-gray-850', leftElement.props.className),
            })
          : leftElement
      }
      rightElement={
        rightElement
          ? cloneElement(rightElement, {
              ...rightElement.props,
              className: StyleHelper.mergeStyles('text-gray-850', rightElement.props.className),
            })
          : rightElement
      }
      labelProps={{ ...labelProps, className: StyleHelper.mergeStyles('text-gray-850', labelProps?.className) }}
      colorSchema={colorSchema}
      {...props}
    />
  )
}

export const OutlineButton = ({ className, style, colorSchema, ...props }: TTwButtonProps) => {
  return (
    <BaseButton
      className={StyleHelper.mergeStyles(
        'border bg-transparent',
        {
          'border-pink': colorSchema === 'pink',
          'border-neon': colorSchema === 'neon',
          'border-white': colorSchema === 'white',
          'border-gray-400': colorSchema === 'gray',
        },
        className
      )}
      style={{ boxShadow: undefined, ...style }}
      colorSchema={colorSchema}
      {...props}
    />
  )
}

export const TextButton = ({ className, style, ...props }: TTwButtonProps) => {
  return (
    <BaseButton
      className={StyleHelper.mergeStyles('bg-transparent', className)}
      style={{ boxShadow: undefined, ...style }}
      {...props}
    />
  )
}

const TextSlim = ({ className, contentProps, style, ...props }: TTwButtonProps) => {
  return (
    <BaseButton
      className={StyleHelper.mergeStyles('h-auto bg-transparent', className)}
      style={{ boxShadow: undefined, ...style }}
      contentProps={{ ...contentProps, className: StyleHelper.mergeStyles('px-0 py-0 ', contentProps?.className) }}
      {...props}
    />
  )
}

export const ContainedLight = (props: TTwButtonProps) => {
  return (
    <BaseButton {...props}>
      <LinearGradient
        className="absolute size-full"
        colors={['#42535D', '#273139']}
        style={{ boxShadow: BOX_SHADOW }}
      />
    </BaseButton>
  )
}

export const ContainerDarker = ({ className, ...props }: TTwButtonProps) => {
  return <BaseButton className={StyleHelper.mergeStyles('bg-asphalt', className)} {...props} />
}

const Card = ({ className, style, ...props }: TTwButtonProps) => {
  return (
    <BaseButton
      className={StyleHelper.mergeStyles('bg-gray-300/15', className)}
      style={{ boxShadow: undefined, ...style }}
      {...props}
    />
  )
}

const BaseButton = ({
  leftElement,
  label,
  onPress,
  disabled,
  rightElement,
  iconsOnEdge,
  children,
  isLoading,
  contentProps,
  labelProps,
  className,
  style,
  colorSchema,
  animation,
  ...rest
}: TBaseProps) => {
  const isDisabled = disabled || isLoading
  const isPressing = useRef(false)

  const handlePress = async (event: GestureResponderEvent) => {
    if (isPressing.current) return

    isPressing.current = true

    if (onPress) {
      await onPress(event)
    }

    isPressing.current = false
  }

  const Container = animation === 'opacity' ? TouchableOpacity : PressableScale

  return (
    <Container
      onPress={handlePress}
      className={StyleHelper.mergeStyles(
        'h-[52px] flex-row items-center justify-center overflow-hidden rounded-lg',
        { 'opacity-50': isDisabled },
        className
      )}
      disabled={isDisabled}
      style={{ boxShadow: !isDisabled ? BOX_SHADOW : undefined, ...style }}
      {...rest}
    >
      {children}

      <View
        {...contentProps}
        className={StyleHelper.mergeStyles(
          'flex-shrink flex-grow flex-row items-center justify-center gap-3 px-8 py-2.5',
          contentProps?.className
        )}
      >
        {isLoading ? (
          <Loader
            className={StyleHelper.mergeStyles({
              'text-neon': colorSchema === 'neon',
              'text-pink': colorSchema === 'pink',
              'text-white': colorSchema === 'white',
              'text-gray-400': colorSchema === 'gray',
            })}
          />
        ) : (
          <Fragment>
            {!!leftElement &&
              cloneElement(leftElement, {
                ...leftElement.props,
                className: StyleHelper.mergeStyles(
                  'size-6',
                  {
                    'text-neon': colorSchema === 'neon',
                    'text-pink': colorSchema === 'pink',
                    'text-white': colorSchema === 'white',
                    'text-gray-400': colorSchema === 'gray',
                  },
                  leftElement.props?.className
                ),
              })}

            {ElementHelper.isTextContentValid(label) ? (
              <Text
                {...labelProps}
                className={StyleHelper.mergeStyles(
                  'flex-shrink text-left font-sans-regular text-lg leading-6',
                  {
                    'flex-grow text-center': iconsOnEdge,
                    'text-neon': colorSchema === 'neon',
                    'text-pink': colorSchema === 'pink',
                    'text-white': colorSchema === 'white',
                    'text-gray-400': colorSchema === 'gray',
                  },
                  labelProps?.className
                )}
                numberOfLines={1}
              >
                {label}
              </Text>
            ) : (
              label
            )}

            {!!rightElement &&
              cloneElement(rightElement, {
                ...rightElement.props,
                className: StyleHelper.mergeStyles(
                  'size-6',
                  {
                    'text-neon': colorSchema === 'neon',
                    'text-pink': colorSchema === 'pink',
                    'text-white': colorSchema === 'white',
                    'text-gray-400': colorSchema === 'gray',
                  },
                  rightElement.props?.className
                ),
              })}
          </Fragment>
        )}
      </View>
    </Container>
  )
}

export const TwButton = (props: TTwButtonProps) => {
  const { colorSchema = 'neon', variant = 'contained', animation = 'scale', ...rest } = props

  const fixedProps: TTwButtonProps = {
    ...rest,
    colorSchema,
    variant,
    animation,
  }

  return match(props.variant)
    .with('contained', () => <ContainedButton {...fixedProps} />)
    .with('outline', () => <OutlineButton {...fixedProps} />)
    .with('text', () => <TextButton {...fixedProps} />)
    .with('text-slim', () => <TextSlim {...fixedProps} />)
    .with('contained-light', () => <ContainedLight {...fixedProps} />)
    .with('contained-darker', () => <ContainerDarker {...fixedProps} />)
    .with('card', () => <Card {...fixedProps} />)
    .otherwise(() => <ContainedButton {...fixedProps} />)
}
