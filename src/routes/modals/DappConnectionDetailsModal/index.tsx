import React from 'react'

import { WalletKitHelper as BSWalletKitHelper } from '@cityofzion/bs-multichain'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwDappDetailsCard } from '@/components/TwDappDetailsCard'
import { TwDappHeader } from '@/components/TwDappHeader'
import { TwDetailsCard } from '@/components/TwDetailsCard'

import { AccountHelper } from '@/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { DateHelper } from '@/helpers/DateHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import { useAccountMapSelector } from '@/hooks/useAccountSelector'
import { usePressOnce } from '@/hooks/usePressOnce'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'
import { useWalletsMapSelector } from '@/hooks/useWalletSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import type { TRootStackScreenProps } from '@/types/stacks'

export const DappConnectionDetailsModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'DappConnectionDetailsModal'>) => {
  const { session } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'dappConnectionDetailsModal' })
  const { t: commonT } = useTranslation('common')
  const { accountsMapRef } = useAccountMapSelector()
  const { walletsMapRef } = useWalletsMapSelector()
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
  const account = accountsMapRef.current.get(AccountHelper.buildAccountKey(sessionDetails))
  const wallet = walletsMapRef.current.get(account?.idWallet || '')

  return (
    <TwModalLayout
      rightElement={<TwModalLayoutCloseIconButton />}
      title={t('title')}
      contentContainerClassName="space-between"
    >
      <TwDappHeader
        title={<Text className="font-sans-bold text-lg text-white">{session.peer.metadata.name}</Text>}
        uri={session.peer.metadata.icons[0]}
      />

      <TwDappDetailsCard
        chain={sessionDetails.service.walletConnectService.chain}
        methods={sessionDetails.methods}
        className="my-6"
      >
        <TwDetailsCard.Row>
          <TwDetailsCard.ItemPanel label={t('expiresAtPanelTitle')}>
            <Text className="font-sans-medium text-sm text-white">
              {DateHelper.formatLocalized(new Date(session.expiry * 1000), { format: 'PPPp', language })}
            </Text>
          </TwDetailsCard.ItemPanel>
        </TwDetailsCard.Row>

        {wallet && (
          <TwDetailsCard.Row>
            <TwDetailsCard.ItemPanel label={t('walletPanelTitle')}>
              <Text className="font-sans-medium text-sm text-white">{wallet.name}</Text>
            </TwDetailsCard.ItemPanel>
          </TwDetailsCard.Row>
        )}

        {account && (
          <TwDetailsCard.Row>
            <TwDetailsCard.ItemPanel label={t('accountPanelTitle')}>
              <View className="flex flex-row items-center gap-2">
                <View
                  className={StyleHelper.mergeStyles('size-2 rounded-full bg-neon', account.skin.id)}
                  style={{
                    backgroundColor: account.skin.type === 'color' ? account.skin.id : undefined,
                  }}
                />

                <Text className="font-sans-medium text-sm text-white">{account.name}</Text>
              </View>
            </TwDetailsCard.ItemPanel>
          </TwDetailsCard.Row>
        )}
      </TwDappDetailsCard>

      <TwButton
        className="mt-auto"
        variant="outline"
        colorSchema="pink"
        label={commonT('general.disconnect')}
        isLoading={isDisconnecting}
        onPress={startDisconnect}
      />
    </TwModalLayout>
  )
}
