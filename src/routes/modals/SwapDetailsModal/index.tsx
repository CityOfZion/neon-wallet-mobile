import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import type { TSwapServiceStatusResponse } from '@cityofzion/blockchain-service'
import { SimpleSwapService } from '@cityofzion/bs-multichain'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { TwAccordion } from '@/components/TwAccordion'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'
import { TwStepper } from '@/components/TwStepper'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LinkHelper } from '@/helpers/LinkHelper'

import { useContactsSelector } from '@/hooks/useContactSelector'
import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import { SwapDetailsTokenItem } from '@/routes/modals/SwapDetailsModal/SwapDetailsTokenItem'

import FaRotateRight from '@/assets/images/fa6-rotate-right.svg'
import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import PiXCircle from '@/assets/images/pi-x-circle.svg'
import TbCopy from '@/assets/images/tb-copy.svg'
import TbAlertTriangleFilled from '@/assets/images/tb-filled-alert-triangle.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'
import TbUsers from '@/assets/images/tb-users.svg'

import { SwapDetailsModalLinkButton } from './SwapDetailsModalLinkButton'

import { utilityReducerActions } from '@/store/reducers/utility'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TContactAddress } from '@/types/store'

type Status = TSwapServiceStatusResponse['status']

const processingStatus: Status[] = ['confirming', 'exchanging']
const badStatus: Status[] = ['failed', 'refunded']

const MIDDLE_STEP = 2

const stepsByStatus: Record<Status, number> = {
  confirming: MIDDLE_STEP,
  exchanging: 3,
  finished: 4,
  failed: MIDDLE_STEP,
  refunded: MIDDLE_STEP,
}

const swapService = new SimpleSwapService()

type THeaderTitleProps = {
  title: string
}

const HeaderTitle = ({ title }: THeaderTitleProps) => (
  <Text className="bg-gray-700/60 px-2 py-1 font-sans-medium text-blue">{title}</Text>
)

type TSmallContentProps = {
  title: string
  children: ReactNode
}

const SmallContent = ({ title, children }: TSmallContentProps) => (
  <View className="gap-2 p-2">
    <Text className="font-sans-medium text-sm uppercase text-gray-100">{title}</Text>
    {children}
  </View>
)

export const SwapDetailsModal = ({ navigation, route }: TRootStackScreenProps<'SwapDetailsModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetailsModal' })
  const dispatch = useAppDispatch()
  const { contacts } = useContactsSelector()
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)
  const [swapRecord, setSwapRecord] = useState(route.params.swapRecord)

  const {
    swapStatus: status,
    swapId,
    txFrom,
    tokenFrom,
    txTo,
    tokenTo,
    addressTo,
    extraIdTo,
    fee,
    account: { blockchain },
  } = swapRecord

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const isProcessingStatus = processingStatus.includes(status)
  const isBadStatus = badStatus.includes(status) || !txFrom

  const contactAddress = useMemo(
    () =>
      contacts
        .flatMap(({ addresses }) => addresses)
        .find(
          (contactAddress: TContactAddress) =>
            contactAddress.blockchain === tokenTo.blockchain && contactAddress.address === addressTo
        ),
    [contacts, tokenTo, addressTo]
  )

  const handleGoToCreateContact = () => {
    if (contactAddress || !tokenTo.blockchain) return

    navigation.navigate('PersistContactModal', {
      addresses: [{ blockchain: tokenTo.blockchain, address: addressTo }],
    })
  }

  const handleGoToSwapLog = () => {
    navigation.navigate('SwapDetailsLogModal', { swapRecord })
  }

  const watchSwapRecord = async () => {
    if (!isProcessingStatus || !swapId) return

    const response = await swapService.getStatus(swapId)
    const { status, log } = response
    let { txFrom, txTo } = response

    if (!txFrom) txFrom = swapRecord.txFrom
    if (!txTo) txTo = swapRecord.txTo

    const newSwapRecord = { ...swapRecord, txFrom, txTo, swapStatus: status, log }

    setSwapRecord(newSwapRecord)
    dispatch(utilityReducerActions.saveSwapRecord(newSwapRecord))

    if (status === 'finished') {
      clearTimeout(timeoutRef.current)
      return
    }

    timeoutRef.current = setTimeout(watchSwapRecord, 4000)
  }

  useEffect(() => {
    timeoutRef.current = setTimeout(watchSwapRecord, 100)

    return () => {
      clearTimeout(timeoutRef.current)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TwModalLayout
      title={t('title')}
      contentContainerClassName="items-center pt-2"
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      {isBadStatus ? (
        <View className="items-center gap-2 px-4">
          <PiXCircle className="h-28 w-28 text-pink" aria-hidden />

          <Text className="text-center font-sans-regular text-gray-100">
            {t('errors.initialPart')} {txFrom ? t('errors.swap') : t('errors.transfer')}
          </Text>

          {status === 'refunded' && <Text className="font-sans-medium text-lg text-white">{t('errors.refunded')}</Text>}
        </View>
      ) : (
        <PiSealCheck className="h-28 w-28 text-blue" aria-hidden />
      )}

      <View className="mt-8 w-full gap-2 rounded bg-asphalt p-2 py-3">
        <View className="flex-row items-center gap-1">
          <TbReceipt className="h-5 w-5 text-blue" aria-hidden />
          <Text className="font-sans-regular text-lg text-white">{t('details')}</Text>
        </View>

        <TwSeparator />

        {isProcessingStatus && (
          <Text className="my-1 text-center font-sans-bold uppercase text-orange">{t('processingInfo')}</Text>
        )}

        <HeaderTitle title={t('titles.status')} />

        <TwStepper
          className="my-4 px-4"
          theme="neon"
          currentState={isBadStatus ? 'error' : 'success'}
          currentStep={isBadStatus ? MIDDLE_STEP : stepsByStatus[status]}
          steps={t('steps', { returnObjects: true })}
        />

        <TwAccordion.Root defaultValue>
          <TwAccordion.Trigger
            label={t('titles.routing')}
            className="bg-gray-100 px-2 py-1"
            iconClassName="text-asphalt"
          />

          <TwAccordion.Content>
            <View className="my-1 gap-2">
              <SmallContent title={t('transactionFrom')}>
                <View className="flex-row items-center gap-2">
                  {txFrom ? (
                    <Fragment>
                      {tokenFrom.blockchain && (
                        <TwBlockchainIcon blockchain={tokenFrom.blockchain} type="gray" className="h-3 w-3" />
                      )}
                      {tokenFrom.txTemplateUrl ? (
                        <SwapDetailsModalLinkButton
                          label={txFrom}
                          onPress={LinkHelper.open.bind(null, tokenFrom.txTemplateUrl.replace('{txId}', txFrom))}
                        />
                      ) : (
                        <Text
                          className="max-w-[80%] font-sans-regular text-lg text-white"
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {txFrom}
                        </Text>
                      )}
                      <TwIconButton
                        onPress={() => ClipboardHelper.write(txFrom)}
                        icon={<TbCopy aria-hidden className="text-neon" />}
                        className="p-0"
                      />
                    </Fragment>
                  ) : (
                    <Text className="font-sans-regular text-white">{t('unknownTransactionFrom')}</Text>
                  )}
                </View>
              </SmallContent>

              <TwSeparator />

              <SmallContent title={t('transactionTo')}>
                {match({ txTo, isProcessingStatus, isBadStatus })
                  .with({ txTo: P.string.minLength(1) }, ({ txTo }) => (
                    <View className="flex-row items-center gap-2">
                      <TwBlockchainIcon blockchain={blockchain} type="gray" className="h-3 w-3" />
                      {tokenTo.txTemplateUrl ? (
                        <SwapDetailsModalLinkButton
                          label={txTo}
                          onPress={LinkHelper.open.bind(null, tokenTo.txTemplateUrl.replace('{txId}', txTo))}
                        />
                      ) : (
                        <Text
                          className="max-w-[80%] font-sans-regular text-lg text-white"
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {txTo}
                        </Text>
                      )}
                      <TwIconButton
                        onPress={() => ClipboardHelper.write(txFrom)}
                        icon={<TbCopy aria-hidden className="text-neon" />}
                        className="p-0"
                      />
                    </View>
                  ))
                  .with({ isProcessingStatus: true }, () => (
                    <View className="flex-row items-center gap-2">
                      <Text className="font-sans-medium text-orange">{t('pending')}</Text>

                      <FaRotateRight aria-hidden className="h-4 w-4 text-orange" />
                    </View>
                  ))
                  .with({ isBadStatus: true }, () => (
                    <View className="flex-row items-center gap-2">
                      <Text className="font-sans-medium text-pink">{t('failed')}</Text>

                      <TbAlertTriangleFilled aria-hidden className="h-4 w-4 text-pink" />
                    </View>
                  ))
                  .otherwise(() => (
                    <Text className="font-sans-regular text-white">{t('unknownTransactionTo')}</Text>
                  ))}
              </SmallContent>

              {fee && (
                <Fragment>
                  <TwSeparator />

                  <SmallContent title={t('transactionFee')}>
                    <SwapDetailsTokenItem
                      symbol={service.feeToken.symbol}
                      blockchain={blockchain}
                      amount={fee}
                      decimals={service.feeToken.decimals}
                    />
                  </SmallContent>
                </Fragment>
              )}
            </View>
          </TwAccordion.Content>
        </TwAccordion.Root>
      </View>

      {!isBadStatus && (
        <View className="mt-2 w-full gap-2 rounded bg-asphalt p-2 py-3">
          <HeaderTitle title={t('titles.from')} />

          <SmallContent title={t('token')}>
            <SwapDetailsTokenItem
              symbol={tokenFrom.symbol}
              blockchain={tokenFrom.blockchain}
              amount={swapRecord.amountFrom}
              decimals={tokenFrom.decimals}
            />
          </SmallContent>

          <TwSeparator />

          <SmallContent title={t('sendingAddress')}>
            {tokenFrom.addressTemplateUrl ? (
              <SwapDetailsModalLinkButton
                label={swapRecord.account.address}
                onPress={LinkHelper.open.bind(
                  null,
                  tokenFrom.addressTemplateUrl.replace('{address}', swapRecord.account.address)
                )}
              />
            ) : (
              <Text
                className="max-w-[80%] font-sans-regular text-lg text-white"
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {swapRecord.account.address}
              </Text>
            )}
          </SmallContent>

          <HeaderTitle title={t('titles.to')} />

          <SmallContent title={t('token')}>
            <SwapDetailsTokenItem
              symbol={tokenTo.symbol}
              blockchain={tokenTo.blockchain}
              amount={swapRecord.amountTo}
              decimals={tokenTo.decimals}
            />
          </SmallContent>

          <TwSeparator />

          <SmallContent title={t('receivingAddress')}>
            {tokenTo.addressTemplateUrl ? (
              <SwapDetailsModalLinkButton
                label={addressTo}
                onPress={LinkHelper.open.bind(null, tokenTo.addressTemplateUrl.replace('{address}', addressTo))}
              />
            ) : (
              <Text
                className="max-w-[80%] font-sans-regular text-lg text-white"
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {addressTo}
              </Text>
            )}
          </SmallContent>

          {!contactAddress && tokenTo.blockchain && (
            <View className="p-2">
              <TouchableOpacity onPress={handleGoToCreateContact} activeOpacity={0.6}>
                <View className="flex-row items-center gap-2">
                  <TbUsers aria-hidden className="h-4 w-4 text-neon" />
                  <Text className="font-sans-medium text-neon">{t('saveContact')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {extraIdTo && (
            <Fragment>
              <TwSeparator />

              <SmallContent title={t('extraIdToReceive')}>
                <Text className="font-sans-regular text-white">{extraIdTo}</Text>
              </SmallContent>
            </Fragment>
          )}
        </View>
      )}

      <TwButton
        label={t('log')}
        variant="text"
        className="mt-4"
        leftElement={<MdOpenInNew aria-hidden className="text-neon" />}
        onPress={handleGoToSwapLog}
      />

      <TwButton
        label={t('help')}
        variant="contained-light"
        className="mt-4"
        leftElement={<MdOpenInNew aria-hidden className="text-neon" />}
        onPress={() => LinkHelper.open(ConstantsHelper.cozDiscordUrl)}
      />
    </TwModalLayout>
  )
}
