import React, { Fragment, useMemo } from 'react'

import type { TSwapResult } from '@cityofzion/bs-multichain'
import { useNavigation } from '@react-navigation/native'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { Loader } from '@/components/Loader'
import { TwAccordion } from '@/components/TwAccordion'
import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwSeparator } from '@/components/TwSeparator'
import { TwStepper } from '@/components/TwStepper'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { CrispHelper } from '@/helpers/CrispHelper'
import { LinkHelper } from '@/helpers/LinkHelper'

import { useContactsSelector } from '@/hooks/useContactSelector'
import { PENDING_SWAP_STATUSES, useSwapOrderQuery } from '@/hooks/useSwapOrderQuery'

import { ModalLayout } from '@/layouts/ModalLayout'

import { SwapDetailsTokenItem } from '@/routes/modals/SwapDetailsModal/SwapDetailsTokenItem'

import FaRotateRight from '@/assets/images/fa6-rotate-right.svg'
import MdOpenInNew from '@/assets/images/md-open-in-new.svg'
import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import PiXCircle from '@/assets/images/pi-x-circle.svg'
import TbCopy from '@/assets/images/tb-copy.svg'
import TbAlertTriangleFilled from '@/assets/images/tb-filled-alert-triangle.svg'
import TbMessage from '@/assets/images/tb-message.svg'
import TbReceipt from '@/assets/images/tb-receipt.svg'
import TbUsers from '@/assets/images/tb-users.svg'

import { SwapDetailsModalLinkButton } from './SwapDetailsModalLinkButton'

import type { TRootStackScreenProps } from '@/types/stacks'
import type { TContactAddress } from '@/types/store'

type Status = TSwapResult['status']

const BAD_STATUS: Status[] = ['failed', 'refunded']

const MIDDLE_STEP = 2

const STEPS_BY_STATUS: Record<Status, number> = {
  confirming: MIDDLE_STEP,
  exchanging: 3,
  finished: 4,
  failed: MIDDLE_STEP,
  refunded: MIDDLE_STEP,
}

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

type TContentProps = {
  orderId: string
  swapResult: TSwapResult
}

const SwapDetailsModalContent = ({ orderId, swapResult }: TContentProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetails' })
  const { t: tCommon } = useTranslation('common')
  const navigation = useNavigation()
  const { contacts } = useContactsSelector()

  const {
    status,
    txIdFrom: txFrom,
    tokenFrom,
    txIdTo: txTo,
    tokenTo,
    addressFrom,
    addressTo,
    extraIdTo,
    fee,
  } = swapResult

  const blockchain = tokenFrom.blockchain!

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
  const isProcessingStatus = PENDING_SWAP_STATUSES.includes(status)
  const isBadStatus = BAD_STATUS.includes(status) || (!txFrom && !isProcessingStatus)

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

  const handleLiveSupport = () => {
    CrispHelper.show()
  }

  const handleGoToSwapLog = () => {
    navigation.navigate('SwapDetailsLogModal', { orderId })
  }

  return (
    <Fragment>
      {isBadStatus ? (
        <View className="items-center gap-2 px-4">
          <PiXCircle className="size-28 text-pink min-size-28 max-size-28" aria-hidden />

          <Text className="text-center font-sans-regular text-gray-100">
            {t('errors.initialPart')} {txFrom ? t('errors.swap') : t('errors.transfer')}
          </Text>

          {status === 'refunded' && <Text className="font-sans-medium text-lg text-white">{t('errors.refunded')}</Text>}
        </View>
      ) : (
        <PiSealCheck className="size-28 text-blue min-size-28 max-size-28" aria-hidden />
      )}

      <View className="mt-8 w-full gap-2 rounded bg-asphalt p-2 py-3">
        <View className="flex-row items-center gap-1">
          <TbReceipt className="size-5 text-blue min-size-5 max-size-5" aria-hidden />
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
          currentStep={isBadStatus ? MIDDLE_STEP : STEPS_BY_STATUS[status]}
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
                        <TwBlockchainIcon
                          blockchain={tokenFrom.blockchain}
                          className="size-4 text-gray-300 min-size-4 max-size-4"
                        />
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
                        aria-label={tCommon('general.copy')}
                        icon={<TbCopy aria-hidden className="text-neon" />}
                        className="p-0"
                      />
                    </Fragment>
                  ) : isProcessingStatus ? (
                    <Fragment>
                      <Text className="font-sans-medium text-orange">{t('pending')}</Text>

                      <FaRotateRight aria-hidden className="size-4 text-orange min-size-4 max-size-4" />
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
                      {tokenTo.blockchain && (
                        <TwBlockchainIcon
                          blockchain={tokenTo.blockchain}
                          className="size-4 text-gray-300 min-size-4 max-size-4"
                        />
                      )}
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
                        onPress={() => ClipboardHelper.write(txTo)}
                        aria-label={tCommon('general.copy')}
                        icon={<TbCopy aria-hidden className="text-neon" />}
                        className="p-0"
                      />
                    </View>
                  ))
                  .with({ isProcessingStatus: true }, () => (
                    <View className="flex-row items-center gap-2">
                      <Text className="font-sans-medium text-orange">{t('pending')}</Text>

                      <FaRotateRight aria-hidden className="size-4 text-orange min-size-4 max-size-4" />
                    </View>
                  ))
                  .with({ isBadStatus: true }, () => (
                    <View className="flex-row items-center gap-2">
                      <Text className="font-sans-medium text-pink">{t('failed')}</Text>

                      <TbAlertTriangleFilled aria-hidden className="size-4 text-pink min-size-4 max-size-4" />
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
              amount={swapResult.amountFrom}
              decimals={tokenFrom.decimals}
            />
          </SmallContent>

          <TwSeparator />

          <SmallContent title={t('sendingAddress')}>
            {tokenFrom.addressTemplateUrl ? (
              <SwapDetailsModalLinkButton
                label={addressFrom}
                onPress={LinkHelper.open.bind(null, tokenFrom.addressTemplateUrl.replace('{address}', addressFrom))}
              />
            ) : (
              <Text
                className="max-w-[80%] font-sans-regular text-lg text-white"
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {addressFrom}
              </Text>
            )}
          </SmallContent>

          <HeaderTitle title={t('titles.to')} />

          <SmallContent title={t('token')}>
            <SwapDetailsTokenItem
              symbol={tokenTo.symbol}
              blockchain={tokenTo.blockchain}
              amount={swapResult.amountTo}
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
                  <TbUsers aria-hidden className="size-4 text-neon min-size-4 max-size-4" />
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
        leftElement={<TbMessage aria-hidden className="text-neon" />}
        onPress={handleLiveSupport}
      />
    </Fragment>
  )
}

export const SwapDetailsModal = ({ route }: TRootStackScreenProps<'SwapDetailsModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetails' })
  const { orderId } = route.params

  const swapOrderQuery = useSwapOrderQuery(orderId)

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent contentContainerClassName="items-center pt-2">
        {match(swapOrderQuery)
          .with({ isLoading: true }, () => <Loader className="mt-10" />)
          .with({ data: P.nonNullable }, ({ data }) => <SwapDetailsModalContent orderId={orderId} swapResult={data} />)
          .otherwise(() => (
            <Text className="mt-10 w-full text-center font-sans-medium text-lg text-gray-300">{t('notFound')}</Text>
          ))}
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
