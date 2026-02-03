import { cloneElement, useEffect } from 'react'

import type { JSX } from 'react'
import { Text, View } from 'react-native'
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from 'react-native-reanimated'

import { StyleHelper } from '@/helpers/StyleHelper'

import MdErrorOutline from '@/assets/images/md-error-outline.svg'
import TbCircleCheck from '@/assets/images/tb-circle-check.svg'
import TbHourglass from '@/assets/images/tb-hourglass.svg'

import type { TToasterComponentProps } from '@/types/toaster'

export type TBaseToastProps = {
  message: string
  className?: string
  labelClassName?: string
  icon?: JSX.Element
  closeable?: boolean
}

const AnimatedTbHourglass = Animated.createAnimatedComponent(TbHourglass)

const BaseToast = ({ message, className, labelClassName, icon }: TBaseToastProps) => {
  return (
    <View className={StyleHelper.mergeStyles('mx-3 flex-row items-center gap-2.5 rounded p-3.5 shadow-lg', className)}>
      {icon &&
        cloneElement(icon, {
          className: StyleHelper.mergeStyles(
            'w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem] stroke-[1.5px]',
            icon.props.className
          ),
        })}
      <Text
        className={StyleHelper.mergeStyles('flex-shrink flex-grow font-sans-medium text-lg text-white', labelClassName)}
      >
        {message}
      </Text>
    </View>
  )
}

export const SuccessToast = ({ message }: TToasterComponentProps) => {
  return (
    <BaseToast
      className="bg-green-700"
      labelClassName="text-neon"
      message={message}
      icon={<TbCircleCheck aria-hidden className="text-neon" />}
    />
  )
}

export const ErrorToast = ({ message }: TToasterComponentProps) => {
  return (
    <BaseToast
      className="bg-pink-700"
      message={message}
      icon={<MdErrorOutline aria-hidden className="text-magenta" />}
    />
  )
}

export const InfoToast = ({ message }: TToasterComponentProps) => {
  return (
    <BaseToast className="bg-orange" message={message} icon={<MdErrorOutline aria-hidden className="text-white" />} />
  )
}

export const LoadingToast = ({ message }: TToasterComponentProps) => {
  const spin = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${spin.value}deg`,
        },
      ],
    }
  })

  useEffect(() => {
    spin.value = withRepeat(
      withSpring(360, {
        damping: 12,
      }),
      -1
    )

    return () => {
      cancelAnimation(spin)
      spin.value = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BaseToast
      className="bg-orange-700"
      message={message}
      icon={<AnimatedTbHourglass style={[animatedStyle]} className="text-orange" />}
      closeable={false}
    />
  )
}
