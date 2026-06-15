import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import QrCode from 'react-native-qrcode-svg'

import { TwButton } from '@/components/TwButton'

import { DateHelper } from '@/helpers/DateHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useFileSystem } from '@/hooks/useFileSystem'

import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg'

type TProps = {
  password: string
}

export const CreateBackupModalSuccessContent = ({ password }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'createBackup' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
  const { writeFile } = useFileSystem()

  const [qrCodeText, setQrCodeText] = useState('')

  const handleSavePassword = async () => {
    if (!qrCodeText) return

    await writeFile(`NEON-qr-code-${DateHelper.getNowUnix()}`, qrCodeText, 'image/png')

    ToastHelper.success({ message: tCommonGeneral('savedSuccessfully') })
  }

  return (
    <View className="w-full flex-grow items-center justify-between">
      <View className="pointer-events-none invisible absolute w-full">
        <QrCode
          value={password}
          size={200}
          getRef={c => {
            if (!c?.toDataURL) return

            setTimeout(() => {
              c?.toDataURL?.((base64Image: string) => {
                setQrCodeText(base64Image)
              })
            }, 100)
          }}
        />
      </View>

      <Text className="font-sans-medium text-2xl text-white">{t('success.description')}</Text>

      {qrCodeText && (
        <TwButton
          variant="outline"
          label={t('success.savePasswordButtonLabel')}
          leftElement={<TbDeviceFloppy aria-hidden />}
          onPress={handleSavePassword}
        />
      )}
    </View>
  )
}
