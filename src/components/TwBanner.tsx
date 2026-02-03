import { cloneElement } from 'react'

import type { JSX, ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import MdInfoOutline from '@/assets/images/md-info-outline.svg'
import MdVerified from '@/assets/images/md-verified.svg'
import PiWarningDiamondFill from '@/assets/images/pi-warning-diamond-fill.svg'
import TbAlertSmall from '@/assets/images/tb-alert-small.svg'
import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'
import TbAlertHexagonFilled from '@/assets/images/tb-filled-alert-hexagon.svg'

export type TTwBannerType = 'info' | 'error' | 'success' | 'warning' | 'warningOrange' | 'alert'

export type TTwBannerProps = {
  type: TTwBannerType
  text?: ReactNode
  textClassName?: string
  iconClassName?: string
  iconContainerClassName?: string
}

type TProps = TTwBannerProps & ViewProps

const iconsByType: Record<TTwBannerType, JSX.Element> = {
  error: <TbAlertHexagonFilled className="h-6 w-6 text-pink" />,
  info: <MdInfoOutline className="h-6 w-6 text-blue" />,
  success: <MdVerified className="h-6 w-6 text-green" />,
  warning: <TbAlertTriangle className="h-6 w-6 text-yellow" />,
  warningOrange: (
    <View className="relative flex items-center justify-center">
      <TbAlertSmall className="h-6 w-6 text-orange" />
      <View className="absolute h-5 w-5 rotate-45 rounded-sm border-2 border-orange" />
    </View>
  ),
  alert: <PiWarningDiamondFill className="h-6 w-6 text-pink" />,
}

export const TwBanner = ({
  type,
  className,
  textClassName,
  iconClassName,
  iconContainerClassName,
  children,
  text,
  ...props
}: TProps) => {
  const icon = iconsByType[type]

  const childrenContent = children || text

  return (
    <View className={StyleHelper.mergeStyles('flex-row items-center rounded bg-gray-300/15', className)} {...props}>
      <View
        className={StyleHelper.mergeStyles(
          'h-full flex-row items-center justify-center rounded-l bg-gray-300/30 px-4 py-3',
          iconContainerClassName
        )}
      >
        {cloneElement(icon, {
          className: StyleHelper.mergeStyles(icon.props.className, iconClassName),
          'aria-hidden': true,
        })}
      </View>

      {typeof childrenContent === 'string' ? (
        <Text
          className={StyleHelper.mergeStyles(
            'flex-shrink px-5 py-3.5 font-sans-regular text-lg text-white',
            textClassName
          )}
        >
          {childrenContent}
        </Text>
      ) : (
        childrenContent
      )}
    </View>
  )
}
