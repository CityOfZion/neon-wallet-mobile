import React, { useState } from 'react'

import { BSError } from '@cityofzion/blockchain-service'
import { Neo3NeoXBridgeOrchestrator } from '@cityofzion/bs-multichain'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import type { BSNeoX } from '@cityofzion/bs-neox'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Loader } from '@/components/Loader'
import { TwButton } from '@/components/TwButton'
import { TwDetailsCard } from '@/components/TwDetailsCard'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'
import { TwStepper } from '@/components/TwStepper'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LinkHelper } from '@/helpers/LinkHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'

import { useMount } from '@/hooks/useMount'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import TbCopy from '@/assets/images/tb-copy.svg'
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
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })

  const [status, setStatus] = useState<TStatus>('confirming')
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleCopyUseAddress = () => {
    ClipboardHelper.write(accountToUse.address)
  }

  const handleCopyReceiveAddress = () => {
    ClipboardHelper.write(addressToReceive)
  }

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

      <View className="mt-8 flex w-full flex-col rounded bg-asphalt p-3">
        <View className="flex flex-row items-center gap-x-2 pb-3">
          <TbReceipt aria-hidden className="h-5 w-5 text-blue" />

          <Text className="text-md flex-grow font-sans-medium text-white">{t('details')}</Text>

          {status === 'confirming' && <Loader className="h-5 w-5 text-orange" containerClassName="w-fit" />}
        </View>

        <TwSeparator containerClassName="mb-4" />

        <TwDetailsCard.Step label={t('statusLabel')} />

        <TwStepper
          className="mb-2 mt-7"
          theme="neon"
          currentState={status === 'error' ? 'error' : 'success'}
          currentStep={stepsByStatus[status]}
          steps={t('steps', { returnObjects: true })}
        />

        {errorMessage && <Text className="mx-auto mb-3 mt-4 w-full text-center text-sm text-pink">{errorMessage}</Text>}
      </View>

      <View className="mt-3 flex w-full flex-col rounded bg-asphalt p-3">
        <TwDetailsCard.Step label={t('bridgeFromLabel')} />

        <TwDetailsCard.Content title={t('tokenLabel')} className="py-4">
          <View className="flex flex-row items-center justify-between gap-x-2">
            <TwDetailsCard.BlockchainToken token={tokenToUse} blockchain={tokenToUse.blockchain} />

            <Text className="text-md font-sans-regular text-white">{amountToUse}</Text>
          </View>
        </TwDetailsCard.Content>

        <TwSeparator />

        <TwDetailsCard.Content title={t('sendingAddressLabel')} className="py-4">
          <View className="relative flex flex-row items-center justify-between gap-x-2">
            <Text
              className="text-md w-full max-w-44 font-sans-regular text-white"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {accountToUse.address}
            </Text>

            <TwIconButton
              aria-label={tCommonGeneral('copy')}
              size="sm"
              className="absolute -right-2 top-1/2 -translate-y-1/2"
              icon={<TbCopy aria-hidden className="text-neon" />}
              onPress={handleCopyUseAddress}
            />
          </View>
        </TwDetailsCard.Content>

        <TwDetailsCard.Step label={t('bridgeToLabel')} />

        <TwDetailsCard.Content title={t('tokenLabel')} className="py-4">
          <View className="flex flex-row items-center justify-between gap-x-2">
            <TwDetailsCard.BlockchainToken token={tokenToReceive} blockchain={tokenToReceive.blockchain} />

            <Text className="text-md font-sans-regular text-white">{amountToReceive}</Text>
          </View>
        </TwDetailsCard.Content>

        <TwSeparator />

        <TwDetailsCard.Content title={t('receivingAddressLabel')} className="pb-1 pt-4">
          <View className="relative flex flex-row items-center justify-between">
            <Text
              className="text-md w-full max-w-44 font-sans-regular text-white"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {addressToReceive}
            </Text>

            <TwIconButton
              aria-label={tCommonGeneral('copy')}
              size="sm"
              className="absolute -right-2 top-1/2 -translate-y-1/2"
              icon={<TbCopy aria-hidden className="text-neon" />}
              onPress={handleCopyReceiveAddress}
            />
          </View>
        </TwDetailsCard.Content>
      </View>

      <TwButton
        label={t('helpButtonLabel')}
        variant="contained-light"
        className="mx-4 mb-14 mt-8"
        leftElement={<MdOpenInNew aria-hidden className="text-neon" />}
        onPress={handleOpenHelpLink}
      />
    </TwModalLayout>
  )
}
