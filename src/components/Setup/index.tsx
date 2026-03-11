import { Fragment, Suspense } from 'react'

import { LazyHelper } from '@/helpers/LazyHelper'

import { useIsOnboardingCompletedSelector } from '@/hooks/useSettingsSelector'

import InternetManagerSetup from './InternetManagerSetup'

const NotificationManagerSetup = LazyHelper.delayedLazy(() => import('./NotificationManagerSetup'), 0)
const HardwareWalletManagerSetup = LazyHelper.delayedLazy(() => import('./HardwareWalletManagerSetup'), 0)
const WalletConnectManagerSetup = LazyHelper.delayedLazy(() => import('./WalletConnectManagerSetup'), 1000)
const NetworkManagerSetup = LazyHelper.delayedLazy(() => import('./NetworkManagerSetup'), 1000)
const OverTheAirManagerSetup = LazyHelper.delayedLazy(() => import('./OverTheAirManagerSetup'), 5000)
const AccountTasksManagerSetup = LazyHelper.delayedLazy(() => import('./AccountTasksManagerSetup'), 10000)
const WalletTasksManagerSetup = LazyHelper.delayedLazy(() => import('./WalletTasksManagerSetup'), 15000)
const SettingsManagerSetup = LazyHelper.delayedLazy(() => import('./SettingsManagerSetup'), 10000)

export const Setup = () => {
  const { isOnboardingCompleted } = useIsOnboardingCompletedSelector()
  if (!isOnboardingCompleted) {
    return null
  }

  return (
    <Fragment>
      <InternetManagerSetup />

      <Suspense fallback={null}>
        <NotificationManagerSetup />
        <HardwareWalletManagerSetup />
        <WalletConnectManagerSetup />
      </Suspense>

      <Suspense fallback={null}>
        <NetworkManagerSetup />
        <OverTheAirManagerSetup />
      </Suspense>

      <Suspense fallback={null}>
        <AccountTasksManagerSetup />
      </Suspense>

      <Suspense fallback={null}>
        <WalletTasksManagerSetup />
      </Suspense>

      <Suspense>
        <SettingsManagerSetup />
      </Suspense>
    </Fragment>
  )
}
