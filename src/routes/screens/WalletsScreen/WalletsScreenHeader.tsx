import React from 'react'

import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { Passkey } from 'react-native-passkey'

import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useAppDispatch } from '@/hooks/useRedux'

import MdMoreHoriz from '@/assets/images/md-more-horiz.svg'
import TbAlertTriangleFilled from '@/assets/images/tb-filled-alert-triangle.svg'

import { WalletsScreenNotificationButton } from './WalletsScreenNotificationButton'

import { walletReducerActions } from '@/store/reducers/wallet'
import type { TWallet } from '@/types/store'

type Props = {
  selectedWallet?: TWallet
}

export function bufferToBase64URLString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let str = ''

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode)
  }

  const base64String = btoa(str)

  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function utf8StringToBuffer(value: string): ArrayBuffer {
  return new TextEncoder().encode(value).buffer
}

export const WalletsScreenHeader = ({ selectedWallet }: Props) => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const { t } = useTranslation('screens', { keyPrefix: 'wallets' })

  const handlePressMore = async () => {
    try {
      const credentials = await Passkey.create({
        challenge: bufferToBase64URLString(utf8StringToBuffer('fizz')),
        user: {
          id: bufferToBase64URLString(utf8StringToBuffer('290283490')),
          displayName: 'username',
          name: 'username',
        },
        rp: { name: 'Neon', id: 'teressa-overjoyful-contently.ngrok-free.dev' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        extensions: {
          ...(Platform.OS !== 'android' && { largeBlob: { support: 'required' } }),
          prf: {},
        },
      })

      console.log({ credentials })
    } catch (error) {
      console.log({ error })
    }
  }

  const handlePressWarning = () => {
    if (!selectedWallet) return

    dispatch(walletReducerActions.saveWallet({ ...selectedWallet, backupStatus: 'unsuccessful_with_knowledge' }))

    navigation.navigate('BackupAlertModal', {
      wallet: selectedWallet,
    })
  }

  return (
    <View className="flex-row items-center justify-between pb-6 pt-2.5">
      <WalletsScreenNotificationButton />

      {selectedWallet?.type === 'standard' && (
        <View
          className={StyleHelper.mergeStyles('flex-1 flex-row items-center justify-center', {
            'justify-end': selectedWallet?.backupStatus === 'unsuccessful_with_knowledge',
          })}
        >
          {selectedWallet?.backupStatus === 'unsuccessful' ? (
            <TwButton
              className="h-9"
              variant="text-slim"
              label={t('walletBackupButtonLabel')}
              leftElement={<TbAlertTriangleFilled aria-hidden className="size-5" />}
              onPress={handlePressWarning}
              labelProps={{
                className: 'text-xs font-sans-bold uppercase',
              }}
            />
          ) : (
            selectedWallet?.backupStatus === 'unsuccessful_with_knowledge' && (
              <TbAlertTriangleFilled aria-hidden className="size-5 text-neon" />
            )
          )}
        </View>
      )}

      <TwIconButton
        icon={<MdMoreHoriz aria-hidden className="text-white" />}
        onPress={handlePressMore}
        animation="scale"
      />
    </View>
  )
}
