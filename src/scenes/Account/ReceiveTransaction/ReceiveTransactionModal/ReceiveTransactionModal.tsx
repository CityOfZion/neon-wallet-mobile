import { Token } from '@cityofzion/blockchain-service'
import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import InputScrollView from 'react-native-input-scroll-view'

import { AmountInput } from './AmountInput'
import { ReferenceInput } from './ReferenceInput'
import { TokenSelect } from './TokenSelect'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { Account } from '~/src/store/account/Account'
import { Wallet } from '~/src/store/wallet/Wallet'
import AccountCard from '~src/components/AccountCard'
import { QRCodeWithCopyButton } from '~src/components/QRCodeWithCopyButton'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { TabSelector } from '~src/components/TabSelector'
import ThemedButton from '~src/components/themed/ThemedButton'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface ReceiveTransactionModalParams {
  wallet: Wallet
  account: Account
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ReceiveTransactionModal'>
}

type SelectedTab = 'requestToken' | 'myAddress'

const ReceiveTransactionModal = (props: Props) => {
  const { wallet, account } = props.route.params

  const controller = useSwiperController(true)

  const [selectedTab, setSelectedTab] = useState<SelectedTab>('myAddress')

  const [amount, setAmount] = useState<string>()
  const [reference, setReference] = useState<string>()
  const [token, setToken] = useState<Token>()

  const balanceExchange = useBalancesAndExchange(account)

  const navigate = () => {
    if (!token || !amount) return

    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.ReceiveTransactionQrCodeModal.name,
      params: {
        wallet,
        account,
        amount,
        token,
        reference,
      },
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.receiveTransactionModal.title')}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={() => props.navigation.goBack()}
      withoutScrollView
    >
      <InputScrollView
        keyboardOffset={300}
        showsVerticalScrollIndicator={false}
        disableScrollViewPanResponder
        alwaysBounceVertical={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <LinearLayout>
          <TextView mb="24px" alignSelf="center" color="text.3" fontSize="md" fontFamily="bold">
            {wallet.name.toUpperCase()}
          </TextView>

          <AccountCard
            balanceExchange={balanceExchange}
            hideBalance={false}
            account={props.route.params.account}
            hideCopy
            hideQRCode
          />

          <LinearLayout mt={18}>
            <TabSelector<SelectedTab>
              selected={selectedTab}
              onPress={setSelectedTab}
              tabs={[
                { id: 'myAddress', label: i18n.t('modals.receiveTransactionModal.yourAddress').toUpperCase() },
                { id: 'requestToken', label: i18n.t('modals.receiveTransactionModal.requestTokens').toUpperCase() },
              ]}
            />
          </LinearLayout>

          {selectedTab === 'myAddress' ? (
            <LinearLayout mt={30}>
              <QRCodeWithCopyButton qrCodeValue={account.address ?? ''} />
            </LinearLayout>
          ) : (
            <LinearLayout orientation="verti" justifyContent="space-between">
              <TokenSelect account={account} token={token} onTokenSelect={setToken} />

              <AmountInput account={account} amount={amount} onChange={setAmount} token={token} />

              <ReferenceInput reference={reference} onChange={setReference} />

              <LinearLayout width="100%" mt={30}>
                <ThemedButton
                  label={i18n.t('modals.receiveTransactionModal.generateQrCode')}
                  srcIcon={require('~/src/assets/images/icon-qrcode-green.png')}
                  iconSize={[19, 23]}
                  onPress={navigate}
                />
              </LinearLayout>
            </LinearLayout>
          )}
        </LinearLayout>
      </InputScrollView>
    </SwiperPanel>
  )
}

export default ReceiveTransactionModal
