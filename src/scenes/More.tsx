import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {DefaultTheme} from 'styled-components'

import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface MoreProps {
  navigation: StackNavigationProp<{Modal: {screen: string}}>
  theme: DefaultTheme
  navigationOptions: object
}

const More = (props: MoreProps) => {
  const headerHeight = useHeaderHeight()

  return (
    <LinearLayout bg="background.0" alignItems="center" height="100%">
      <LinearLayout height={headerHeight} />
      <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
        <LinearLayout
          alignItems="center"
          orientation="horiz"
          height={65}
          width="100%"
          mt={50}
        >
          <ImageView
            height={28}
            width={28}
            source={require('~/src/assets/images/wallet-icon-green.png')}
          />
          <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
            My Wallets
          </TextView>
          <LinearLayout weight={1} />
          <ImageView
            width={12}
            height={19}
            source={require('~/src/assets/images/icon-arrow-right-green.png')}
          />
        </LinearLayout>
        <LinearLayout height={1} backgroundColor="#667178" width="100%" />
      </LinearLayout>
      <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
        <LinearLayout
          alignItems="center"
          orientation="horiz"
          height={65}
          width="100%"
          pl={2}
        >
          <ImageView
            height={26}
            width={20}
            mr={2}
            source={require('~/src/assets/images/security-icon-green.png')}
          />
          <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
            Security
          </TextView>
          <LinearLayout weight={1} />
          <ImageView
            width={12}
            height={19}
            source={require('~/src/assets/images/icon-arrow-right-green.png')}
          />
        </LinearLayout>
        <LinearLayout height={1} backgroundColor="#667178" width="100%" />
      </LinearLayout>
      <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
        <LinearLayout
          alignItems="center"
          orientation="horiz"
          height={65}
          width="100%"
          pl={1}
        >
          <ImageView
            height={18}
            width={26}
            source={require('~/src/assets/images/currency-icon-green.png')}
          />
          <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
            Currency
          </TextView>
          <LinearLayout weight={1} />
          <TextView fontSize={16} fontFamily="semibold" mr={3} color="#869ca5">
            USD
          </TextView>
          <ImageView
            width={18}
            height={12}
            source={require('~/src/assets/images/icon-arrow-down-green.png')}
          />
        </LinearLayout>
        <LinearLayout height={1} backgroundColor="#667178" width="100%" />
      </LinearLayout>
      <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
        <LinearLayout
          alignItems="center"
          orientation="horiz"
          height={65}
          width="100%"
          pl={2}
        >
          <ImageView
            height={18}
            width={16}
            mr={3}
            source={require('~/src/assets/images/language-icon-green.png')}
          />
          <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
            Language
          </TextView>
          <LinearLayout weight={1} />
          <TextView fontSize={16} fontFamily="semibold" mr={3} color="#869ca5">
            English
          </TextView>
          <ImageView
            width={18}
            height={12}
            source={require('~/src/assets/images/icon-arrow-down-green.png')}
          />
        </LinearLayout>
        <LinearLayout height={1} backgroundColor="#667178" width="100%" />
      </LinearLayout>
      <LinearLayout orientation="verti" width="100%" pr={20} pl={20}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('Modal', {screen: 'SampleModal'})
          }}
        >
          <LinearLayout
            alignItems="center"
            orientation="horiz"
            height={65}
            width="100%"
            mt={50}
          >
            <ImageView
              height={28}
              width={28}
              source={require('~/src/assets/images/wallet-icon-green.png')}
            />
            <TextView ml={12} color="white" fontSize={18} fontFamily="semibold">
              Sample Modal
            </TextView>
            <LinearLayout weight={1} />
            <ImageView
              width={12}
              height={19}
              source={require('~/src/assets/images/icon-arrow-right-green.png')}
            />
          </LinearLayout>
        </TouchableWithoutFeedback>
      </LinearLayout>
    </LinearLayout>
  )
}

export default More
