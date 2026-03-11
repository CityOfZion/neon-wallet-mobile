import { useRef } from 'react'

import { LoggerHelper } from '@/helpers/LoggerHelper'

import { useMount } from '@/hooks/useMount'
import { useUnreadNotificationsSelector } from '@/hooks/useNotificationSelector'
import { useAppDispatch } from '@/hooks/useRedux'
import { useWalletsSelector } from '@/hooks/useWalletSelector'

import { notificationReducerActions } from '@/store/reducers/notification'
import type { IWalletState, TNotification } from '@/types/store'

const useBackupReminderNotificationProcess = () => {
  const dispatch = useAppDispatch()

  const hasUnreadNotification = useRef(false)
  const hasWalletWithoutBackup = useRef(false)

  const processNotification = (notification: TNotification) => {
    try {
      if (hasUnreadNotification.current) return

      const payload = notification.action?.payload

      if (payload?.to !== 'backup-wallet') return

      hasUnreadNotification.current = true
    } catch (error) {
      LoggerHelper.error(error, { where: 'useBackupReminderNotificationProcess', operation: 'processNotification' })
    }
  }

  const processWallet = (wallet: IWalletState) => {
    try {
      if (hasUnreadNotification.current || hasWalletWithoutBackup.current || wallet.backupStatus === 'successful')
        return

      hasWalletWithoutBackup.current = true
    } catch (error) {
      LoggerHelper.error(error, { where: 'useBackupReminderNotificationProcess', operation: 'processWallet' })
    }
  }

  const finish = () => {
    try {
      if (hasUnreadNotification.current || !hasWalletWithoutBackup.current) return

      const notificationPrefix = 'components:setup.walletTasksManager.useBackupReminderNotificationProcess'

      setTimeout(() => {
        dispatch(
          notificationReducerActions.saveNotification({
            title: `${notificationPrefix}.notificationTitle`,
            previewBody: `${notificationPrefix}.notificationDescription`,
            priority: 'high',
            action: {
              type: 'navigate',
              payload: { to: 'backup-wallet' },
            },
          })
        )

        hasWalletWithoutBackup.current = false
        hasUnreadNotification.current = false
      }, 2000)
    } catch (error) {
      LoggerHelper.error(error, { where: 'useBackupReminderNotificationProcess', operation: 'finish' })
    }
  }

  return { processNotification, processWallet, finish }
}

const WalletTasksManagerSetup = () => {
  const { wallets } = useWalletsSelector()
  const { unreadNotificationsRef } = useUnreadNotificationsSelector()
  const backupReminderNotificationProcess = useBackupReminderNotificationProcess()

  const walletsAlreadyProcessedRef = useRef<Set<string>>(new Set())

  useMount(() => {
    const callbackId = requestIdleCallback(
      async () => {
        for (const notification of unreadNotificationsRef.current) {
          backupReminderNotificationProcess.processNotification(notification)
        }

        for (const wallet of wallets) {
          if (walletsAlreadyProcessedRef.current.has(wallet.id)) continue

          walletsAlreadyProcessedRef.current.add(wallet.id)

          backupReminderNotificationProcess.processWallet(wallet)
        }

        backupReminderNotificationProcess.finish()
      },
      { timeout: 20000 }
    )

    return () => {
      cancelIdleCallback(callbackId)
    }
  }, [wallets.length])

  return null
}

export default WalletTasksManagerSetup
