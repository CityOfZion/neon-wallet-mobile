import { hasExplorerService } from '@cityofzion/blockchain-service'
import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import { Linking } from 'react-native'
import { useSelector } from 'react-redux'

import { TransactionRequestSuccessElementProps } from '../TransactionRequestBase'

import ThemedButton from '~/src/components/themed/ThemedButton'
import { RootState } from '~/src/store/RootStore'
import { selectWalletByID } from '~/src/store/wallet/SelectorWallet'
import { wrapper } from '~src/app/ApplicationWrapper'
import { Normalize } from '~src/app/Normalize'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export const InvokeFunctionSuccess = ({ account, transactionId }: TransactionRequestSuccessElementProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const wallet = useSelector(selectWalletByID(account.idWallet))
  const service = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[account.blockchain]
  )

  const navigation = useNavigation()

  const navigateToTransactions = () => {
    if (!wallet || service.network.type === 'custom') {
      return
    }

    navigation.reset({
      index: 0,
      routes: [{ name: wrapper.route.Tab.name }],
    })

    navigation.navigate(wrapper.route.GetWallet.name, { wallet })
    navigation.navigate(wrapper.route.GetAccount.name, { account, wallet })
    navigation.navigate(wrapper.route.AccountTransactionsScreen.name, { account })
  }

  const explorerUrl = hasExplorerService(service)
    ? service.explorerService.buildTransactionUrl(transactionId)
    : undefined

  return (
    <LinearLayout orientation="verti" alignItems="center" width="100%" height="100%">
      <ImageView
        alignSelf="center"
        resizeMode="contain"
        width={Normalize.scale(115)}
        height={Normalize.scale(110)}
        mb={22}
        mt="5%"
        source={require('~src/assets/images/icon-circle-check-green.png')}
      />

      <TextView
        color={theme.colors.text[0]}
        fontSize={22}
        fontWeight={500}
        lineHeight="22px"
        fontFamily="medium"
        textAlign="center"
        mb={15}
      >
        {i18n.t('modals.transactionSent.transactionSent')}
      </TextView>

      <TextView
        color={theme.colors.text[6]}
        fontSize={18}
        fontWeight={400}
        fontFamily="regular"
        textAlign="center"
        lineHeight="22px"
        mx={48}
        mb={45}
      >
        {i18n.t('modals.transactionSent.transactionSuccessText')}
      </TextView>

      <TextView color={theme.colors.text[6]} fontSize={14} fontFamily="medium" fontWeight={500} textAlign="left" mb={3}>
        {i18n.t('modals.transactionSent.transactionId').toUpperCase()}
      </TextView>
      <ButtonView
        orientation="horiz"
        alignItems="center"
        mb="auto"
        onPress={() => {
          UtilsHelper.copyToClipboard(transactionId)
        }}
      >
        <TextView
          maxWidth="80%"
          color="primary"
          fontSize="16px"
          fontWeight={500}
          fontFamily="medium"
          mr="16px"
          textAlign="center"
        >
          {transactionId}
        </TextView>
        <ImageView
          resizeMode="contain"
          source={require('~src/assets/images/icon-copy-green.png')}
          style={{ width: 16 }}
        />
      </ButtonView>

      <LinearLayout width="100%">
        <ThemedButton
          onPress={navigateToTransactions}
          label={i18n.t('modals.transactionSent.viewTransaction')}
          disabled={!wallet || service.network.type === 'custom'}
        />
      </LinearLayout>

      {explorerUrl && (
        <LinearLayout width="100%" mt="10px">
          <ThemedButton
            onPress={() => Linking.openURL(explorerUrl)}
            label={i18n.t('modals.transactionSent.viewOnDora')}
          />
        </LinearLayout>
      )}
    </LinearLayout>
  )
}
