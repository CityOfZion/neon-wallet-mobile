import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwDappHeader } from '@/components/TwDappHeader'
import { TwDetailsCard } from '@/components/TwDetailsCard'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCube3dSphere from '@/assets/images/tb-cube-3d-sphere.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const DappPermissionSignatureScopeModal = ({
  route,
}: TRootStackScreenProps<'DappPermissionSignatureScopeModal'>) => {
  const { scope, session, allowedList } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'dappPermissionSignatureScopeModal' })

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />}>
      <TwDappHeader title={session.peer.metadata.name} uri={session.peer.metadata.icons[0]} />

      <TwDetailsCard.Root className="mt-5">
        <TwDetailsCard.Header
          leftElement={<TbCube3dSphere aria-hidden />}
          rightElement={<Text className="font-sans-semibold text-base capitalize text-gray-100">{scope}</Text>}
        >
          <Text className="font-sans-regular text-base capitalize text-white">{t('scopeDetailsHeaderLabel')}</Text>
        </TwDetailsCard.Header>
      </TwDetailsCard.Root>

      {allowedList && (
        <TwDetailsCard.Root className="mt-3">
          <TwDetailsCard.Header>
            <Text className="font-sans-regular text-base capitalize text-white">
              {t('allowListDetailsHeaderLabel')}
            </Text>
          </TwDetailsCard.Header>

          <TwDetailsCard.HeaderSeparator />

          <TwDetailsCard.Row>
            <Text className="break-words font-sans-regular text-base text-gray-100">{allowedList.join(',\r\n')}</Text>
          </TwDetailsCard.Row>
        </TwDetailsCard.Root>
      )}

      <TwDetailsCard.Root className="mt-3">
        <TwDetailsCard.Header>
          <Text className="font-sans-regular text-base capitalize text-white">
            {t('explanationDetailsHeaderLabel')}
          </Text>
        </TwDetailsCard.Header>

        <TwDetailsCard.HeaderSeparator />

        <TwDetailsCard.Row>
          <Text className="break-words font-sans-regular text-base text-gray-100">
            {t(`scopes.${scope}`, t('scopes.unknown'))}
          </Text>
        </TwDetailsCard.Row>
      </TwDetailsCard.Root>
    </TwModalLayout>
  )
}
