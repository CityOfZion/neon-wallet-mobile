import type { CaseReducer, PayloadAction } from '@reduxjs/toolkit'
import * as ExpoNotifications from 'expo-notifications'

import { DateHelper } from '@/helpers/DateHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import type { INotificationReducer } from '.'

import type { TNotification, TSaveNotification } from '@/types/store'

const { t } = I18nextHelper.get()

const saveNotification: CaseReducer<INotificationReducer, PayloadAction<TSaveNotification>> = (state, action) => {
  const notification: TNotification = {
    id: UtilsHelper.uuid(),
    date: DateHelper.getNowUnix(),
    read: false,
    priority: 'low',
    provider: 'system',
    ...action.payload,
  }

  const findIndex = state.data.findIndex(item => item.id === notification.id)

  if (findIndex < 0) {
    state.data = [...state.data, notification]

    ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: t(notification.title, { defaultValue: notification.title, value: notification.titleValue }),
        body: t(notification.previewBody, {
          defaultValue: notification.previewBody,
          value: notification.previewBodyValue,
        }),
      },
      trigger: null,
    })

    return
  }

  state.data[findIndex] = notification
}

export const notificationSliceReducers = {
  saveNotification,
}
