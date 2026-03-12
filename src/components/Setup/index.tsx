import { Fragment } from 'react'

import { useIsOnboardingCompletedSelector } from '@/hooks/useSettingsSelector'

import { AccountTasksManagerSetup } from './AccountTasksManagerSetup'
import { HardwareWalletManagerSetup } from './HardwareWalletManagerSetup'
import { InternetManagerSetup } from './InternetManagerSetup'
import { NetworkManagerSetup } from './NetworkManagerSetup'
import { NotificationManagerSetup } from './NotificationManagerSetup'
import { OverTheAirManagerSetup } from './OverTheAirManagerSetup'
import { SettingsManagerSetup } from './SettingsManagerSetup'
import { WalletConnectManagerSetup } from './WalletConnectManagerSetup'
import { WalletTasksManagerSetup } from './WalletTasksManagerSetup'

const Setup = () => {
  const { isOnboardingCompleted } = useIsOnboardingCompletedSelector()
  if (!isOnboardingCompleted) {
    return null
  }

  return (
    <Fragment>
      <SettingsManagerSetup />

      <InternetManagerSetup />

      <NotificationManagerSetup />

      <HardwareWalletManagerSetup />

      <WalletConnectManagerSetup />

      <NetworkManagerSetup />

      <OverTheAirManagerSetup />

      <AccountTasksManagerSetup />

      <WalletTasksManagerSetup />
    </Fragment>
  )
}

export default Setup
