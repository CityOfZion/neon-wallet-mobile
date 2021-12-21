import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AppMetadata} from '@walletconnect/types'
import i18n from 'i18n-js'
import React from 'react'
import {TouchableOpacity, ScrollView} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {UtilsHelper} from '~/src/helpers/UtilsHelper'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {LinearLayout, TextView, ImageView} from '~src/styles/styled-components'
type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface RawJsonModalParams {
  dataJson: string
  metadata: AppMetadata
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'RawJsonModal'>
}

const RawJsonModal = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const controller = useSwiperController(true)

  return (
    <SwiperPanel
      controller={controller}
      padding={20}
      fullSize={true}
      title={i18n.t('modals.rawJson.title')}
      rightButton={<CloseButton mr={'20px'} />}
      onRightPress={controller.close}
      onClose={props.navigation.goBack}
      solidColorBG
      disableDefaultScrollView={true}
    >
      <LinearLayout mb={'20%'}>
        <LinearLayout alignSelf={'center'}>
          <LinearLayout
            borderRadius={'4px'}
            padding={5}
            width={'77px'}
            height={'75px'}
            backgroundColor={'#1c2228'}
            alignSelf={'center'}
          >
            <ImageView
              height={'100%'}
              width={'100%'}
              resizeMode={'contain'}
              // TODO: Just change the source for the source bellow
              //source={{uri: props.route.params.metadata.icons[0]}}
              source={require('~src/assets/ic_launcher.png')}
              alignSelf={'center'}
            />
          </LinearLayout>
          <TextView
            fontSize={'18px'}
            fontFamily={'medium'}
            color={'white'}
            mt={'13px'}
            textAlign={'center'}
          >
            props.route.params.metadata.name
          </TextView>
        </LinearLayout>
        <LinearLayout>
          <LinearLayout
            orientation={'horiz'}
            width={'100%'}
            justifyContent={'space-between'}
            mt={'30px'}
            mb={'7px'}
          >
            <TextView
              fontSize={'18px'}
              fontFamily={'medium'}
              color={theme.colors.text[10]}
            >
              {i18n.t('modals.rawJson.data')}
            </TextView>
            <TouchableOpacity
              onPress={() => {
                if (props.route.params.dataJson) {
                  UtilsHelper.copyToClipboard(props.route.params.dataJson)
                  showMessage({
                    message: i18n.t('toast.copiedToClipboard'),
                    type: 'success',
                  })
                }
              }}
            >
              <ImageView
                width={'20px'}
                height={'20px'}
                resizeMode={'contain'}
                source={require('~src/assets/images/icon-copy-green.png')}
              />
            </TouchableOpacity>
          </LinearLayout>
          <LinearLayout
            bg={theme.colors.background[1]}
            borderRadius={'7px'}
            width={'100%'}
            height={'70%'}
            px={'22px'}
            py={'11px'}
          >
            <ScrollView>
              <TextView fontFamily={'light'} fontSize={'16px'} color={'white'}>
                {props.route.params.dataJson}
              </TextView>
            </ScrollView>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default RawJsonModal
