import {useAsyncStorage} from '@react-native-community/async-storage'
import {useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React from 'react'
import {SafeAreaView, ScrollView, TouchableOpacity} from 'react-native'
import {useSelector} from 'react-redux'

import {ROUTES} from '~/constants'
import ThemedButton from '~src/components/ThemedButton'
import ThemedCheckbox from '~src/components/ThemedCheckbox'
import i18n from '~src/i18n'
import {RootState} from '~src/store/reducers/root'
import {
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onClose?: (routeTargetName?: string) => void
}

const WelcomePage: React.FC<Props> = (props) => {
  const {setItem} = useAsyncStorage('@welcomeDontShow')

  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const headerHeight = useHeaderHeight()

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[1], theme.colors.background[2]]}
      start={[0.1, 0.1]}
      end={[1, 1]}
    >
      <SafeAreaView>
        <ScrollView>
          <RelativeLayout m={6} style={{alignItems: 'center'}}>
            <LinearLayout mb={5} alignItems={'center'}>
              <ImageView
                source={require('~/src/assets/images/logo-small.png')}
              />
              <TextView
                mt={-2}
                color={'text.0'}
                fontSize={'3xl'}
                letterSpacing={'3px'}
              >
                {i18n.t('welcome.brand')}
              </TextView>
            </LinearLayout>

            <TextView mb={5} color={'text.0'} fontSize={36} fontFamily={'bold'}>
              {i18n.t('welcome.title')}
            </TextView>

            <TextView
              mb={6}
              color={'text.0'}
              fontSize={'lg'}
              textAlign={'center'}
            >
              {i18n.t('welcome.body_1_1')}

              <TextView
                onPress={() => props.onClose?.(ROUTES.SETTINGS.name)}
                color={'primary'}
              >
                {i18n.t('welcome.body_1_2')}
              </TextView>

              {i18n.t('welcome.body_1_3')}

              <TextView
                onPress={() => props.onClose?.(ROUTES.LIST_WALLETS.name)}
                color={'primary'}
              >
                {i18n.t('welcome.body_1_4')}
              </TextView>
            </TextView>

            <TextView
              mb={6}
              color={'text.0'}
              fontSize={'lg'}
              textAlign={'center'}
            >
              {i18n.t('welcome.body_2_0')}
            </TextView>

            <LinearLayout mb={5} width={'100%'}>
              {/*TODO: change navigation target*/}
              <ThemedButton
                onPress={() => props.onClose?.(ROUTES.LIST_WALLETS.name)}
                label={i18n.t('welcome.button_1')}
                flat={true}
              />
            </LinearLayout>

            <LinearLayout mb={6} width={'100%'}>
              {/*TODO: change navigation target*/}
              <ThemedButton
                onPress={() => props.onClose?.(ROUTES.LIST_WALLETS.name)}
                label={i18n.t('welcome.button_2')}
              />
            </LinearLayout>

            <LinearLayout mb={7} width={'100%'}>
              {/*TODO: change navigation target*/}
              <ThemedButton
                onPress={() => props.onClose?.(ROUTES.LIST_WALLETS.name)}
                label={i18n.t('welcome.button_3')}
              />
            </LinearLayout>

            <LinearLayout mb={6} width={'100%'}>
              <ThemedCheckbox
                onChange={(checked) => setItem(String(checked))}
                label={i18n.t('welcome.checkbox_1')}
              />
            </LinearLayout>

            <TouchableOpacity
              onPress={() => props.onClose?.()}
              style={{
                position: 'absolute',
                right: 0,
                padding: 10,
              }}
            >
              <ImageView
                width={18}
                height={18}
                resizeMode={'contain'}
                source={require('~/src/assets/images/close.png')}
              />
            </TouchableOpacity>
          </RelativeLayout>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

WelcomePage.propTypes = {
  onClose: PropTypes.func,
}

export default WelcomePage
