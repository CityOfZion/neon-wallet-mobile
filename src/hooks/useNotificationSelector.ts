import lodash from 'lodash'

import { SelectorHelper } from '@/helpers/SelectorHelper'

import { createAppSelector, useAppSelector } from './useRedux'

import type { TNotification, TNotificationPriority } from '@/types/store'

const priorityOrder: Record<TNotificationPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
}

const orderNotifications = <T extends TNotification>(notifications: T[]): T[] => {
  return lodash.orderBy(
    [...notifications],
    [notification => notification.read, notification => priorityOrder[notification.priority], 'date'],
    ['asc', 'asc', 'desc']
  )
}

const selectOrderedNotifications = createAppSelector([state => state.notification.data], notifications =>
  SelectorHelper.fallbackToEmptyArray<TNotification>(orderNotifications(notifications))
)

const selectHasNewNotifications = createAppSelector([state => state.notification.data], notifications =>
  notifications.some(({ read }) => !read)
)

const selectUnreadNotifications = createAppSelector([state => state.notification.data], notifications =>
  SelectorHelper.fallbackToEmptyArray<TNotification>(
    orderNotifications(notifications.filter(notification => !notification.read))
  )
)

export const useNotificationsSelector = () => {
  const { value, ref } = useAppSelector(selectOrderedNotifications)

  return { notifications: value, notificationsRef: ref }
}

export const useHasNewNotificationsSelector = () => {
  const { value, ref } = useAppSelector(selectHasNewNotifications)

  return { hasNewNotifications: value, hasNewNotificationsRef: ref }
}

export const useUnreadNotificationsSelector = () => {
  const { value, ref } = useAppSelector(selectUnreadNotifications)

  return { unreadNotifications: value, unreadNotificationsRef: ref }
}
