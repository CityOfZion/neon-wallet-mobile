import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { AccountSubTitle } from '@/components/AccountSubTitle'
import NeonQRCode from '@/components/NeonQRCode'
import { TwButton } from '@/components/TwButton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const AccountQRCodeModal = ({ route }: TRootStackScreenProps<'AccountQRCodeModal'>) => {
  const { account } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'accountQRCode' })
  const { t: commonT } = useTranslation('common')

  const handleCopy = () => {
    ClipboardHelper.write(account.address)
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
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
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
