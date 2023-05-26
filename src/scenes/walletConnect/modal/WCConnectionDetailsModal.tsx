import { RouteProp, useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import moment from 'moment'
import React, { useCallback, useMemo } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { ConnectedAccountAndWallet } from '~/src/components/ConnectionItem'
import { walletConnectConfig } from '~/src/config/WalletConnectConfig'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { RootState } from '~/src/store/RootStore'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { Session, useWalletConnect } from '~src/contexts/WalletConnectContext'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import ConnectionHeader from '~src/scenes/walletConnect/components/ConnectionHeader'
import { LinearLayout, TextView, ImageView } from '~src/styles/styled-components'

export interface WCConnectionDetailsModalParams {
  session: Session
  connectedAccountAndWallet: ConnectedAccountAndWallet
}

interface Props {
  route: RouteProp<ModalStackParamList, 'WCConnectionDetailsModal'>
}

const WCConnectionDetailsModal = (props: Props) => {
  const { session, connectedAccountAndWallet } = props.route.params
  const methods = session.requiredNamespaces[walletConnectConfig.defaultBlockchain].methods
  const approvalDate = useSelector((state: RootState) =>
    state.wcReducer.approvalDates?.find(approvalDate => approvalDate.sessionTopic === session.topic)
  )
  const controller = useSwiperController(true)
  const walletConnectCtx = useWalletConnect()
  const navigation = useNavigation()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  const blockchain = useMemo(
    () => WalletConnectHelper.getAccountInformationFromSession(session)[0].blockchain,
    [session]
  )

  const handleDisconnect = useCallback(async () => {
    await walletConnectCtx.disconnect(session.topic)
    controller.close()
  }, [walletConnectCtx.sessions])

  return (
    <SwiperPanel
      controller={controller}
      rightButton={<CloseButton onPress={controller.close} />}
      title={i18n.t('modals.WCConnectionDetails.title')}
      onClose={navigation.goBack}
      contentStyle={{ justifyContent: 'space-between' }}
    >
      <LinearLayout>
        <LinearLayout alignItems="center" pb="38px">
          <LinearLayout orientation="horiz">
            <TextView color="text.10" fontSize="12px">
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
            <TextView color="text.10" fontSize="12px">
              {connectedAccountAndWallet.account?.name ?? ''}
            </TextView>
          </LinearLayout>

          {approvalDate && (
            <TextView color="text.10" fontSize="12px">
              {moment.unix(approvalDate.approvalDate).format('HH:mm Do MMM YYYY')}
            </TextView>
          )}
        </LinearLayout>

        <ConnectionHeader title={session.peer.metadata.name} imageUri={session.peer.metadata.icons[0]} />

        <LinearLayout width="100%" backgroundColor="background.15" orientation="horiz" padding={3} borderRadius="7px">
          <LinearLayout width="50%" ml={3}>
            <TextView fontFamily="bold" color="text.10" fontSize="14px" fontWeight="700">
              {i18n.t('modals.WCConnectionDetails.chain')}
            </TextView>
            <LinearLayout orientation="horiz" mt={3}>
              <ImageView
                source={BlockchainHelper.getIcon(blockchain)}
                resizeMode="contain"
                mr={1}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <TextView fontFamily="medium" color="#fff" fontSize="16px">
                {i18n.t(`blockchainServices.${blockchain}.id`)}
              </TextView>
            </LinearLayout>
          </LinearLayout>

          <LinearLayout>
            <TextView fontFamily="bold" color="text.10" fontSize="14px" fontWeight="700">
              {i18n.t('modals.WCConnectionDetails.features')}
            </TextView>

            {methods.map((method, index) => (
              <TextView key={index} color="#fff" fontFamily="medium" fontSize="16px">
                {method}
              </TextView>
            ))}
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>

      <TouchableWithoutFeedback onPress={handleDisconnect} disabled={!isConnected}>
        <LinearLayout
          width="100%"
          borderRadius="4px"
          borderWidth="1px"
          borderColor="primary"
          justifyContent="center"
          alignItems="center"
          p="10px"
        >
          <TextView color="primary" fontSize="20px">
            {i18n.t('modals.WCConnectionDetails.disconnect')}
          </TextView>
        </LinearLayout>
      </TouchableWithoutFeedback>
    </SwiperPanel>
  )
}

export default WCConnectionDetailsModal
