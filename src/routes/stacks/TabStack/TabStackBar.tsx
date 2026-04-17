import React, { cloneElement } from 'react'

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/native'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { TouchableOpacityProps } from 'react-native'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import TbMenu2 from '@/assets/images/tb-menu-2.svg'
import TbPlug from '@/assets/images/tb-plug.svg'
import TbPlus from '@/assets/images/tb-plus.svg'
import TbSearch from '@/assets/images/tb-search.svg'
import WalletIcon from '@/assets/images/wallet-icon.svg'

import type { TTabStackParamList } from '@/types/stacks'

type TTabButtonProps = {
  icon: JSX.Element
  label: string
  active?: boolean
} & TouchableOpacityProps

const TabButton = ({ icon, active, className, label, ...props }: TTabButtonProps) => {
  return (
    <TouchableOpacity
      className={StyleHelper.mergeStyles('flex-1 items-center justify-center gap-1.5', className)}
      {...props}
    >
      {cloneElement(icon, {
        ...icon.props,
        className: StyleHelper.mergeStyles(
          'text-gray-100 size-7',
          {
            'text-white': active,
          },
          icon.props.className
        ),
      })}

      <Text
        className={StyleHelper.mergeStyles('font-sans-semibold text-1xs uppercase text-gray-100', {
          'text-white': active,
        })}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export const TabStackBar = (props: BottomTabBarProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'tabStackBar' })
  const { bottom } = useSafeAreaInsets()

  // IOS has a bigger bottom inset when the home indicator is visible
  const bottomOffset = Math.max(0, Platform.OS === 'ios' ? bottom - 10 : bottom)

  const activeRoute = props.state.routes[props.state.index]

  const handleOnPress = (routeName: keyof TTabStackParamList) => {
    const routeIndex = props.state.routeNames.indexOf(routeName)
    const route = props.state.routes[routeIndex]

    const event = props.navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })

    const isFocused = activeRoute.name === routeName

    if (!isFocused && !event.defaultPrevented) {
      props.navigation.dispatch({
        ...CommonActions.navigate(route),
        target: props.state.key,
      })
    }
  }

  const handlePressQuickTools = () => {
    props.navigation.navigate('QuickToolsModal')
  }

  return (
    <View className="w-full">
      <View
        className={StyleHelper.mergeStyles('w-full flex-row bg-gray-900')}
        style={{
          minHeight: ConstantsHelper.footerHeight + bottomOffset,
          paddingBottom: bottomOffset,
        }}
      >
        <TabButton
          icon={<WalletIcon aria-hidden />}
          label={t('walletsStackButtonLabel')}
          onPress={() => handleOnPress('WalletsStack')}
          active={activeRoute.name === 'WalletsStack'}
        />
        <TabButton
          icon={<TbPlug aria-hidden />}
          label={t('connectionsStackButtonLabel')}
          onPress={() => handleOnPress('DappConnectStack')}
          active={activeRoute.name === 'DappConnectStack'}
        />

        <View className="relative flex-1 items-center">
          <View className="absolute -top-3.5 h-16 w-16 rounded-full bg-gray-900 p-1">
            <TouchableOpacity
              className="size-full items-center justify-center rounded-full bg-neon"
              onPress={handlePressQuickTools}
              aria-label={t('quickToolsButtonLabel')}
            >
              <TbPlus aria-hidden className="h-8 w-8 text-asphalt" />
            </TouchableOpacity>
          </View>
        </View>

        <TabButton
          icon={<TbSearch aria-hidden />}
          label={t('searchStackButtonLabel')}
          active={activeRoute.name === 'SearchStack'}
          onPress={() => handleOnPress('SearchStack')}
        />
        <TabButton
          icon={<TbMenu2 aria-hidden />}
          label={t('moreStackButtonLabel')}
          active={activeRoute.name === 'MoreStack'}
          onPress={() => handleOnPress('MoreStack')}
        />
      </View>
    </View>
  )
}
