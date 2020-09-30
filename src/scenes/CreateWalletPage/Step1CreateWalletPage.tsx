import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React from 'react'
import {TouchableOpacity, View} from 'react-native'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {TextView, LinearLayout, ImageView} from '~src/styles/styled-components'

export interface Step1CreateWalletParams {
  source?: keyof ModalStackParamList
}

interface Props {
  navigation: StackNavigationProp<TabStackParamList & MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'Step1CreateWallet'>
}

const CustomBackButton = (props: Props) => {
  const showButton =
    props.route.params?.source === Facade.route.WalletContextModal.name ||
    props.navigation.canGoBack()
  return (
    <View>
      {showButton && (
        <TouchableOpacity
          onPress={() => {
            if (
              props.route.params?.source ===
              Facade.route.WalletContextModal.name
            ) {
              props.navigation.navigate(Facade.route.ListWallets.name)
              props.navigation.pop()
            } else {
              if (props.navigation.canGoBack()) {
                props.navigation.goBack()
              }
            }
          }}
        >
          <LinearLayout orientation={'horiz'} alignItems={'center'}>
            <ImageView
              ml={4}
              mr={3}
              source={require('~src/assets/images/icon_arrow_left_white.png')}
            />

            <TextView
              mt={Facade.utils.isAndroid ? -2 : 2}
              fontSize={'lg'}
              color={'text.0'}
              style={{
                includeFontPadding: false,
              }}
            >
              {Facade.t('app.back')}
            </TextView>
          </LinearLayout>
        </TouchableOpacity>
      )}
    </View>
  )
}

const ItemComponent = (props: {index: number; title: string; body: string}) => {
  return (
    <LinearLayout mb={6} orientation={'horiz'}>
      <LinearLayout
        mt={1}
        mr={3}
        height={Facade.scale(26)}
        width={Facade.scale(26)}
        borderRadius={Facade.scale(13)}
        bg={'primary'}
        alignItems={'center'}
      >
        <TextView
          mt={1}
          color={'black'}
          fontSize={'md'}
          fontFamily={'bold'}
          style={{includeFontPadding: false}}
        >
          {props.index}
        </TextView>
      </LinearLayout>

      <LinearLayout weight={1}>
        <TextView mr={4} color={'text.0'} fontSize={'xl'} fontFamily={'bold'}>
          {props.title}
        </TextView>

        <TextView fontFamily={'light'} color={'text.0'} fontSize={'lg'}>
          {props.body}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

const Step1CreateWalletPage: React.FC<Props> = (props) => {
  props.navigation.setOptions({
    headerLeft: () => CustomBackButton(props),
  })

  return (
    <ScreenLayout alignX={'center'}>
      <LinearLayout mt={5} weight={1}>
        <TextView mb={5} color={'text.0'} fontSize={'lg'} pl={5}>
          {Facade.t('step1CreateWallet.header')}
        </TextView>

        <ItemComponent
          index={1}
          title={Facade.t('step1CreateWallet.label_1')}
          body={Facade.t('step1CreateWallet.body_1')}
        />
        <ItemComponent
          index={2}
          title={Facade.t('step1CreateWallet.label_2')}
          body={Facade.t('step1CreateWallet.body_2')}
        />
        <ItemComponent
          index={3}
          title={Facade.t('step1CreateWallet.label_3')}
          body={Facade.t('step1CreateWallet.body_3')}
        />
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
        <ThemedButton
          onPress={() =>
            props.navigation.navigate(Facade.route.Step2CreateWallet.name)
          }
          label={Facade.t('step1CreateWallet.createWallet')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step1CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

CustomBackButton.propTypes = {
  navigation: PropTypes.any,
}

export default Step1CreateWalletPage
