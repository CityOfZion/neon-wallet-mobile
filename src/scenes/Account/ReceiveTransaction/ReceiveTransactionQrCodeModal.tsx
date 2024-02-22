import { Token } from '@cityofzion/blockchain-service'
import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useRef, useMemo } from 'react'
import ViewShot from 'react-native-view-shot'
import { useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { TokenIcon } from '~/src/components/TokenIcon'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { UriHelper } from '~/src/helpers/UriHelper'
import { useExchange } from '~/src/hooks/useExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
import { Wallet } from '~/src/store/wallet/Wallet'
import InputLabel from '~src/components/InputLabel'
import NeonQRCode from '~src/components/NeonQRCode'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
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

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const controller = useSwiperController(true)

  const { data: exchange } = useExchange()

  const fiat = useMemo(() => {
    const ratio = BalanceHelper.getExchangeRatio(token.hash, token.symbol, account.blockchain, exchange)

    return FilterHelper.currency(ratio ? Number(amount) * ratio : 0, currency, language)
  }, [exchange, currency, language, amount])

  const qrCodeContent = useMemo(
    () => UriHelper.generate(account.address, amount, token.hash, reference),
    [account, amount, token, reference]
  )

  const qrCodeView = useRef<ViewShot>(null)

  const captureAndNavigate = async () => {
    const uri = await qrCodeView.current?.capture?.()
    props.navigation.navigate(wrapper.route.CopyContextModal.name, {
      qrCode: uri ?? '',
      address: account.address,
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.ReceiveTransactionQrCodeModal.title')}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={() => props.navigation.goBack()}
    >
      <LinearLayout alignItems="center" flexGrow={1} flexShrink={1}>
        <ViewShot ref={qrCodeView}>
          <NeonQRCode content={qrCodeContent} />
        </ViewShot>

        <LinearLayout width="100%" my="34px">
          <ThemedButton
            label={i18n.t('modals.ReceiveTransactionQrCodeModal.shareOrCopy')}
            srcIcon={require('~src/assets/images/icon-copy-green.png')}
            iconSize={[19, 23]}
            onPress={captureAndNavigate}
          />
        </LinearLayout>

        <LinearLayout width="100%">
          <TextView fontFamily="bold" color="text.0" fontSize="14px" mb="18px" alignSelf="center">
            {i18n.t('modals.ReceiveTransactionQrCodeModal.paymentRequestDetails')}
          </TextView>

          <LinearLayout bg="background.14" p="12px" borderRadius="6px">
            <LinearLayout>
              <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.token')} lightText />

              <LinearLayout orientation="horiz" alignItems="center">
                <TokenIcon width={18} height={18} resizeMode="contain" blockchain={account.blockchain} {...token} />

                <TextView color="text.0" ml="4px" fontFamily="semibold" fontSize="18px">
                  {token.name}
                </TextView>
              </LinearLayout>
            </LinearLayout>

            <LinearLayout width="100%" orientation="horiz" mt="2px">
              <LinearLayout width="50%" paddingRight="5px">
                <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.qty')} lightText />
                <TextView color="text.0" fontFamily="semibold" fontSize="18px">
                  {amount}
                </TextView>
              </LinearLayout>

              <LinearLayout width="50%">
                <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.value')} lightText />
                <TextView color="primary" fontFamily="semibold" fontSize="18px">
                  {fiat}
                </TextView>
              </LinearLayout>
            </LinearLayout>

            <LinearLayout width="100%" orientation="horiz" mt="2px">
              <LinearLayout width="50%" paddingRight="5px">
                <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.wallet')} lightText />
                <TextView color="text.0" fontFamily="semibold" fontSize="16px" numberOfLines={1}>
                  {wallet.name}
                </TextView>
              </LinearLayout>

              <LinearLayout width="50%">
                <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.account')} lightText />
                <TextView color="text.0" fontFamily="semibold" fontSize="16px">
                  {account.name}
                </TextView>
              </LinearLayout>
            </LinearLayout>

            <LinearLayout mt="16px">
              <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.address')} lightText />

              <TextView color={theme.colors.primary} fontFamily="medium" fontSize="16px">
                {account.address}
              </TextView>
            </LinearLayout>

            {!!reference && (
              <LinearLayout width="100%" mt="16px">
                <InputLabel title={i18n.t('modals.ReceiveTransactionQrCodeModal.reference')} lightText />
                <TextView color="text.0" fontFamily="semibold" fontSize="16px">
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
