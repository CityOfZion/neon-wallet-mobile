import { EStatus, useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useRef } from 'react'
import { Animated, Easing, ImageSourcePropType, Platform } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { useSelector } from 'react-redux'

import { AlterMenuItem } from '../AlterMenuItem'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { GenericWalletURLHelper } from '~/src/helpers/GenericWalletURLHelper'
import { UriHelper } from '~/src/helpers/UriHelper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { MoreStackParamList } from '~/src/navigation/MoreStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { RouteName } from '~/src/types/wrappers/route'
import { Route } from '~src/app/Route'
import SwiperPanel, { SwiperController, useSwiperController } from '~src/components/SwiperPanel'
import { ButtonView, ImageView, LinearLayout } from '~src/styles/styled-components'

interface TabButtonProps {
  source: ImageSourcePropType
  activeSource: ImageSourcePropType
  disabled?: boolean
  route: Route<RouteName>
  controller: SwiperController
}

interface QuickToolsMenuProps {
  controller: SwiperController
}

type NavigationProps = StackNavigationProp<
  RootStackParamList & ModalStackParamList & WalletStackParamList & MoreStackParamList & TabStackParamList
>

const QuickToolsMenu = ({ controller }: QuickToolsMenuProps) => {
  const navigation = useNavigation<NavigationProps>()
  const { validateAddressAllBlockchains, validatePrivateKeyWithPasswordAllBlockchains, validateWifAllBlockchains } =
    useBlockchainServiceUtils()

  const handleScanQrCode = (data: string) => {
    const urlWIF = GenericWalletURLHelper.validateAndParse(data)
    if (urlWIF && validateWifAllBlockchains(urlWIF)) {
      navigation.navigate(wrapper.route.Tab.name, {
        screen: wrapper.route.More.name,
        params: {
          screen: wrapper.route.ImportKey.name,
          initial: false,
          params: {
            data: urlWIF,
          } as any,
        },
      })
    }

    const sendUri = UriHelper.validateAndParse(data)
    if (sendUri && validateAddressAllBlockchains(sendUri.address)) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WalletSelectionModal.name,
        params: {
          textSchema: 'modals.sendSelectionModal',
          disconnectDisable: true,
          noBalanceDisable: true,
          onFinish: params => {
            navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.SendTransactionModal.name,
              params: {
                ...params,
                address: sendUri.address,
              },
            })
          },
        },
      })

      return
    }

    if (WalletConnectHelper.isValidURI(data)) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WCConnectionRequestModal.name,
        params: {
          uri: data,
        },
      })
      return
    }

    if (validateAddressAllBlockchains(data)) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.AddressScanQuickToolsModal.name,
        params: {
          address: data,
        },
      })
      return
    }

    if (validatePrivateKeyWithPasswordAllBlockchains(data) || validateWifAllBlockchains(data)) {
      navigation.navigate(wrapper.route.Tab.name, {
        screen: wrapper.route.More.name,
        params: {
          screen: wrapper.route.ImportKey.name,
          initial: false,
          params: {
            data,
          } as any,
        },
      })
    }
  }

  const handlePressQrCode = () => {
    navigation.navigate(wrapper.route.QRCodeScan.name, {
      onScan: handleScanQrCode,
    })
  }

  const handlePressSend = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WalletSelectionModal.name,
      params: {
        textSchema: 'modals.sendSelectionModal',
        disconnectDisable: true,
        noBalanceDisable: true,
        onFinish: params => {
          navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.SendTransactionModal.name,
            params,
          })
        },
      },
    })
  }

  const handlePressReceive = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WalletSelectionModal.name,
      params: {
        textSchema: 'modals.receiveSelectionModal',
        onFinish: params => {
          navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.ReceiveTransactionModal.name,
            params,
          })
        },
        noBalanceDisable: false,
      },
    })
  }

  const runClosing = (callback: () => void) => {
    controller.close()
    callback()
  }

  return (
    <SwiperPanel
      controller={controller}
      withoutHeader
      size="dinamic"
      contentStyle={{ paddingBottom: applicationConfig.footerHeight, paddingTop: 0 }}
    >
      <AlterMenuItem
        onPress={() => runClosing(handlePressQrCode)}
        icon={require('~src/assets/images/icon-circle-qr-primary.png')}
        title={i18n.t('quickTools.qrCode.title')}
        subtitle={i18n.t('quickTools.qrCode.subtitle')}
      />

      <AlterMenuItem
        onPress={() => runClosing(handlePressSend)}
        icon={require('~src/assets/images/icon-circle-send-primary.png')}
        title={i18n.t('quickTools.send.title')}
        subtitle={i18n.t('quickTools.send.subtitle')}
      />

      <AlterMenuItem
        onPress={() => runClosing(handlePressReceive)}
        icon={require('~src/assets/images/icon-circle-receive-primary.png')}
        title={i18n.t('quickTools.receive.title')}
        subtitle={i18n.t('quickTools.receive.subtitle')}
        withSeparator={false}
      />
    </SwiperPanel>
  )
}

const TabButton = (props: BottomTabBarProps & TabButtonProps) => {
  return (
    <ButtonView
      onPress={() => {
        props.controller.close()
        props.navigation.navigate(props.route.name)
      }}
      alignItems="center"
      weight={1}
      opacity={props.disabled ? 0.5 : 1}
      disabled={props.disabled}
    >
      <ImageView
        resizeMode="cover"
        source={props.state.routes[props.state.index].name === props.route.name ? props.activeSource : props.source}
      />
    </ButtonView>
  )
}

const FooterBar: React.FC<BottomTabBarProps> = (props: BottomTabBarProps) => {
  const { state, descriptors } = props

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const { status } = useWalletConnectWallet()
  const focusedOptions = descriptors[state.routes[state.index].key].options

  const quickToolColor = useRef(new Animated.Value(0))
  const colorInterpolator = quickToolColor.current.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.primary, theme.colors.quaternary],
  })

  const quickToolSpin = useRef(new Animated.Value(0))
  const spinInterpolator = quickToolSpin.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  })

  const controller = useSwiperController()

  useEffect(() => {
    Animated.parallel([
      Animated.timing(quickToolColor.current, {
        toValue: controller.isShowing ? 1 : 0,
        duration: 300,
        easing: Easing.quad,
        useNativeDriver: false,
      }),
      Animated.timing(quickToolSpin.current, {
        toValue: controller.isShowing ? 1 : 0,
        duration: 300,
        easing: Easing.quad,
        useNativeDriver: true,
      }),
    ]).start()
  }, [controller.isShowing])

  if (focusedOptions.tabBarVisible === false) {
    return <></>
  }

  return (
    <LinearLayout height="100%" width="100%" justifyContent="flex-end" position="absolute" pointerEvents="box-none">
      <QuickToolsMenu controller={controller} />

      <LinearLayout position="absolute" width={'100%' as any} height={applicationConfig.footerHeight} bottom="-1px">
        <Shadow
          distance={12}
          sides={['top']}
          startColor={`${theme.colors.black}33`}
          viewStyle={{
            width: '100%',
            height: '100%',
          }}
          containerViewStyle={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            bottom: -applicationConfig.footerOffset,
            flexDirection: 'row',
          }}
        >
          <LinearLayout />
        </Shadow>

        <ImageView
          width={'100%' as any}
          position="absolute"
          bottom="0px"
          height={applicationConfig.footerHeight}
          source={
            Platform.OS === 'ios'
              ? require('~src/assets/images/tab-bar-ios.png')
              : require('~src/assets/images/tab-bar-android.png')
          }
        />

        <LinearLayout orientation="horiz" position="relative" alignItems="flex-end" top="2px">
          <TabButton
            activeSource={require('~src/assets/images/button-wallet-white.png')}
            source={require('~src/assets/images/button-wallet-disabled.png')}
            route={wrapper.route.ListWallets}
            controller={controller}
            {...props}
          />

          <TabButton
            activeSource={require('~src/assets/images/button-connections-white.png')}
            source={require('~src/assets/images/button-connections-disabled.png')}
            route={wrapper.route.WalletConnect}
            controller={controller}
            disabled={status !== EStatus.STARTED}
            {...props}
          />

          <ButtonView onPress={controller.toggle} position="relative" bottom="-2px">
            <Animated.View
              style={{
                width: 66,
                height: 66,
                borderRadius: 33,
                backgroundColor: colorInterpolator,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Animated.Image
                resizeMode="contain"
                source={require('~src/assets/images/plus-sign-tabbar.png')}
                style={{
                  transform: [{ rotate: spinInterpolator }],
                }}
              />
            </Animated.View>
          </ButtonView>

          <TabButton
            activeSource={require('~src/assets/images/button-contacts-white.png')}
            source={require('~src/assets/images/button-contacts-disabled.png')}
            route={wrapper.route.Contacts}
            controller={controller}
            {...props}
          />

          <TabButton
            activeSource={require('~src/assets/images/button-more-white.png')}
            source={require('~src/assets/images/button-more-disabled.png')}
            route={wrapper.route.More}
            controller={controller}
            {...props}
          />
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

export default FooterBar
