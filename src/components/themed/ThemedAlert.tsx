import PropTypes from 'prop-types'
import React from 'react'
import {View} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export const ThemedAlert: React.FC = (props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  return (
    <LinearLayout bg={theme.colors.background[12]} alignItems={'center'}>
      <LinearLayout orientation={'horiz'} mt={'18px'} mb={'14px'}>
        <ImageView
          source={require('~/src/assets/images/icon-circle-check-green.png')}
          alignSelf={'center'}
          width={'35px'}
          height={'35px'}
          mt={'20px'}
          resizeMode={'contain'}
          mr={'14px'}
        />
        <LinearLayout alignSelf={'center'}>
          <TextView
            mt={'20px'}
            color={theme.colors.primary}
            fontFamily={'semibold'}
            fontSize={'12px'}
          >
            {Facade.t('toast.transaction').toUpperCase()}
          </TextView>
          <TextView fontSize={'18px'} color={theme.colors.text[0]}>
            {Facade.t('toast.gasClaimSucess')}
          </TextView>
        </LinearLayout>
      </LinearLayout>
      <LinearLayout bg={theme.colors.primary} width={'100%'} height={'5px'} />
    </LinearLayout>
  )
}
