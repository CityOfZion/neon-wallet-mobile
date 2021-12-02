import {RouteProp} from '@react-navigation/native'
import i18n from 'i18n-js'
import React, {useEffect, useState} from 'react'

import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface WCConnectionRequestModalParams {
  uri: string
}

interface Props {
  route: RouteProp<ModalStackParamList, 'WCConnectionRequestModal'>
}

const WCConnectionRequestModal = (props: Props) => {
  const controller = useSwiperController(true)
  const walletConnectCtx = useWalletConnect()
  const [hasError, setError] = useState(false)

  const {uri} = props.route.params

  useEffect(() => {
    const runOnURI = async () => {
      try {
        await walletConnectCtx.onURI(uri)
      } catch (error) {
        setError(true)
      }
    }

    if (uri) {
      runOnURI()
    }
  }, [uri])

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      title={i18n.t('modals.transactionSent.title')}
      rightButton={<CloseButton mr={'20px'} />}
      onRightPress={controller.close}
      onClose={controller.close}
      disableDefaultScrollView={true}
      disableScrolling
      padding={0}
      solidColorBG
    >
      <TextView>{'WCConnectionRequestModal'}</TextView>
      <TextView>
        {'walletConnectCtx.sessionProposals = ' +
          walletConnectCtx.sessionProposals}
      </TextView>
      <TextView>{'hasError = ' + hasError}</TextView>

      <LinearLayout
        orientation={'verti'}
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'100%'}
        height={'20%'}
        position={'absolute'}
        bottom={'50px'}
      >
        <ThemedButton
          width={'90%'}
          label={i18n.t('modals.transactionSent.viewTransaction')}
          onPress={() => {}}
        />
        <ThemedButton
          width={'90%'}
          label={i18n.t('modals.transactionSent.viewOnDora')}
          onPress={() => {}}
        />
      </LinearLayout>
    </SwiperPanel>
  )
}

export default WCConnectionRequestModal
