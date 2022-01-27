import {RouteProp, useNavigationState} from '@react-navigation/native'
import i18n from 'i18n-js'
import React, {useState, useRef, useEffect} from 'react'
import ViewShot from 'react-native-view-shot'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Await, AwaitActivity} from '~/node_modules/@simpli/react-native-await'
import {wrapper} from '~/src/app/ApplicationWrapper'
import {Normalize} from '~/src/app/Normalize'
import {applicationConfig} from '~/src/config/ApplicationConfig'
import {FilterHelper} from '~/src/helpers/FilterHelper'
import {UriHelper} from '~/src/helpers/UriHelper'
import {UtilsHelper} from '~/src/helpers/UtilsHelper'
import InputLabel from '~src/components/InputLabel'
import NeonQRCode from '~src/components/QRCode'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import {Loader} from '~src/components/loader/loader'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface ReceiveQrCodeModalParams {
  wallet: Wallet
  account: Account
  amount: number
  token: TokenAsset
  reference?: string
}

export interface ReceiveQrCodeProps {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ReceiveQrCodeModal'>
}

const buttonWidth = applicationConfig.screenWidth - 76

const ReceiveQrCodeModal = (props: ReceiveQrCodeProps) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const {currency} = useSelector((state: RootState) => state.settings)
  const {exchange} = useSelector((state: RootState) => state.app)
  const controller = useSwiperController(true)
  const [showQr, setShowQr] = useState(false)

  const {wallet, account, amount, token, reference} = props.route.params
  const ratio = exchange[account.blockchain][token.symbol]?.to[currency] ?? 0
  const value = FilterHelper.currency(amount * ratio, currency)
  const labelWeight = 1.5

  const qrCodeContent = UriHelper.generate(
    account.address ?? '',
    amount,
    token,
    reference
  )

  const qrCodeView = useRef<ViewShot>(null)
  const captureAndNavigate = async () => {
    const uri = await qrCodeView.current?.capture?.()
    props.navigation.navigate(wrapper.route.CopyContextModal.name, {
      qrCode: uri ?? '',
      address: account.address ?? '',
    })
  }

  const renderQr = async () => {
    await UtilsHelper.sleep(1000)
    setShowQr(true)
  }

  useEffect(() => {
    Await.run('renderQr', renderQr)
  }, [])
  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('routes.ReceiveQrCode')}
      rightButton={<ThemedCloseButton />}
      onRightPress={controller.close}
      onClose={() => props.navigation.goBack()}
      solidColorBG={true}
      smallerSize={true}
    >
      <LinearLayout mt="43px" height="100%" alignItems="center">
        <AwaitActivity name={'renderQr'} loadingView={<Loader />}>
          {showQr ? (
            <LinearLayout width={buttonWidth} height={buttonWidth}>
              <ViewShot ref={qrCodeView}>
                <NeonQRCode content={qrCodeContent} qrCodeWidth={buttonWidth} />
              </ViewShot>
            </LinearLayout>
          ) : undefined}
        </AwaitActivity>
        <LinearLayout width={buttonWidth} height={54} mt={34}>
          <ThemedButton
            label={i18n.t('receive.shareOrCopy')}
            srcIcon={require('~src/assets/images/icon-copy-green.png')}
            iconSize={[19, 23]}
            onPress={captureAndNavigate}
          />
        </LinearLayout>

        <LinearLayout
          width="99%"
          mt={22}
          flex={1}
          flexWrap="wrap"
          minHeight={400}
        >
          <LinearLayout orientation="horiz">
            <LinearLayout weight={labelWeight} />
            <TextView
              weight={5}
              fontFamily="bold"
              color="white"
              fontSize={14}
              mb={18}
              style={{includeFontPadding: false}}
            >
              {i18n.t('receive.paymentRequestDetails')}
            </TextView>
          </LinearLayout>
          <LinearLayout
            bg={'background.14'}
            pb={'12px'}
            pr={'10px'}
            mt={'4px'}
            borderRadius={'7px'}
            pl={'10px'}
            pt={'13px'}
          >
            <LinearLayout width="100%" mb={14}>
              <InputLabel
                title={i18n.t('receive.token')}
                weight={labelWeight}
                lightText={true}
              />

              <LinearLayout orientation="horiz" weight={5}>
                <ImageView
                  mt={3}
                  width={Normalize.scale(18)}
                  height={Normalize.scale(18)}
                  resizeMode={'contain'}
                  alginSelf={'center'}
                  source={token.srcIcon}
                />
                <TextView
                  color="white"
                  ml={2}
                  mt={2}
                  fontFamily="semibold"
                  fontSize={18}
                  style={{includeFontPadding: false}}
                >
                  {token.name}
                </TextView>
              </LinearLayout>
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%">
              <InputLabel
                title={i18n.t('receive.qty')}
                weight={labelWeight}
                lightText={true}
              />

              <InputLabel
                title={i18n.t('receive.value')}
                weight={labelWeight}
                lightText={true}
              />
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%" mb={16}>
              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={18}
                weight={5}
              >
                {amount}
              </TextView>

              <TextView
                color="primary"
                fontFamily="semibold"
                fontSize={18}
                weight={5}
              >
                {value}
              </TextView>
            </LinearLayout>

            <LinearLayout orientation="horiz" width="100%">
              <InputLabel
                title={i18n.t('receive.wallet')}
                weight={labelWeight}
                lightText={true}
              />

              <InputLabel
                title={i18n.t('receive.account')}
                weight={labelWeight}
                lightText={true}
              />
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%" mb={16}>
              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={16}
                weight={5}
                mr={5}
                style={{includeFontPadding: false}}
              >
                {wallet.name}
              </TextView>

              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={16}
                weight={5}
                mr={5}
                style={{includeFontPadding: false}}
              >
                {account.name}
              </TextView>
            </LinearLayout>
            <LinearLayout width="100%" mb={16}>
              <InputLabel
                title={i18n.t('receive.address')}
                weight={labelWeight}
                lightText={true}
              />

              <TextView
                color={theme.colors.primary}
                fontFamily="medium"
                fontSize={16}
                weight={5}
                style={{includeFontPadding: false}}
                mr={1}
              >
                {account.address}
              </TextView>
            </LinearLayout>
            <LinearLayout width="100%" mb={16}>
              <InputLabel
                title={i18n.t('receive.reference')}
                weight={labelWeight}
                lightText={true}
              />
              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={16}
                weight={5}
                mr={1}
                style={{includeFontPadding: false}}
              >
                {reference}
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}
export default ReceiveQrCodeModal
