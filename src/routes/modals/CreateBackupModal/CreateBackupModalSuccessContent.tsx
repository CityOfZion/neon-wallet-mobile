import { useState } from 'react'

import * as Print from 'expo-print'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import QrCode from 'react-native-qrcode-svg'

import { TwButton } from '@/components/TwButton'

import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg'

type TProps = {
  password: string
}

export const CreateBackupModalSuccessContent = ({ password }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'createBackupModal' })

  const [qrCodeText, setQrCodeText] = useState('')

  const handleSavePassword = () => {
    if (!qrCodeText) return

    Print.printAsync({ html: `<img aria-hidden="true" src="data:image/jpeg;base64,${qrCodeText}" alt="" />` })
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

      <Text className="font-sans-medium text-2xl text-white">{t('successModal.description')}</Text>

      {qrCodeText && (
        <TwButton
          variant="outline"
          label={t('successModal.savePasswordButtonLabel')}
          leftElement={<TbDeviceFloppy aria-hidden />}
          onPress={handleSavePassword}
        />
      )}
    </View>
  )
}
