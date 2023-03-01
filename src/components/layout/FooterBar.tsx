import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useRef } from 'react'
import { Animated, Easing, ImageSourcePropType } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Shadow } from 'react-native-shadow-2'
import { useSelector } from 'react-redux'

import { AlterMenuItem } from '../AlterMenuItem'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { UriHelper } from '~/src/helpers/UriHelper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useBlockchainActions } from '~/src/hooks/useBlockchainActions'
import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { RouteName } from '~/src/types/wrappers/route'
import { Route } from '~src/app/Route'
import SwiperPanel, { SwiperController, useSwiperController } from '~src/components/SwiperPanel'
import { ButtonView, ImageView, LinearLayout } from '~src/styles/styled-components'

interface TabButtonContent {
  enabledSource: ImageSourcePropType
  disabledSource: ImageSourcePropType
  route: Route<RouteName>
}

interface TabButtonProps {
  button: TabButtonContent
  controller: SwiperController
}

interface QuickToolsMenuProps {
  controller: SwiperController
}

type NavigationProps = StackNavigationProp<RootStackParamList & ModalStackParamList & WalletStackParamList>

const QuickToolsMenu = ({ controller }: QuickToolsMenuProps) => {
  const navigation = useNavigation<NavigationProps>()
  const blockchainActions = useBlockchainActions()
  const accounts = useSelector(selectAccounts)
  const {
    getBlockchainService,
    validateAddressAllBlockchains,
    validatePrivateKeyWithPasswordAllBlockchains,
    validateWifAllBlockchains,
    getBlockchainByWif,
  } = useBlockchainServiceUtils()

  const handleScanQrCode = async (data: string) => {
    const sendUri = UriHelper.validateAndParse(data)

    if (sendUri && validateAddressAllBlockchains(sendUri.address)) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.SendTransactionWalletSelectionModal.name,
        params: {
          address: sendUri.address,
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

    if (validatePrivateKeyWithPasswordAllBlockchains(data)) {
      navigation.navigate(wrapper.route.Tab.name, {
        screen: wrapper.route.More.name,
        params: {
          screen: wrapper.route.Passphrase.name,
          initial: false,
          params: {
            encryptedKey: data,
          },
        },
      })
      return
    }

    if (validateWifAllBlockchains(data)) {
      const blockchain = getBlockchainByWif(data)
      if (blockchain) {
        const service = getBlockchainService(blockchain)
        const address = service.generateAccountFromWif(data)

        if (accounts.some(account => account.address === address)) {
          showMessage({ message: i18n.t('quickTools.qrCode.accountAlreadyExists') })
          return
        }

        const wallet = await blockchainActions.createWallet(i18n.t('modals.blockchainList.encryptedWallet'), 'legacy')

        await blockchainActions.importAccounts([{ address, blockchain, type: 'legacy', wallet, wif: data }])

        const account = accounts.find(account => account.address === address)

        if (!account || !wallet) return

        navigation.navigate(wrapper.route.GetWallet.name, { wallet })
        navigation.navigate(wrapper.route.GetAccount.name, { account, wallet })
        navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.EditAccountModal.name,
          params: { account },
        })
      }
    }
  }

  const handlePressQrCode = () => {
    navigation.navigate(wrapper.route.QRCodeScan.name, {
      onScan: handleScanQrCode,
    })
  }

  const handlePressSend = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionWalletSelectionModal.name,
      params: {},
    })
  }

  const handlePressReceive = () => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.ReceiveTransactionWalletSelectionModal.name,
      params: {},
    })
  }

  const runClosing = (callback: () => void) => {
    controller.close()
    callback()
  }

  return (
    <SwiperPanel controller={controller} solidColorBG paddingBottom={applicationConfig.footerHeight}>
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
        props.navigation.navigate(props.button.route.name)
      }}
      height="100%"
      weight={1}
      alignItems="center"
      justifyContent="center"
    >
      <ImageView
        resizeMode="cover"
        source={
          props.state.routes[props.state.index].name === props.button.route.name
            ? props.button.enabledSource
            : props.button.disabledSource
        }
      />
    </ButtonView>
  )
}

const FooterBar: React.FC<BottomTabBarProps> = (props: BottomTabBarProps) => {
  const { state, descriptors } = props
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
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

  const walletButton = {
    enabledSource: require('~src/assets/images/button-wallet-white.png'),
    disabledSource: require('~src/assets/images/button-wallet-disabled.png'),
    route: wrapper.route.ListWallets,
  }
  const dappsButton = {
    enabledSource: require('~src/assets/images/button-connections-white.png'),
    disabledSource: require('~src/assets/images/button-connections-disabled.png'),
    route: wrapper.route.WalletConnectPage,
  }
  const contactsButton = {
    enabledSource: require('~src/assets/images/button-contacts-white.png'),
    disabledSource: require('~src/assets/images/button-contacts-disabled.png'),
    route: wrapper.route.Contacts,
  }
  const moreButton = {
    enabledSource: require('~src/assets/images/button-more-white.png'),
    disabledSource: require('~src/assets/images/button-more-disabled.png'),
    route: wrapper.route.More,
  }

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

      <LinearLayout
        width="100%"
        height={applicationConfig.footerHeight}
        zIndex={1001}
        bottom={-1}
        position="absolute"
        orientation="horiz"
      >
        <Shadow
          distance={12}
          sides={['top']}
          startColor={`${theme.colors.black}33`}
          containerViewStyle={{ width: '100%', height: '100%' }}
          viewStyle={{
            width: '100%',
            height: '100%',
            flexDirection: 'row',
          }}
        >
          <>
            <ImageView
              position="absolute"
              bottom={0}
              width={'100%' as any}
              source={require('~src/assets/images/TabBar.png')}
            />
            <TabButton {...props} button={walletButton} controller={controller} />
            <TabButton {...props} button={dappsButton} controller={controller} />
            <ButtonView mx="6px" bottom="10px" onPress={controller.toggle}>
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
            <TabButton {...props} button={contactsButton} controller={controller} />
            <TabButton {...props} button={moreButton} controller={controller} />
          </>
        </Shadow>
      </LinearLayout>
    </LinearLayout>
  )
}

export default FooterBar
