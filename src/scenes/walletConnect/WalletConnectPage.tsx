import { useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect } from 'react'
import { FlatList, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { ConnectionItem } from '~/src/components/ConnectionItem'
import { FlatListEmpty } from '~/src/components/FlatListEmpty'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import ThemedAddButton from '~/src/components/themed/ThemedAddButton'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { WalletConnectStackParamList } from '~/src/navigation/WalletConnectStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

export interface WalletConnectPageParams {
  uri?: string
}

interface WalletConnectPageProps {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList & WalletConnectStackParamList>
  route: RouteProp<WalletConnectStackParamList, 'WalletConnectPage'>
}

const WalletConnectPage = ({ navigation, route }: WalletConnectPageProps) => {
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const { sessions } = useWalletConnectWallet()

  const handlePress = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectDappModal.name,
    })
  }

  useEffect(() => {
    if (route.params?.uri) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WCConnectionRequestModal.name,
        params: {
          uri: route.params?.uri,
        },
      })
    }
  }, [route.params?.uri])

  return (
    <ScreenLayout withoutScrollView rightButton={<ThemedAddButton onPress={handlePress} />} hideBackButton>
      <LinearLayout height="100%">
        <LinearLayout flexGrow={1}>
          {sessions.length > 0 && (
            <TextView color="white" fontSize="18px" textAlign="center" pb="24px">
              {i18n.t('walletconnect.connectedDApps')}
            </TextView>
          )}

          <FlatList
            data={sessions}
            renderItem={({ item }) => <ConnectionItem session={item} />}
            keyExtractor={item => item.topic}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
              <FlatListEmpty
                label={i18n.t('walletconnect.noDAppsConnected')}
                alignY="center"
                footer={
                  <TouchableWithoutFeedback onPress={handlePress} disabled={!isConnected}>
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
                        style={{ marginRight: 8 }}
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

        {sessions.length > 0 && (
          <LinearLayout mb="15px">
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
                  width={Normalize.scale(20)}
                  height={Normalize.scale(20)}
                  alignSelf="center"
                  mr="4px"
                />
                <TextView style={{ includeFontPadding: false }} ml={3} color="primary" fontSize={20}>
                  {i18n.t('walletconnect.connectNewDAppLabel')}
                </TextView>
              </LinearLayout>
            </TouchableWithoutFeedback>
          </LinearLayout>
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default WalletConnectPage
