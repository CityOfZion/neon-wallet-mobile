import lodash from 'lodash'

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
    [item => item.read, item => priorityOrder[item.priority], 'date'],
    ['asc', 'asc', 'desc']
  )
}

const selectOrderedNotifications = createAppSelector([state => state.notification.data], notifications =>
  orderNotifications(notifications)
)

const selectHasNewNotifications = createAppSelector([state => state.notification.data], notifications =>
  notifications.some(({ read }) => !read)
)

const selectUnreadNotifications = createAppSelector([state => state.notification.data], notifications =>
  orderNotifications(notifications.filter(notification => !notification.read))
)

export const useNotificationsSelector = () => {
  const { ref, value } = useAppSelector(selectOrderedNotifications)

  return {
    notifications: value,
    notificationsRef: ref,
  }
}

export const useHasNewNotificationsSelector = () => {
  const { ref, value } = useAppSelector(selectHasNewNotifications)

  return {
    hasNewNotifications: value,
    hasNewNotificationsRef: ref,
  }
}

export const useUnreadNotificationsSelector = () => {
  const { ref, value } = useAppSelector(selectUnreadNotifications)
  return {
    unreadNotifications: value,
    unreadNotificationsRef: ref,
  }
}
