import { cloneElement, Fragment, useCallback, useMemo } from 'react'

import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'

import { AccountHelper } from '@/helpers/AccountHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useNotificationsSelector } from '@/hooks/useNotificationSelector'
import { useAppDispatch } from '@/hooks/useRedux'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdCircleMedium from '@/assets/images/md-circle-medium.svg'
import MdMoreVert from '@/assets/images/md-more-vert.svg'
import TbAlertSquare from '@/assets/images/tb-alert-square.svg'
import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'
import TbBell from '@/assets/images/tb-bell.svg'

import { functionByNotificationActionType } from './functionByNotificationActionType'

import { notificationReducerActions } from '@/store/reducers/notification'
import type { TMoreStackScreenProps } from '@/types/stacks'
import type { TAccount, TNotification, TNotificationPriority } from '@/types/store'

type TItem = {
  notification: TNotification
  localizedDate: string
  relatedAccount?: TAccount
  onPress(notification: TNotification): void
  onMorePress(notification: TNotification): void
}

const iconsByPriority: Record<TNotificationPriority, JSX.Element> = {
  high: <TbAlertTriangle className="text-pink" />,
  medium: <TbAlertSquare className="text-blue" />,
  low: <MdCircleMedium className="text-neon" />,
}

const { t } = I18nextHelper.get()

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  const icon = iconsByPriority[item.notification.priority]

  return (
    <TouchableOpacity
      className="flex-row px-1.5 py-3"
      onPress={
        item.notification.action && !item.notification.read ? item.onPress.bind(null, item.notification) : undefined
      }
      disabled={item.notification.read}
    >
      {cloneElement(icon, {
        'aria-hidden': true,
        className: StyleHelper.mergeStyles(icon.props?.className, 'size-5 mt-7', {
          'text-gray-300': item.notification.read,
        }),
      })}

      <View className="ml-3 w-full flex-shrink">
        <View className="mb-0.5 flex-row items-center gap-2.5">
          <Text className="font-sans-regular text-sm text-gray-300">{item.localizedDate}</Text>

          <Text className="rounded-full bg-gray-800 px-2.5 py-0.5 font-sans-regular text-sm capitalize text-gray-300">
            {t(`screens:notifications.providerLabels.${item.notification.provider}`)}
          </Text>
        </View>

        <Text
          className={StyleHelper.mergeStyles('font-sans-bold text-lg text-white', {
            'font-sans-regular text-gray-300': item.notification.read,
          })}
        >
          {t(item.notification.title, { defaultValue: item.notification.title, value: item.notification.titleValue })}
        </Text>

        <Text
          className={StyleHelper.mergeStyles('font-sans-regular text-sm text-gray-100', {
            'text-gray-300': item.notification.read,
          })}
        >
          {t(item.notification.previewBody, {
            defaultValue: item.notification.previewBody,
            value: item.notification.previewBodyValue,
          })}
        </Text>

        {item.notification.related?.address && (
          <View className="flex-row gap-2.5">
            {item.relatedAccount && (
              <View className="flex-1 flex-row">
                <Text className="font-sans-regular text-sm text-gray-300">{`${t('screens:notifications.relatedAccountLabel')} `}</Text>

                <Text className="flex-shrink font-sans-regular text-sm text-gray-300" numberOfLines={1}>
                  {item.relatedAccount.name}
                </Text>
              </View>
            )}

            <View className="flex-1 flex-row">
              <Text className="font-sans-regular text-sm text-gray-300">{`${t('screens:notifications.relatedAddressLabel')} `}</Text>

              <Text
                className="w-12 flex-shrink font-sans-regular text-sm text-gray-300"
                numberOfLines={1}
                ellipsizeMode="head"
              >
                {item.notification.related.address}
              </Text>
            </View>
          </View>
        )}
      </View>

      <TwIconButton
        aria-label={t('screens:notifications.actionsButtonLabel')}
        icon={<MdMoreVert className="text-gray-100" aria-hidden />}
        onPress={item.onMorePress.bind(null, item.notification)}
      />
    </TouchableOpacity>
  )
}

export const NotificationsScreen = ({ navigation }: TMoreStackScreenProps<'NotificationsScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'notifications' })
  const { notifications } = useNotificationsSelector()
  const { accounts } = useAccountsSelector()
  const { language } = useLanguageSelector()
  const dispatch = useAppDispatch()

  const handleNotificationPress = useCallback(
    async (notification: TNotification) => {
      if (!notification.action || notification.read) return

      try {
        const actionsFn = functionByNotificationActionType[notification.action.type]

        if (!actionsFn) return

        await actionsFn({
          navigation,
          notificationAction: notification.action,
        })
      } catch (error) {
        LoggerHelper.error(error, { where: 'NotificationsScreen', operation: 'handleNotificationPress' })
        ToastHelper.error({ message: AppError.wrap(error).message })
      }
    },
    [navigation]
  )

  const handleMorePress = useCallback(
    (notification: TNotification) => {
      navigation.navigate('NotificationContextModal', { notification })
    },
    [navigation]
  )

  const items = useMemo<TItem[]>(() => {
    return notifications.map(item => ({
      notification: item,
      relatedAccount: item.related ? accounts.find(AccountHelper.predicate(item.related)) : undefined,
      localizedDate: DateHelper.formatLocalized(item.date, { format: 'PPPp', language }),
      onPress: (notification: TNotification) => {
        dispatch(
          notificationReducerActions.saveNotification({
            ...notification,
            read: true,
          })
        )

        handleNotificationPress(notification)
      },
      onMorePress: handleMorePress,
    }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, handleMorePress, handleNotificationPress, notifications, language])

  const handleBack = () => {
    navigation.replace('TabStack', {
      screen: 'WalletsStack',
      params: {
        screen: 'WalletsScreen',
      },
    })
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton onPress={handleBack} />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent className="items-center">
        {!items.length ? (
          <Fragment>
            <TbBell className="mt-20 size-28 stroke-1 text-gray-300" aria-hidden />
            <Text className="mt-7 font-sans-medium text-2xl text-white">{t('emptyListTitle')}</Text>
            <Text className="mt-3.5 font-sans-regular text-lg text-gray-100">{t('emptyListBody')}</Text>
          </Fragment>
        ) : (
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            itemLayoutAnimation={LinearTransition}
            className="w-full"
            data={items}
            ItemSeparatorComponent={TwSeparator}
            keyExtractor={item => item.notification.id}
            renderItem={renderItem}
          />
        )}
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}
