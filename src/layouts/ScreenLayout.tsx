import { Children, Fragment, isValidElement, useEffect, useState } from 'react'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import type { GestureResponderEvent, ScrollViewProps, TextProps, ViewProps } from 'react-native'
import { ScrollView, Text, View } from 'react-native'
import { KeyboardAvoidingView, type KeyboardAvoidingViewProps } from 'react-native-keyboard-controller'

import { type TTwButtonProps, TwButton } from '@/components/TwButton'
import { type TTwIconButtonProps, TwIconButton } from '@/components/TwIconButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import { usePressOnce } from '@/hooks/usePressOnce'
import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'
import { useIsConnectedSelector } from '@/hooks/useUtilitySelector'

import TbArrowLeft from '@/assets/images/tb-arrow-left.svg'
import TbCircleOff from '@/assets/images/tb-circle-off.svg'
import TbAlertTriangleFilled from '@/assets/images/tb-filled-alert-triangle.svg'

const Banners = () => {
  const { t } = useTranslation('components', { keyPrefix: 'screenLayoutBars' })
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { isNotConnected } = useIsConnectedSelector()

  let hasCustom = false
  let hasTestnet = false

  Object.entries(selectedNetworkByBlockchain).forEach(([_blockchain, network]) => {
    hasCustom = hasCustom || network.type === 'custom'
    hasTestnet = hasTestnet || network.type === 'testnet'
  })

  return (
    <View>
      <View
        className={StyleHelper.mergeStyles('h-[env(safe-area-inset-top)]', {
          'bg-black': hasCustom || hasTestnet,
          'bg-transparent': !hasCustom && !hasTestnet && isNotConnected,
        })}
      />

      {hasCustom && (
        <View className="w-full flex-row items-center justify-center gap-2 border-b-2 border-neon bg-black p-4">
          <TbAlertTriangleFilled aria-hidden className="size-6 text-neon" />
          <Text className="font-sans-regular text-lg leading-5 text-white">{t('customMode')}</Text>
        </View>
      )}

      {hasTestnet && (
        <View className="w-full flex-row items-center justify-center gap-2 border-b-2 border-magenta bg-black p-4">
          <TbAlertTriangleFilled aria-hidden className="size-6 text-magenta" />
          <Text className="font-sans-regular text-lg leading-5 text-white">{t('testnetMode')}</Text>
        </View>
      )}

      {isNotConnected && (
        <View className="w-full flex-row items-center justify-center gap-2 border-b border-neon bg-gray-900 p-4">
          <TbCircleOff aria-hidden className="size-8.5 text-neon" />
          <View>
            <Text className="font-sans-regular text-1xs uppercase text-neon">{t('warning')}</Text>
            <Text className="font-sans-regular text-xs text-white">{t('noInternet')}</Text>
          </View>
        </View>
      )}
    </View>
  )
}

const Root = ({ className, children, accessibilityRole = 'none', ...props }: ViewProps) => {
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (isFocused) {
      setShouldShow(true)
      return
    }

    let rootNavigation = navigation

    while (true) {
      const parent = rootNavigation.getParent()
      if (!parent) break
      rootNavigation = parent
    }

    const state = rootNavigation.getState()
    if (!state) {
      setShouldShow(true)
      return
    }

    const route = state.routes[state.index]

    if (route.key.toLowerCase().includes('modal')) {
      setShouldShow(true)
    } else {
      setShouldShow(false)
    }
  }, [isFocused, navigation])

  return (
    <View
      accessibilityRole={accessibilityRole}
      className={StyleHelper.mergeStyles('flex-grow bg-asphalt', className)}
      {...props}
    >
      {shouldShow && (
        <Fragment>
          <Banners />
          {children}
        </Fragment>
      )}
    </View>
  )
}

const Header = ({ children, className, accessibilityRole = 'header', ...props }: ViewProps) => {
  return (
    <View
      accessibilityRole={accessibilityRole}
      className={StyleHelper.mergeStyles(`relative h-[44px] w-full flex-row items-center justify-center`, className)}
      {...props}
    >
      {children}
    </View>
  )
}

const Title = ({ className, children, accessibilityRole = 'header', ...props }: TextProps) => {
  return (
    <Text
      accessibilityRole={accessibilityRole}
      className={StyleHelper.mergeStyles(
        'max-w-[55%] flex-1 text-center font-sans-medium text-xl text-white',
        className
      )}
      numberOfLines={1}
      {...props}
    >
      {children}
    </Text>
  )
}

const ScrollContent = ({ className, contentContainerClassName, ...props }: ScrollViewProps) => {
  return (
    <ScrollView
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      className={StyleHelper.mergeStyles('flex-1', className)}
      contentContainerClassName={StyleHelper.mergeStyles('pt-3.5 pb-4.5 px-3.5 flex-grow', contentContainerClassName)}
      {...props}
    />
  )
}

const ViewContent = ({ className, ...props }: ViewProps) => {
  return (
    <View
      className={StyleHelper.mergeStyles('w-full flex-1 items-center px-3.5 pb-4.5 pt-3.5', className)}
      {...props}
    />
  )
}

const KeyboardAvoidingContent = ({ className, children, ...props }: KeyboardAvoidingViewProps) => {
  const childrenArray = Children.toArray(children)
  const scrollChildren = childrenArray.filter(child => !isValidElement(child) || child.type !== KeyboardAvoidingArea)
  const areaChildren = childrenArray.filter(child => isValidElement(child) && child.type === KeyboardAvoidingArea)

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className={StyleHelper.mergeStyles('w-full flex-1 pb-4.5 pt-3.5', className)}
      {...(props as any)}
    >
      <ScrollView className="flex-1 px-3.5">{scrollChildren}</ScrollView>

      {areaChildren}
    </KeyboardAvoidingView>
  )
}

const KeyboardAvoidingArea = ({ className, children, ...props }: ViewProps) => {
  return (
    <View className={StyleHelper.mergeStyles('px-3.5 py-4.5', className)} {...props}>
      {children}
    </View>
  )
}

type TButtonPosition = 'left' | 'right'
type TButtonContentProps = ViewProps & { position: TButtonPosition }
const ButtonContent = ({ className, children, position, ...props }: TButtonContentProps) => {
  return (
    <View
      className={StyleHelper.mergeStyles(
        'absolute',
        { 'right-0': position === 'right', 'left-0': position === 'left' },
        className
      )}
      {...props}
    >
      {children}
    </View>
  )
}

type TButtonProps = TTwButtonProps & { position: TButtonPosition }
const Button = ({ contentProps, labelProps, position, className, ...props }: TButtonProps) => {
  return (
    <TwButton
      className={StyleHelper.mergeStyles(
        'absolute',
        {
          'right-0': position === 'right',
          'left-0': position === 'left',
        },
        className
      )}
      labelProps={{ ...labelProps, className: StyleHelper.mergeStyles('text-base', labelProps?.className) }}
      contentProps={{ ...contentProps, className: StyleHelper.mergeStyles('px-5', contentProps?.className) }}
      variant="text"
      animation="opacity"
      {...props}
    />
  )
}

const BackButton = ({ className, onPress, ...props }: Omit<TTwIconButtonProps, 'icon'>) => {
  const navigation = useNavigation()
  const { t } = useTranslation('components', { keyPrefix: 'screenLayout' })

  const [isGoingBack, startGoBack] = usePressOnce((event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event)
      return
    }
    navigation.goBack()
  })

  return (
    <TwIconButton
      accessibilityRole="button"
      aria-label={t('backButtonLabel')}
      onPress={startGoBack}
      disabled={isGoingBack}
      className={StyleHelper.mergeStyles('absolute left-0', className)}
      icon={<TbArrowLeft aria-hidden className="text-white" />}
      {...props}
    />
  )
}

export const ScreenLayout = {
  Root,
  Banners,
  Header,
  Title,
  ScrollContent,
  ViewContent,
  KeyboardAvoidingContent,
  KeyboardAvoidingArea,
  Button,
  BackButton,
  ButtonContent,
}
