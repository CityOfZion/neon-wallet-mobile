import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { TextView, LinearLayout } from '~src/styles/styled-components'

export interface Step1CreateWalletParams {
  source?: keyof ModalStackParamList
}

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'Step1CreateWallet'>
}

const ItemComponent = (props: { index: number; title: string; body: string }) => {
  return (
    <LinearLayout mb={6} orientation="horiz">
      <LinearLayout
        mt={1}
        mr={3}
        height={Normalize.scale(26)}
        width={Normalize.scale(26)}
        borderRadius={Normalize.scale(13)}
        bg="primary"
        alignItems="center"
      >
        <TextView mt={1} color="black" fontSize="md" fontFamily="bold" style={{ includeFontPadding: false }}>
          {props.index}
        </TextView>
      </LinearLayout>

      <LinearLayout weight={1}>
        <TextView mr={4} color="text.0" fontSize="xl" fontFamily="bold">
          {props.title}
        </TextView>

        <TextView fontFamily="light" color="text.0" fontSize="lg">
          {props.body}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

const Step1CreateWalletPage: React.FC<Props> = props => {
  return (
    <ScreenLayout>
      <LinearLayout mt={5} weight={1} width="100%">
        <ItemComponent
          index={1}
          title={i18n.t('step1CreateWallet.label_1')}
          body={i18n.t('step1CreateWallet.body_1')}
        />
        <ItemComponent
          index={2}
          title={i18n.t('step1CreateWallet.label_2')}
          body={i18n.t('step1CreateWallet.body_2')}
        />
        <ItemComponent
          index={3}
          title={i18n.t('step1CreateWallet.label_3')}
          body={i18n.t('step1CreateWallet.body_3')}
        />
      </LinearLayout>

      <LinearLayout mt={5} mb={7} px={5} width="100%">
        <ThemedButton
          onPress={() => props.navigation.navigate(wrapper.route.Step2CreateWallet.name, undefined)}
          label={i18n.t('step1CreateWallet.createWallet')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

export default Step1CreateWalletPage
