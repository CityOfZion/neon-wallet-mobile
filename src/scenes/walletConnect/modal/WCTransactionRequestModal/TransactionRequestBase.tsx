import { useNavigation } from '@react-navigation/native'
import { SessionTypes } from '@walletconnect/types'
import i18n from 'i18n-js'
import React, { useRef, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import ConnectionHeader from '../../components/ConnectionHeader'

import SwiperPanel, { CloseButton, useSwiperController } from '~/src/components/SwiperPanel'
import ThemedButton from '~/src/components/themed/ThemedButton'
import { SessionRequest, useWalletConnect } from '~/src/contexts/WalletConnectContext'
import { Account } from '~/src/models/redux/Account'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

type SuccessOrFailedValues = {
  type: 'success' | 'failed'
  value: string
}

export type TransactionRequestFailedElementProps = {
  errorMessage: string
}

export type TransactionRequestSuccessElementProps = {
  account: Account
  transactionId: string
}

type Props = {
  onReject?: () => Promise<void>
  onAccept?: (transactionId: string) => Promise<void>
  failedElement: React.FC<TransactionRequestFailedElementProps>
  successElement: React.FC<TransactionRequestSuccessElementProps>
  hideDappName: boolean
  title: string
  acceptButtonLabel: string
  rejectButtonLabel: string
  request: SessionRequest
  session: SessionTypes.Struct
  account: Account
  children?: React.ReactNode
}

export const TransactionRequestBase = ({
  hideDappName,
  title,
  onAccept,
  onReject,
  acceptButtonLabel,
  rejectButtonLabel,
  failedElement: FailedElement,
  successElement: SuccessElement,
  children,
  request,
  session,
  account,
}: Props) => {
  const controller = useSwiperController(true)
  const { approveRequest, rejectRequest } = useWalletConnect()
  const navigation = useNavigation()

  const [buttonsIsDisabled, setButtonsIsDisabled] = useState<boolean>(false)
  const [successOrFailedValues, setSuccessOrFailedValues] = useState<SuccessOrFailedValues>()

  const shouldProcessButtons = useRef<boolean>(true)

  async function handleSwiperOnClose() {
    try {
      if (!shouldProcessButtons) {
        return
      }

      shouldProcessButtons.current = false
      setButtonsIsDisabled(true)

      await rejectRequest(request)

      if (onReject) {
        onReject()
      }
    } finally {
      navigation.goBack()
    }
  }

  async function handlePressAcceptButton() {
    try {
      if (!shouldProcessButtons) {
        return
      }

      shouldProcessButtons.current = false
      setButtonsIsDisabled(true)

      const response = await approveRequest(request)

      if (!response || !('result' in response)) {
        throw new Error(i18n.t('modals.WCTransactionRequestModal.unexpectedError'))
      }

      const { result: transactionId } = response

      if (onAccept) {
        onAccept(transactionId)
      }

      setSuccessOrFailedValues({
        type: 'success',
        value: transactionId,
      })
    } catch (error: any) {
      console.log(error)
      setSuccessOrFailedValues({
        type: 'failed',
        value: error.message,
      })
    }
  }

  function handlePressRejectButton() {
    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      padding={20}
      fullSize
      title={i18n.t('modals.transactionRequest.title')}
      rightButton={<CloseButton mr="20px" />}
      onRightPress={controller.close}
      onClose={handleSwiperOnClose}
      solidColorBG
    >
      <LinearLayout orientation="verti" mr={2} ml={2} mt={5} mb={5}>
        {successOrFailedValues ? (
          successOrFailedValues.type === 'success' ? (
            <SuccessElement account={account} transactionId={successOrFailedValues.value} />
          ) : (
            <FailedElement errorMessage={successOrFailedValues.value} />
          )
        ) : (
          <LinearLayout height="100%" justifyContent="space-between">
            <LinearLayout>
              <ConnectionHeader title={session.peer.metadata.name} imageUri="" hideTitle={hideDappName} />
              <TextView
                mt="2%"
                mr="20px"
                ml="20px"
                mb="31px"
                color="white"
                fontSize="18px"
                alignSelf="center"
                textAlign="center"
              >
                {title}
              </TextView>

              {children}
            </LinearLayout>
            <LinearLayout>
              <ThemedButton label={acceptButtonLabel} disabled={buttonsIsDisabled} onPress={handlePressAcceptButton} />
              <LinearLayout mt="24px">
                <TouchableWithoutFeedback onPress={handlePressRejectButton} disabled={buttonsIsDisabled}>
                  <LinearLayout
                    width="100%"
                    borderRadius="4px"
                    borderWidth="1px"
                    borderColor="primary"
                    justifyContent="center"
                    alignItems="center"
                    orientation="horiz"
                    p="10px"
                    opacity={buttonsIsDisabled ? '0.3' : '1'}
                  >
                    <TextView style={{ includeFontPadding: false }} ml={3} color="primary" fontSize={20}>
                      {rejectButtonLabel}
                    </TextView>
                  </LinearLayout>
                </TouchableWithoutFeedback>
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        )}
      </LinearLayout>
    </SwiperPanel>
  )
}
