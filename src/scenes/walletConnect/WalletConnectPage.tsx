import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useEffect, useMemo} from 'react'
import {FlatList, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {ConnectionItem} from '~/src/components/ConnectionItem'
import {FlatListEmpty} from '~/src/components/FlatListEmpty'
import HeaderActionButton from '~/src/components/layout/HeaderActionButton'
import ScreenLayoutWithoutScroll from '~/src/components/layout/ScreenLayoutWithoutScroll'
import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {UriHelper} from '~/src/helpers/UriHelper'
import {WalletConnectHelper} from '~/src/helpers/WalletConnectHelper'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {WalletConnectStackParamList} from '~/src/navigation/WalletConnectStackNavigation'
import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'
export interface WalletConnectPageParams {
  uri?: string
}

interface WalletConnectPageProps {
  navigation: StackNavigationProp<
    ModalStackParamList & WalletConnectStackParamList
  >
  route: RouteProp<WalletConnectStackParamList, 'WalletConnectPage'>
}

const WalletConnectPage = ({navigation, route}: WalletConnectPageProps) => {
  const {sessions} = useWalletConnect()
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const {isConnected} = useSelector((state: RootState) => state.network)

  const validSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const [
          sessionsAccount,
        ] = WalletConnectHelper.getAccountInformationFromSession(session)

        return accountsPool.some(
          (account) => account.address === sessionsAccount.address
        )
      }),
    [sessions]
  )

  navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionButtonStyle: 'add',
        actionOnPress: handlePress,
      }),
  })

  const handlePress = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectDappModal.name,
    })
  }

  useEffect(() => {
    if (route.params?.uri) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WCConnectDappModal.name,
        params: {
          uri: UriHelper.convertBase64ToUri(route.params.uri),
        },
      })
    }
  }, [route.params])

  return (
    <ScreenLayoutWithoutScroll>
      <LinearLayout justifyContent={'space-between'} height={'100%'}>
        <LinearLayout height={'100%'}>
          {validSessions.length > 0 && (
            <TextView
              color={'white'}
              fontSize={'18px'}
              textAlign={'center'}
              pb={'24px'}
            >
              {i18n.t('walletconnect.connectedDApps')}
            </TextView>
          )}

          <FlatList
            data={validSessions}
            renderItem={({item}) => <ConnectionItem session={item} />}
            keyExtractor={(item) => item.topic}
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent={
              <FlatListEmpty
                label={i18n.t('walletconnect.noDAppsConnected')}
                alignY="center"
                footer={
                  <TouchableWithoutFeedback
                    onPress={handlePress}
                    disabled={!isConnected}
                  >
                    <LinearLayout
                      orientation="horiz"
                      width="100%"
                      marginTop={4}
                      alignItems="center"
                      justifyContent="center"
                      borderStyle="dashed"
                      borderColor="#54686b"
                      borderRadius={8}
                      borderWidth={1}
                      padding={4}
                    >
                      <ImageView
                        source={require('~src/assets/images/icon-plus-white.png')}
                        style={{marginRight: 8}}
                      />

                      <TextView color="white" fontSize={18} fontFamily="medium">
                        {i18n.t('walletconnect.connectDAppLabel')}
                      </TextView>
                    </LinearLayout>
                  </TouchableWithoutFeedback>
                }
              />
            }
          />
        </LinearLayout>

        {validSessions.length > 0 && (
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
        )}
      </LinearLayout>
    </ScreenLayoutWithoutScroll>
  )
}

export default WalletConnectPage
