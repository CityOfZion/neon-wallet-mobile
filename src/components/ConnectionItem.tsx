import { useNavigation } from '@react-navigation/native'
import { SessionTypes } from '@walletconnect/types'
import I18n from 'i18n-js'
import moment from 'moment'
import React, { useMemo } from 'react'
import { TouchableHighlight } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { WalletConnectHelper } from '../helpers/WalletConnectHelper'
import { useImageError } from '../hooks/useImageError'
import { Account } from '../models/redux/Account'
import { Wallet } from '../models/redux/Wallet'
import { RootState } from '../store/RootStore'
import { selectAccounts } from '../store/account/SelectorAccount'
import { selectWallets } from '../store/wallet/SelectorWallet'
import { Separator } from './Separator'

import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  session: SessionTypes.Struct
}

export type ConnectedAccountAndWallet = {
  account: Account
  wallet: Wallet
}

export const ConnectionItem = ({ session }: Props) => {
  const navigation = useNavigation()

  const accountsPool = useSelector(selectAccounts)
  const walletsPool = useSelector(selectWallets)
  const approvalDate = useSelector((state: RootState) => {
    const date = state.wcReducer.approvalDates?.find(approvalDate => approvalDate.sessionTopic === session.topic)
    if (!date) return

    return moment.unix(date.approvalDate).format(I18n.t('formatters.dappApprovedDate'))
  })

  const connectedAccountAndWallet = useMemo<ConnectedAccountAndWallet | undefined>(() => {
    const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)

    const account = accountsPool.find(account => account.address === address)
    if (!account) return

    const wallet = account.getWallet(walletsPool)
    if (!wallet) return

    return {
      account,
      wallet,
    }
  }, [session])

  const { handleError, imageSource } = useImageError({
    source: {
      uri: session.peer.metadata.icons[0],
    },
  })

  const handlePress = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectionDetailsModal.name,
      params: {
        session,
        connectedAccountAndWallet,
      },
    })
  }

  return (
    <LinearLayout>
      <TouchableHighlight onPress={handlePress}>
        <LinearLayout orientation="horiz" justifyContent="space-between" alignItems="center" my="10px" mx="4px">
          <LinearLayout orientation="horiz" alignItems="center" width="80%">
            <LinearLayout borderRadius="4px" width="42px" height="42px" mr="10px">
              <ImageView source={imageSource} onError={handleError} width={42} height={42} resizeMode="contain" />
            </LinearLayout>

            <LinearLayout>
              {!!approvalDate && (
                <TextView color="text.10" fontSize="12px">
                  {approvalDate}
                </TextView>
              )}

              <TextView color="white" fontFamily="medium" fontSize="18px" numberOfLines={1} ellipsizeMode="tail">
                {session.peer.metadata.name}
              </TextView>

              {connectedAccountAndWallet && (
                <LinearLayout orientation="horiz" alignItems="center">
                  <TextView color="text.10" fontSize="12px">
                    {`${connectedAccountAndWallet.wallet.name} - `}
                  </TextView>

                  <LinearLayout
                    width="8px"
                    height="8px"
                    bg={connectedAccountAndWallet.account.backgroundColor}
                    borderRadius="4px"
                  />

                  <TextView color="text.10" fontSize="12px">
                    {` ${connectedAccountAndWallet.account.name}`}
                  </TextView>
                </LinearLayout>
              )}
            </LinearLayout>
          </LinearLayout>

          <ImageView
            source={require('~src/assets/images/icon-arrow-right-green.png')}
            width={18}
            height={18}
            resizeMode="contain"
            ml="4px"
          />
        </LinearLayout>
      </TouchableHighlight>

      <Separator />
    </LinearLayout>
  )
}
