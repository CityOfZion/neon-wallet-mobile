import React from 'react'

import { WalletKitHelper as BSWalletKitHelper } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { DappDetailsCard } from '@/components/DappDetailsCard'
import { Details } from '@/components/Details'
import { TwButton } from '@/components/TwButton'
import { TwDappHeader } from '@/components/TwDappHeader'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import { useAccountsWithWalletMapSelector } from '@/hooks/useAccountSelector'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import type { TRootStackScreenProps } from '@/types/stacks'

export const DappConnectionDetailsModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'DappConnectionDetailsModal'>) => {
  const { session } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'dappConnectionDetails' })
  const { t: commonT } = useTranslation('common')
  const { accountsWithWalletMapRef } = useAccountsWithWalletMapSelector()
  const { language } = useLanguageSelector()

  const [isDisconnecting, startDisconnect] = usePressOnce(async () => {
    await WalletKitHelper.kit
      .disconnectSession({ topic: session.topic, reason: BSWalletKitHelper.getError('USER_DISCONNECTED') })
      .catch(error =>
        LoggerHelper.error(error, { where: 'DappConnectionDetailsModal', operation: 'disconnectSession' })
      )

    navigation.goBack()
  })

  const sessionDetails = BSWalletKitHelper.getSessionDetails({
    session,
    services: BlockchainServiceHelper.bsAggregator.blockchainServices,
  })

  const account = accountsWithWalletMapRef.current.get(AccountHelper.buildAccountKey(sessionDetails))
  const wallet = account?.wallet

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="space-between">
        <TwDappHeader
          title={<Text className="font-sans-bold text-lg text-white">{session.peer.metadata.name}</Text>}
          uri={session.peer.metadata.icons[0]}
        />

        <DappDetailsCard
          chain={sessionDetails.service.walletConnectService.chain}
          methods={sessionDetails.methods}
          className="my-6"
        >
          <Details.Panel label={t('expiresAtPanelTitle')}>
            <Details.Item>
              {DateHelper.formatLocalized(new Date(session.expiry * 1000), { format: 'PPPp', language })}
            </Details.Item>
          </Details.Panel>

          {wallet && (
            <Details.Panel label={t('walletPanelTitle')}>
              <Details.Item>{wallet.name}</Details.Item>
            </Details.Panel>
          )}

          {account && (
            <Details.Panel label={t('accountPanelTitle')}>
              <Details.Item contentClassName="justify-start">
                <View
                  className={StyleHelper.mergeStyles('size-3 rounded-full bg-neon', account.skin.id)}
                  style={{
                    backgroundColor: account.skin.type === 'color' ? account.skin.id : undefined,
                  }}
                />

                <Text className="font-sans-medium text-sm text-white">{account.name}</Text>
              </Details.Item>
            </Details.Panel>
          )}
        </DappDetailsCard>

        <TwButton
          className="mt-auto"
          variant="outline"
          colorSchema="pink"
          label={commonT('general.disconnect')}
          isLoading={isDisconnecting}
          onPress={startDisconnect}
        />
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
