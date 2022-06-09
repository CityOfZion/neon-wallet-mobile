import {useNavigation} from '@react-navigation/native'
import {SessionTypes} from '@walletconnect/types'
import I18n from 'i18n-js'
import moment from 'moment'
import React, {useMemo, useState} from 'react'
import {TouchableHighlight} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '../app/ApplicationWrapper'
import {WalletConnectHelper} from '../helpers/WalletConnectHelper'
import {Account} from '../models/redux/Account'
import {Wallet} from '../models/redux/Wallet'

import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'

type Props = {
  session: SessionTypes.Settled
}

export type ConnectedAccountAndWallet = {
  account: Account
  wallet: Wallet
}

export const ConnectionItem = ({session}: Props) => {
  const navigation = useNavigation()
  const approvalDate = useSelector((state: RootState) =>
    state.wcReducer.approvalDates?.find(
      (approvalDate) => approvalDate.sessionTopic === session.topic
    )
  )
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const walletsPool = useSelector((state: RootState) => state.app.wallets)

  const connectedAccountsAndWallets = useMemo(() => {
    const sessionAccounts = WalletConnectHelper.getAccountInformationFromSession(
      session
    )

    const connectedWalletsAndAccounts = sessionAccounts.map(
      (sessionAccount): Partial<ConnectedAccountAndWallet> => {
        const account = accountsPool.find(
          (account) => account.address === sessionAccount.address
        )
        return {
          account,
          wallet: account?.getWallet(walletsPool),
        }
      }
    )

    return connectedWalletsAndAccounts.filter(
      (
        connectedWalletAndAccount
      ): connectedWalletAndAccount is ConnectedAccountAndWallet =>
        !!connectedWalletAndAccount.account &&
        !!connectedWalletAndAccount.wallet
    )
  }, [session])

  const [shouldShowDefaultImage, setShouldShowDefaultImage] = useState(false)

  const handlePress = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectionDetailsModal.name,
      params: {
        session,
        connectedAccountsAndWallets,
      },
    })
  }

  return (
    <TouchableHighlight onPress={handlePress}>
      <LinearLayout>
        <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
          <LinearLayout orientation={'horiz'}>
            <LinearLayout
              borderRadius={'4px'}
              width={'42px'}
              height={'41px'}
              alignSelf={'center'}
              mr={'10px'}
            >
              <ImageView
                source={
                  !shouldShowDefaultImage
                    ? {
                        uri: session.peer.metadata.icons[0],
                      }
                    : require('~src/assets/logos/icon-dapp-default.png')
                }
                onError={
                  !shouldShowDefaultImage
                    ? () => {
                        setShouldShowDefaultImage(true)
                      }
                    : undefined
                }
                width="100%"
                height="100%"
                resizeMode="contain"
              />
            </LinearLayout>
            <LinearLayout>
              {!!approvalDate && (
                <TextView color={'text.10'} fontSize={'12px'}>
                  {moment
                    .unix(approvalDate.approvalDate)
                    .format(I18n.t('formatters.dappApprovedDate'))}
                </TextView>
              )}
              <TextView color={'white'} fontFamily={'medium'} fontSize={'18px'}>
                {session.peer.metadata.name}
              </TextView>

              {connectedAccountsAndWallets &&
                connectedAccountsAndWallets.length > 0 &&
                connectedAccountsAndWallets.map(
                  (connectedAccountAndWallet, index) => (
                    <LinearLayout orientation={'horiz'} key={index}>
                      <TextView color={'text.10'} fontSize={'12px'}>
                        {`${connectedAccountAndWallet.wallet.name} - `}
                      </TextView>

                      <LinearLayout
                        width="7px"
                        height="7px"
                        mr="3px"
                        mt="6px"
                        bg={connectedAccountAndWallet.account.backgroundColor}
                        borderRadius={9999}
                      />
                      <TextView color={'text.10'} fontSize={'12px'}>
                        {connectedAccountAndWallet.account?.name ?? ''}
                      </TextView>
                    </LinearLayout>
                  )
                )}
            </LinearLayout>
          </LinearLayout>
          <ImageView
            source={require('~src/assets/images/icon-arrow-right-green.png')}
            width={12}
            height={19}
            alignSelf={'center'}
            mr={'5px'}
          />
        </LinearLayout>

        <LinearLayout
          height="1px"
          bg="background.10"
          alignSelf="stretch"
          my="10px"
        />
      </LinearLayout>
    </TouchableHighlight>
  )
}
