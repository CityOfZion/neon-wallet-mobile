import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React from 'react'

import {$} from '~/facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const Step1CreateWalletPage: React.FC<Props> = (props) => {
  const _renderItem = (index: number, title: string, body: string) => {
    return (
      <LinearLayout mb={6} orientation={'horiz'}>
        <LinearLayout
          mt={1}
          mr={3}
          height={$.space(26)}
          width={$.space(26)}
          borderRadius={$.space(13)}
          bg={'primary'}
          alignItems={'center'}
        >
          <TextView mt={1} color={'black'} fontSize={'md'} fontFamily={'bold'}>
            {index}
          </TextView>
        </LinearLayout>

        <LinearLayout weight={1}>
          <TextView
            mr={4}
            color={'primary'}
            fontSize={'xl'}
            fontFamily={'bold'}
          >
            {title}
          </TextView>

          <TextView color={'text.0'} fontSize={'lg'}>
            {body}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    )
  }

  return (
    <ScreenLayout alignX={'center'}>
      <LinearLayout mt={5} weight={1}>
        <TextView mb={5} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
          {$.t('step1CreateWallet.header')}
        </TextView>

        {_renderItem(
          1,
          $.t('step1CreateWallet.label_1'),
          $.t('step1CreateWallet.body_1')
        )}

        {_renderItem(
          2,
          $.t('step1CreateWallet.label_2'),
          $.t('step1CreateWallet.body_2')
        )}

        {_renderItem(
          3,
          $.t('step1CreateWallet.label_3'),
          $.t('step1CreateWallet.body_3')
        )}
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
        <ThemedButton
          onPress={() =>
            props.navigation.navigate($.path.Step2CreateWallet.name)
          }
          label={$.t('step1CreateWallet.createWallet')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step1CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step1CreateWalletPage
