import React from 'react'

import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { Details } from '@/components/Details'
import { TwDappHeader } from '@/components/TwDappHeader'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbCube3dSphere from '@/assets/images/tb-cube-3d-sphere.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const DappPermissionSignatureScopeModal = ({
  route,
}: TRootStackScreenProps<'DappPermissionSignatureScopeModal'>) => {
  const { scope, session, allowedList } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'dappPermissionSignatureScope' })

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <TwDappHeader title={session.peer.metadata.name} uri={session.peer.metadata.icons[0]} />

        <Details.Root className="mt-5">
          <Details.Header
            leftElement={<TbCube3dSphere aria-hidden />}
            rightElement={<Text className="font-sans-semibold text-base capitalize text-gray-100">{scope}</Text>}
          >
            {t('scopeDetailsHeaderLabel')}
          </Details.Header>
        </Details.Root>

        {allowedList && (
          <Details.Root className="mt-3">
            <Details.Header>{t('allowListDetailsHeaderLabel')}</Details.Header>

            <Details.HeaderSeparator />

            <Details.Item>
              <Text className="break-words font-sans-regular text-base text-gray-100">{allowedList.join(',\r\n')}</Text>
            </Details.Item>
          </Details.Root>
        )}

        <Details.Root className="mt-3">
          <Details.Header>{t('explanationDetailsHeaderLabel')}</Details.Header>

          <Details.HeaderSeparator />

          <Details.Item>
            <Text className="break-words font-sans-regular text-base text-gray-100">
              {t(`scopes.${scope}`, t('scopes.unknown'))}
            </Text>
          </Details.Item>
        </Details.Root>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
