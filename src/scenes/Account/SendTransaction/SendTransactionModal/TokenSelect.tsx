import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import InputLabel from '~/src/components/InputLabel'
import { TokenHelper } from '~/src/helpers/TokenHelper'
import { TokenAsset } from '~/src/models/TokenAsset'
import { Account } from '~/src/models/redux/Account'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { ButtonView, ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  token?: TokenAsset
  onTokenChange(token: TokenAsset): void
  account: Account
}

export const TokenSelect = ({ onTokenChange, account, token }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()

  const handlePress = () => {
    navigation.navigate(wrapper.route.ListTokenModal.name, {
      onChangeToken: onTokenChange,
      account,
      filterBy: 'send',
    })
  }

  return (
    <>
      <InputLabel
        title={i18n.t('modals.sendTransactionModal.token')}
        color="text.0"
        marginTop={50}
        marginBottom={30}
        capitalize
      />

      <ButtonView onPress={handlePress}>
        <LinearLayout borderBottomWidth={1} borderBottomColor={theme.colors.background[13]} orientation="horiz">
          {!!token && (
            <ImageView
              resizeMode="contain"
              width={Normalize.scale(25)}
              height={Normalize.scale(25)}
              source={TokenHelper.getIcon(token.symbol, account.blockchain)}
              mr="8px"
            />
          )}

          <TextView
            fontSize={18}
            fontFamily="regular"
            color={token?.name ? theme.colors.text[0] : theme.colors.text[10]}
            fontStyle={token?.name ? 'normal' : 'italic'}
            pt={2}
            pb={2}
          >
            {token?.name ?? i18n.t('modals.sendTransactionModal.selectToken')}
          </TextView>
          <ImageView
            position="absolute"
            top="10px"
            right="15px"
            resizeMode="contain"
            width={Normalize.scale(12)}
            source={require('~/src/assets/images/icon-arrow-down-green.png')}
          />
        </LinearLayout>
      </ButtonView>
    </>
  )
}
