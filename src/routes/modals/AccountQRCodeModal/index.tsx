import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { AccountSubTitle } from '@/components/AccountSubTitle'
import NeonQRCode from '@/components/NeonQRCode'
import { TwButton } from '@/components/TwButton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const AccountQRCodeModal = ({ route }: TRootStackScreenProps<'AccountQRCodeModal'>) => {
  const { account } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'accountQRCodeModal' })
  const { t: commonT } = useTranslation('common')

  const handleCopy = () => {
    ClipboardHelper.write(account.address)
  }

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />}>
      <AccountSubTitle account={account} />

      <View className="my-11 w-full px-9">
        <NeonQRCode value={account.address} />
      </View>

      <Text className="font-sans-semibold text-sm uppercase text-gray-300">{t('address')}</Text>
      <Text className="mt-2 font-sans-regular text-base text-white">{account.address}</Text>

      <TwButton
        leftElement={<TbCopy aria-hidden />}
        className="mt-auto"
        variant="contained-light"
        label={commonT('general.copyToClipboard')}
        onPress={handleCopy}
      />
    </TwModalLayout>
  )
}
