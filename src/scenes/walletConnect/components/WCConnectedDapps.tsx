import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {SessionTypes} from '@walletconnect/types/dist/cjs/session'
import i18n from 'i18n-js'
import React, {useEffect, useCallback, useState} from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import {useSelector} from 'react-redux'

import DappConnectedCard from './DappConnectedCard'
import ListSeparator from './ListSeparator'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {Storage} from '~/src/app/Storage'
import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {WCApprovalDate} from '~/src/models/redux/WCApprovalDate'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'

interface IWalletInfo {
  account: Account | undefined
  wallet: Wallet | undefined
}

export interface IDappInfo {
  session: SessionTypes.Settled
  connectedAcc: IWalletInfo[]
  approvedDate: number
}

export const WCConnectedDapps = () => {
  const walletConnectCtx = useWalletConnect()
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const walletsPool = useSelector((state: RootState) => state.app.wallets)
  const [approvalDatesPool, setApprovalDatesPool] = useState<
    WCApprovalDate[] | null
  >(null)

  const syncApprovalDates = useCallback(async () => {
    const result = await Storage.wcApprovalDates.load()
    setApprovalDatesPool(result)
  }, [])

  const handleNavigation = (dappInfo: IDappInfo) => {
    if (walletConnectCtx.sessions.length > 0) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WCConnectionDetailsModal.name,
        params: {
          dapp: dappInfo,
        },
      })
    }
  }

  const items: IDappInfo[] = walletConnectCtx.sessions.map((session) => {
    let approvedDate: WCApprovalDate | undefined
    const accountsConnected = session.state.accounts.map((it) => {
      const info = it.split(':')
      const account = accountsPool.find(
        (account) => account.address === info[2]
      )
      return {
        account,
        wallet: account?.getWallet(walletsPool),
      }
    })
    if (approvalDatesPool !== null) {
      approvedDate = approvalDatesPool.find(
        (it) => it.sessionTopic === session.topic
      )
    }
    return {
      session,
      connectedAcc: accountsConnected,
      approvedDate: approvedDate?.approvalDate ?? 0,
    }
  })

  useEffect(() => {
    syncApprovalDates()
  }, [items])

  const DappConnectedItem = (props: ListRenderItemInfo<IDappInfo>) => {
    return (
      <DappConnectedCard
        dAppName={props.item.session.peer.metadata.name}
        approvedDate={props.item.approvedDate}
        iconUri={props.item.session.peer.metadata.icons[0]}
        onPress={() => handleNavigation(props.item)}
        footer={
          <>
            {props.item.connectedAcc.map((it, index) => {
              const accountInfo = props.item.session.state.accounts[
                index
              ].split(':')
              return (
                <LinearLayout orientation={'horiz'} key={index}>
                  <TextView color={'text.10'} fontSize={'12px'}>
                    {it.wallet ? `${it.wallet.name} - ` : ''}
                  </TextView>
                  {it.account ? (
                    <>
                      <LinearLayout
                        width="7px"
                        height="7px"
                        mr="3px"
                        mt="6px"
                        bg={it.account.backgroundColor}
                        borderRadius={9999}
                      />
                      <TextView color={'text.10'} fontSize={'12px'}>
                        {it.account?.name ?? ''}
                      </TextView>
                    </>
                  ) : (
                    <TextView color={'text.10'} fontSize={'12px'}>
                      {accountInfo[2]}
                    </TextView>
                  )}
                </LinearLayout>
              )
            })}
          </>
        }
      />
    )
  }

  return walletConnectCtx.sessions.length > 0 ? (
    <ScreenLayout padding={20} solidColorBG>
      <LinearLayout justifyContent={'space-between'} height={'100%'}>
        <LinearLayout>
          <LinearLayout>
            <TextView
              color={'white'}
              fontSize={'18px'}
              textAlign={'center'}
              pb={'24px'}
            >
              {i18n.t('walletconnect.connectedDApps')}
            </TextView>
            <ScrollView>
              <FlatList
                data={items}
                renderItem={DappConnectedItem}
                ItemSeparatorComponent={ListSeparator}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>
          </LinearLayout>
          <ListSeparator />
        </LinearLayout>
        <LinearLayout justifyContent={'flex-end'} mb={'5px'}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate(wrapper.route.Modal.name, {
                screen: wrapper.route.WCConnectDappModal.name,
              })
            }}
          >
            <LinearLayout
              width="100%"
              borderRadius="4px"
              borderWidth="1px"
              borderColor="primary"
              justifyContent="center"
              alignItems="center"
              orientation="horiz"
              p="10px"
            >
              <ImageView
                source={require('~src/assets/images/icon-plus-green.png')}
                width={'20px'}
                height={'20px'}
                alignSelf={'center'}
                mr={'4px'}
              />
              <TextView
                style={{includeFontPadding: false}}
                ml={3}
                color={'primary'}
                fontSize={20}
              >
                {i18n.t('walletconnect.connectNewDAppLabel')}
              </TextView>
            </LinearLayout>
          </TouchableWithoutFeedback>
        </LinearLayout>
      </LinearLayout>
    </ScreenLayout>
  ) : (
    <ScreenLayout />
  )
}
