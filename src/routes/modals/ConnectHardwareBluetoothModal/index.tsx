import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { ScreenLoader } from '@/components/ScreenLoader'

import { useBluetooth } from '@/hooks/useBluetooth'

import { ModalLayout } from '@/layouts/ModalLayout'

import { ConnectHardwareBluetoothModalBluetoothOff } from './ConnectHardwareBluetoothModalBluetoothOff'
import { ConnectHardwareBluetoothModalList } from './ConnectHardwareBluetoothModalList'
import { ConnectHardwareBluetoothModalPermission } from './ConnectHardwareBluetoothModalPermission'

import type { TRootStackScreenProps } from '@/types/stacks'

export const ConnectHardwareBluetoothModal = (props: TRootStackScreenProps<'ConnectHardwareBluetoothModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'connectHardwareBluetooth' })
  const { bluetoothState, bluetoothPermissionIsGranted, locationPermissionIsGranted, isLoading } = useBluetooth()

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ViewContent className="items-center">
        {match({ bluetoothState, bluetoothPermissionIsGranted, locationPermissionIsGranted, isLoading })
          .with({ isLoading: true }, () => <ScreenLoader />)
          .with({ bluetoothState: P.not('PoweredOn') }, () => <ConnectHardwareBluetoothModalBluetoothOff />)
          .with(
            { bluetoothPermissionIsGranted: false },
            { locationPermissionIsGranted: false },
            ({ bluetoothPermissionIsGranted, locationPermissionIsGranted }) => (
              <ConnectHardwareBluetoothModalPermission
                bluetoothPermissionIsGranted={bluetoothPermissionIsGranted}
                locationPermissionIsGranted={locationPermissionIsGranted}
              />
            )
          )
          .otherwise(() => (
            <ConnectHardwareBluetoothModalList {...props} />
          ))}
      </ModalLayout.ViewContent>
    </ModalLayout.Root>
  )
}
