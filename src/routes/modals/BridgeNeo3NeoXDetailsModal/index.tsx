import React, { useState } from 'react'

import { BSError } from '@cityofzion/blockchain-service'
import { Neo3NeoXBridgeOrchestrator } from '@cityofzion/bs-multichain'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import type { BSNeoX } from '@cityofzion/bs-neox'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { BlockchainIconWithLabel } from '@/components/BlockchainIconWithLabel'
import { Details } from '@/components/Details'
import { Loader } from '@/components/Loader'
import { TwButton } from '@/components/TwButton'
import { TwStepper } from '@/components/TwStepper'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LinkHelper } from '@/helpers/LinkHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'

import { useMount } from '@/hooks/useMount'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TRootStackScreenProps } from '@/types/stacks'

type TStatus = 'confirming' | 'completed' | 'error'

const stepsByStatus: Record<TStatus, number> = {
  confirming: 1,
  error: 2,
  completed: 3,
}

export const BridgeNeo3NeoXDetailsModal = ({
  route: {
    params: {
      tokenToUse,
      tokenToReceive,
      accountToUse,
      addressToReceive,
      amountToUse,
      amountToReceive,
      transactionHash,
      confirmed,
    },
  },
}: TRootStackScreenProps<'BridgeNeo3NeoXDetailsModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'bridgeNeo3NeoXDetailsModal' })

  const [status, setStatus] = useState<TStatus>('confirming')
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleOpenHelpLink = () => {
    LinkHelper.open(ConstantsHelper.cozDiscordUrl)
  }

  useMount(() => {
    if (!transactionHash || confirmed === false) {
      setStatus('error')

      return
    }

    if (confirmed === true) {
      setStatus('completed')

      return
    }

    const neo3Service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName
      .neo3 as BSNeo3<TBlockchainServiceKey>
    const neoXService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName
      .neox as BSNeoX<TBlockchainServiceKey>

    Neo3NeoXBridgeOrchestrator.wait({ tokenToUse, tokenToReceive, transactionHash, neo3Service, neoXService })
      .then(() => setStatus('completed'))
      .catch(error => {
        LoggerHelper.error(error, { where: 'BridgeNeo3NeoXDetailsModal', operation: 'wait' })

        setStatus('error')
        setErrorMessage(
          error instanceof BSError
            ? t(`errorsByCode.${error.code}`, t('errorsByCode.UNEXPECTED_ERROR'))
            : t('errorsByCode.UNEXPECTED_ERROR')
        )
      })
  })

  return (
    <TwModalLayout
      title={t('title')}
      titleClassName="text-xl text-white"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      <PiSealCheck aria-hidden className="mx-auto mt-2 h-24 w-24 text-blue" />

      <Details.Root className="mt-8">
        <Details.Header
          leftElement={<TbReceipt aria-hidden />}
          rightElement={status === 'confirming' ? <Loader className="size-5 text-orange" /> : undefined}
        >
          {t('details')}
        </Details.Header>

        <Details.HeaderSeparator />

        <Details.Body>
          <Details.Panel label={t('statusLabel')}>
            <TwStepper
              className="mb-2 mt-7"
              theme="neon"
              currentState={status === 'error' ? 'error' : 'success'}
              currentStep={stepsByStatus[status]}
              steps={t('steps', { returnObjects: true })}
            />

            {errorMessage && (
              <Text className="mx-auto text-center font-sans-regular text-base text-pink">{errorMessage}</Text>
            )}
          </Details.Panel>
        </Details.Body>
      </Details.Root>

      <Details.Root className="mt-2">
        <Details.Body>
          <Details.Panel label={t('bridgeFromLabel')}>
            <Details.Item label={t('sendingAddressLabel')} textToCopy={accountToUse.address}>
              {accountToUse.address}
            </Details.Item>

            <Details.ItemSeparator />

            <Details.Item label={t('tokenLabel')}>
              <BlockchainIconWithLabel token={tokenToUse} blockchain={tokenToUse.blockchain} />
              <Text className="text-md font-sans-regular text-white">{amountToUse}</Text>
            </Details.Item>
          </Details.Panel>

          <Details.Panel label={t('bridgeToLabel')}>
            <Details.Item label={t('receivingAddressLabel')} textToCopy={addressToReceive}>
              {addressToReceive}
            </Details.Item>

            <Details.ItemSeparator />

            <Details.Item label={t('tokenLabel')}>
              <BlockchainIconWithLabel token={tokenToReceive} blockchain={tokenToReceive.blockchain} />
              <Text className="text-md font-sans-regular text-white">{amountToReceive}</Text>
            </Details.Item>
          </Details.Panel>
        </Details.Body>
      </Details.Root>

      <View className="mt-auto py-4">
        <TwButton
          label={t('helpButtonLabel')}
          variant="contained-light"
          leftElement={<MdOpenInNew aria-hidden className="text-neon" />}
          onPress={handleOpenHelpLink}
        />
      </View>
    </TwModalLayout>
  )
}
