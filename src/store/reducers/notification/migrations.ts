export function getNotificationMigrations() {
  return {
    0: (state: any) => ({
      ...state,
      data: state.data.map((notification: any) => {
        const action = notification?.action
        const payload = action?.payload

        if (action?.type === 'navigate' && payload?.to === 'account-tokens') {
          return { ...notification, action: { ...action, payload: { ...payload, to: 'hide-fraudulent-token' } } }
        }

        return notification
      }),
    }),
    1: (state: any) => ({
      ...state,
      data: state.data.filter((notification: any) => notification?.action?.payload?.to !== 'migration-neo3'),
    }),
    2: (state: any) => ({
      ...state,
      data: state.data.map((notification: any) => {
        if (notification.title === 'hooks:useFraudulentTokensNotification.notificationTitle') {
          const notificationPrefix = 'components:setup.accountTasksManager.useFraudulentTokensNotificationProcess'
          return {
            ...notification,
            title: `${notificationPrefix}.notificationTitle`,
            previewBody: `${notificationPrefix}.notificationDescription`,
          }
        }

        return notification
      }),
    }),
  }
}
