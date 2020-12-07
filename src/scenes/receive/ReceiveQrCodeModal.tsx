import {RouteProp, useNavigationState} from '@react-navigation/native'
import {useHeaderHeight} from '@react-navigation/stack'
import React, {useState, useRef} from 'react'
import {ScrollView} from 'react-native'
import ViewShot from 'react-native-view-shot'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {AwaitActivity} from '~/node_modules/@simpli/react-native-await'
import {ReceiveModalStackParamList} from '~/src/navigation/ReceiveModalStackNavigation'
import {Facade} from '~src/app/Facade'
import InputLabel from '~src/components/InputLabel'
import NeonQRCode from '~src/components/QRCode'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
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
  route: RouteProp<ReceiveModalStackParamList, 'ReceiveQrCodeModal'>
}

const buttonWidth = Facade.app.screenWidth - 76

const ReceiveQrCodeModal = (props: ReceiveQrCodeProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const {currency} = useSelector((state: RootState) => state.settings)
  const {exchange} = useSelector((state: RootState) => state.app)
  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      Facade.route.ReceiveQrCodeModal.name
  )
  const [showQr, setShowQr] = useState(false)

  const {wallet, account, amount, token, reference} = props.route.params
  const ratio = exchange[token.symbol]?.to[currency] ?? 0
  const value = Facade.filter.currency(amount * ratio, currency)
  const labelWeight = 1.5

  const qrCodeContent = Facade.uri.generate(
    account.address ?? '',
    amount,
    token,
    reference
  )

  const renderQr = async () => {
    await Facade.utils.sleep(1000)
    setShowQr(true)
  }

  Facade.await.run('renderQr', renderQr)
  const qrCodeView = useRef<ViewShot>(null)
  const captureAndNavigate = async () => {
    const uri = await qrCodeView.current?.capture?.()
    props.navigation.navigate(Facade.route.CopyContextModal.name, {
      qrCode: uri ?? '',
      address: account.address ?? '',
    })
  }
  return show ? (
    <ScrollView
      style={{
        width: '100%',
        marginTop: useHeaderHeight(),
        marginBottom: '10%',
      }}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: PANEL_OFFSET + 20,
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      <LinearLayout height="100%" alignItems="center">
        <AwaitActivity name={'renderQr'}>
          <LinearLayout width={buttonWidth} height={buttonWidth}>
            {showQr ? (
              <ViewShot ref={qrCodeView}>
                <NeonQRCode content={qrCodeContent} qrCodeWidth={buttonWidth} />
              </ViewShot>
            ) : undefined}
          </LinearLayout>
        </AwaitActivity>
        <LinearLayout width={buttonWidth} height={54} mt={34}>
          <ThemedButton
            label="Copy to clipboard"
            srcIcon={require('~src/assets/images/icon-copy-green.png')}
            iconSize={[19, 23]}
            onPress={captureAndNavigate}
          />
        </LinearLayout>

        <LinearLayout
          width="90%"
          mt={22}
          flex={1}
          flexWrap="wrap"
          minHeight={400}
        >
          <LinearLayout orientation="horiz">
            <LinearLayout weight={labelWeight} pl={14} />
            <TextView
              weight={5}
              fontFamily="bold"
              color="white"
              fontSize={14}
              mb={16}
              style={{includeFontPadding: false}}
            >
              {Facade.t('receive.paymentRequestDetails')}
            </TextView>
          </LinearLayout>
          <LinearLayout
            borderWidth={1}
            borderRadius={7}
            pl={14}
            pt={27}
            borderColor={theme.colors.background[4]}
          >
            <LinearLayout orientation="horiz" width="100%" mb={14}>
              <InputLabel
                title={Facade.t('receive.token')}
                weight={labelWeight}
              />

              <LinearLayout orientation="horiz" weight={5}>
                <ImageView
                  alignSelf="center"
                  width={18}
                  height={18}
                  resizeMode="center"
                  source={token.srcIcon}
                />
                <TextView
                  color="white"
                  ml={2}
                  fontFamily="semibold"
                  fontSize={18}
                  style={{includeFontPadding: false}}
                >
                  {token.name}
                </TextView>
              </LinearLayout>
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%" mb={14}>
              <InputLabel
                title={Facade.t('receive.amount')}
                weight={labelWeight}
              />

              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={18}
                weight={5}
              >
                {amount}
              </TextView>
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%" mb={14}>
              <InputLabel
                title={Facade.t('receive.value')}
                weight={labelWeight}
              />

              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={18}
                weight={5}
              >
                {value}
              </TextView>
            </LinearLayout>

            <LinearLayout orientation="horiz" width="100%" mb={14}>
              <InputLabel
                title={Facade.t('receive.location')}
                weight={labelWeight}
              />

              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={16}
                weight={5}
                ml={2}
                mr={5}
                style={{includeFontPadding: false}}
              >
                {`${wallet.name} / ${account.name}`}
              </TextView>
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%" mb={14}>
              <InputLabel
                title={Facade.t('receive.address')}
                weight={labelWeight}
              />

              <TextView
                color={theme.colors.primary}
                fontFamily="medium"
                fontSize={16}
                weight={5}
                ml={2}
                style={{includeFontPadding: false}}
                mr={5}
              >
                {account.address}
              </TextView>
            </LinearLayout>
            <LinearLayout orientation="horiz" width="100%" mb={20}>
              <InputLabel
                title={Facade.t('receive.reference')}
                weight={labelWeight}
              />
              <TextView
                color="white"
                fontFamily="semibold"
                fontSize={16}
                weight={5}
                ml={2}
                mr={5}
                style={{includeFontPadding: false}}
              >
                {reference}
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </ScrollView>
  ) : (
    <LinearLayout />
  )
}
export default ReceiveQrCodeModal
