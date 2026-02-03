import { useRef } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'

import { ActionAddressButton } from '@/components/ActionAddressButton'
import { ActionStep } from '@/components/ActionStep'
import { TwButton } from '@/components/TwButton'
import { TwSeparator } from '@/components/TwSeparator'

import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from '@/hooks/useActions'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import TbQrCode from '@/assets/images/tb-qrcode.svg'
import TbStepInto from '@/assets/images/tb-step-into.svg'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg'

import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { IAccountState } from '@/types/store'

type TActionData = {
  selectedAccount?: IAccountState
}

const { theme } = resolveConfig(tailwindConfig)

export const ReceiveScreen = ({ navigation, route }: TWalletsStackScreenProps<'ReceiveScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'receiveScreen' })
  const { writeMedia } = useMediaLibrary()

  const { actionData, setDataWrapper } = useActions<TActionData>({
    selectedAccount: route.params?.account,
  })

  const qrRef = useRef<any>(null)

  const handleCopyQRCode = () => {
    if (!qrRef.current || !actionData.selectedAccount?.address) return

    qrRef.current.toDataURL(async (dataURL: string) => {
      await writeMedia(dataURL, `qr_code_${actionData.selectedAccount?.address}`)
      ToastHelper.success({ message: t('successfulDownloadMessage') })
    })
  }

  return (
    <TwScreenLayout title={t('title')}>
      <View className="rounded bg-gray-700/60 px-2 pb-6">
        <ActionStep
          title={t('accountStepTitle')}
          titleClassName="font-sans-bold"
          leftElement={<TbStepInto aria-hidden className="text-blue" />}
        >
          <ActionAddressButton
            label={t('accountSelectPlaceholder')}
            address={actionData.selectedAccount?.address}
            blockchain={actionData.selectedAccount?.blockchain}
            onPress={() =>
              navigation.navigate('AccountSelectionModal', {
                title: t('accountSelectionModalTitle'),
                onSelect: setDataWrapper('selectedAccount'),
              })
            }
          />
        </ActionStep>

        <TwSeparator />

        <ActionStep
          title={t('qrCodeStepTitle')}
          leftElement={<VscCircleFilled aria-hidden className="h-2 w-2" />}
          className="items-start"
        />

        <View className="mt-4 items-center">
          <View className="items-center justify-center rounded-xl border-2 border-gray-700 bg-asphalt p-4">
            {actionData.selectedAccount ? (
              <QRCode
                value={actionData.selectedAccount?.address}
                backgroundColor="transparent"
                color={theme.colors.neon.DEFAULT}
                getRef={ref => {
                  qrRef.current = ref
                }}
                size={208}
              />
            ) : (
              <TbQrCode aria-hidden className="size-52 stroke-1 text-green-700" />
            )}
          </View>
        </View>

        <View className="mt-8 items-center justify-center rounded-lg bg-asphalt px-6 py-3">
          <Text className="text-center font-sans-regular text-[1.125rem] text-gray-300">
            {actionData.selectedAccount?.address ?? t('addressInputPlaceholder')}
          </Text>
        </View>

        {!actionData.selectedAccount && (
          <Text className="mt-4 px-6 text-center font-sans-regular text-lg text-gray-300">
            {t('noAccountSelectAlert')}
          </Text>
        )}
      </View>

      <View className="mt-auto py-4">
        <TwButton
          variant="contained-light"
          label={t('downloadButtonLabel')}
          leftElement={<TbQrCode aria-hidden />}
          onPress={handleCopyQRCode}
          disabled={!actionData.selectedAccount}
        />
      </View>
    </TwScreenLayout>
  )
}
