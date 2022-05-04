import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useState, useCallback, useEffect} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useDispatch, useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import InputWithValidation from '~/src/components/InputWithValidation'
import ThemedButton from '~/src/components/themed/ThemedButton'
import {UriHelper} from '~/src/helpers/UriHelper'
import {useHandleOfflineFunctions} from '~/src/hooks/HandleOfflineFunctions'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {RootStore} from '~/src/store/RootStore'
import {LinearLayout, TextView} from '~/src/styles/styled-components'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'

export interface WCConnectDappModalParams {
  uri?: string
}

interface WCConnectDappModalProps {
  route: RouteProp<ModalStackParamList, 'WCConnectDappModal'>
}

export const WCConnectDappModal = (props: WCConnectDappModalProps) => {
  const [url, setUrl] = useState<string>(props.route.params?.uri ?? '')
  const {handleOnlyOnline} = useHandleOfflineFunctions()
  const {isConnected} = useSelector((state: RootState) => state.network)
  const controller = useSwiperController(true)
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()
  const {dappConnectionStart} = useSelector(
    (state: RootState) => state.wcReducer
  )
  const dispatch = useDispatch()
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const validateURL = useCallback(() => {
    return UriHelper.isValid(url)
  }, [url])

  const handleChangeURL = useCallback(
    (text: string) => {
      setUrl(text)
    },
    [url]
  )

  const handleNavigation = useCallback(() => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectionRequestModal.name,
      params: {
        uri: url,
      },
    })
  }, [url])

  const handleNavigationOffline = useCallback(() => {
    if (!isConnected) {
      showMessage({
        message: i18n.t('walletconnect.internetConnectionLost1'),
        type: 'danger',
        duration: 7000,
      })
      navigation.replace(wrapper.route.Tab.name, {
        screen: wrapper.route.WalletConnectPage.name,
      })
    }
  }, [isConnected])

  useEffect(() => {
    handleNavigationOffline()
  }, [isConnected])

  useEffect(() => {
    dispatch(RootStore.wcReducer.actions.setDappConnectionStart(true))
    return () => {
      dispatch(RootStore.wcReducer.actions.setDappConnectionStart(false))
    }
  }, [])

  return (
    <SwiperPanel
      padding={20}
      fullSize={true}
      controller={controller}
      rightButton={<CloseButton mr={'20px'} />}
      title={i18n.t('modals.connectDApp.title')}
      onClose={() => {
        navigation.goBack()
      }}
      onRightPress={controller.close}
      solidColorBG={true}
    >
      <LinearLayout height={'100%'} justifyContent={'space-between'}>
        <LinearLayout height={'50%'} justifyContent={'space-between'} pb={5}>
          <TextView
            color="#fff"
            fontFamily="regular"
            fontSize="18px"
            pt={5}
            textAlign="center"
          >
            {i18n.t('modals.connectDApp.subtitle')}
          </TextView>

          <LinearLayout>
            <TextView
              color="#fff"
              fontFamily="bold"
              fontSize="14px"
              pt={7}
              pb={3}
            >
              {i18n.t('modals.connectDApp.url')}
            </TextView>
            <LinearLayout ml={-5} mr={-5}>
              <InputWithValidation
                onChangeText={handleChangeURL}
                color={'text.10'}
                separatorColor={'text.3'}
                invalidColor={'text.10'}
                validator={validateURL}
                value={url}
                placeholder={i18n.t('modals.connectDApp.placeholder')}
                invalidMessageColor={theme.colors.quinary}
              />
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>

        <LinearLayout>
          <ThemedButton
            label={i18n.t('modals.connectDApp.connectLabel')}
            disabled={!validateURL()}
            onPress={() => handleOnlyOnline(handleNavigation)}
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}
