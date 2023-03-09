import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useRef, useMemo } from 'react'
import ViewShot from 'react-native-view-shot'
import { useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { TokenIcon } from '~/src/components/TokenIcon'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { UriHelper } from '~/src/helpers/UriHelper'
import { useExchange } from '~/src/hooks/useExchange'
import { Token } from '~/src/models/Token'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { RootState } from '~/src/store/RootStore'
import InputLabel from '~src/components/InputLabel'
import NeonQRCode from '~src/components/NeonQRCode'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface ReceiveTransactionQrCodeModalParams {
  wallet: Wallet
  account: Account
  amount: string
  token: Token
  reference?: string
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ReceiveTransactionQrCodeModal'>
}

const ReceiveTransactionQrCodeModal = (props: Props) => {
  const { wallet, account, amount, token, reference } = props.route.params

  const buttonWidth = applicationConfig.screenWidth - 76
  const labelWeight = 1.5

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const controller = useSwiperController(true)

  const { data: exchange } = useExchange()

  const fiat = useMemo(() => {
    const ratio = BalanceHelper.getExchangeRatio(token.symbol, token.blockchain, exchange)

    return FilterHelper.currency(ratio ? Number(amount) * ratio : 0, currency, language)
  }, [exchange, currency, language, amount])

  const qrCodeContent = useMemo(
    () => UriHelper.generate(account.address ?? '', amount, token.hash, reference),
    [account, amount, token, reference]
  )

  const qrCodeView = useRef<ViewShot>(null)

  const captureAndNavigate = async () => {
    const uri = await qrCodeView.current?.capture?.()
    props.navigation.navigate(wrapper.route.CopyContextModal.name, {
      qrCode: uri ?? '',
      address: account.address ?? '',
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.ReceiveTransactionQrCodeModal.title')}
      rightButton={<ThemedCloseButton />}
      onRightPress={controller.close}
      onClose={() => props.navigation.goBack()}
      solidColorBG
      smallerSize
    >
      <LinearLayout mt="43px" height="100%" alignItems="center">
        <LinearLayout width={buttonWidth} height={buttonWidth}>
          <ViewShot ref={qrCodeView}>
            <NeonQRCode content={qrCodeContent} size={buttonWidth} />
          </ViewShot>
        </LinearLayout>

        <LinearLayout width={buttonWidth} height={54} mt={34}>
          <ThemedButton
            label={i18n.t('modals.ReceiveTransactionQrCodeModal.shareOrCopy')}
            srcIcon={require('~src/assets/images/icon-copy-green.png')}
            iconSize={[19, 23]}
            onPress={captureAndNavigate}
          />
        </LinearLayout>

        <LinearLayout width="99%" mt={22} flex={1} flexWrap="wrap" minHeight={400}>
          <LinearLayout orientation="horiz">
            <LinearLayout weight={labelWeight} />
            <TextView
              weight={5}
              fontFamily="bold"
              color="white"
              fontSize={14}
              mb={18}
              style={{ includeFontPadding: false }}
            >
              {i18n.t('modals.ReceiveTransactionQrCodeModal.paymentRequestDetails')}
            </TextView>
          </LinearLayout>
          <LinearLayout bg="background.14" pb="12px" pr="10px" mt="4px" borderRadius="7px" pl="10px" pt="13px">
            <LinearLayout width="100%" mb={14}>
              <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.token')} weight={labelWeight} lightText />

              <LinearLayout orientation="horiz" weight={5}>
                <TokenIcon marginTop={4} width={18} height={18} resizeMode="contain" {...token} />

                <TextView
                  color="white"
                  ml={2}
                  mt={2}
                  fontFamily="semibold"
                  fontSize={18}
                  style={{ includeFontPadding: false }}
                >
                  {token.name}
                </TextView>
              </LinearLayout>
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%">
              <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.qty')} weight={labelWeight} lightText />

              <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.value')} weight={labelWeight} lightText />
            </LinearLayout>
            <LinearLayout orientation="horiz">
              <TextView color="white" fontFamily="semibold" fontSize={18} weight={5}>
                {amount}
              </TextView>

              <TextView color="primary" fontFamily="semibold" fontSize={18} weight={5}>
                {fiat}
              </TextView>
            </LinearLayout>

            <LinearLayout orientation="horiz" width="100%">
              <InputLabel
                title={i18n.t('modals.ReceiveTransactionQrCodeModal.wallet')}
                weight={labelWeight}
                lightText
              />

              <InputLabel
                title={i18n.t('modals.ReceiveTransactionQrCodeModal.account')}
                weight={labelWeight}
                lightText
              />
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%" mb={16}>
              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={16}
                weight={5}
                mr={5}
                style={{ includeFontPadding: false }}
              >
                {wallet.name}
              </TextView>

              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={16}
                weight={5}
                mr={5}
                style={{ includeFontPadding: false }}
              >
                {account.name}
              </TextView>
            </LinearLayout>
            <LinearLayout width="100%" mb={16}>
              <InputLabel
                title={i18n.t('modals.ReceiveTransactionQrCodeModal.address')}
                weight={labelWeight}
                lightText
              />

              <TextView
                color={theme.colors.primary}
                fontFamily="medium"
                fontSize={16}
                weight={5}
                style={{ includeFontPadding: false }}
                mr={1}
              >
                {account.address}
              </TextView>
            </LinearLayout>
            {!!reference && (
              <LinearLayout width="100%" mb={16}>
                <InputLabel
                  title={i18n.t('modals.ReceiveTransactionQrCodeModal.reference')}
                  weight={labelWeight}
                  lightText
                />
                <TextView
                  color="white"
                  fontFamily="semibold"
                  fontSize={16}
                  weight={5}
                  mr={1}
                  style={{ includeFontPadding: false }}
                >
                  {reference}
                </TextView>
              </LinearLayout>
            )}
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}
export default ReceiveTransactionQrCodeModal
