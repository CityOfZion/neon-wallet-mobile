import { StackNavigationProp } from '@react-navigation/stack'
import I18n from 'i18n-js'
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import InputLabel from '~/src/components/InputLabel'
import { TokenAsset } from '~/src/models/TokenAsset'
import { Account } from '~/src/models/redux/Account'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { SendModalStackParamList } from '~/src/navigation/SendModalStackNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { ButtonView, LinearLayout, ImageView, TextView } from '~/src/styles/styled-components'

const TokenField = (props: {
  navigation: StackNavigationProp<ModalStackParamList & SendModalStackParamList & WalletStackParamList>
  account: Account
  token: TokenAsset | null | undefined
  setToken: React.Dispatch<React.SetStateAction<TokenAsset | null | undefined>>
  tokenFromUri: boolean
}) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <>
      <InputLabel
        title={I18n.t('modals.send.transactionInput.token')}
        color="text.0"
        marginTop={50}
        marginBottom={30}
        capitalize
      />

      <ButtonView
        onPress={
          !props.tokenFromUri
            ? () => {
                props.navigation.navigate(wrapper.route.ListTokenModal.name, {
                  selectedToken: props.token,
                  setToken: props.setToken,
                  account: props.account,
                  filterBy: 'send',
                })
              }
            : undefined
        }
      >
        <LinearLayout borderBottomWidth={1} borderBottomColor={theme.colors.background[13]} orientation="horiz">
          {!!props.token?.srcIcon && (
            <ImageView
              resizeMode="contain"
              width={Normalize.scale(25)}
              height={Normalize.scale(25)}
              source={props.token?.srcIcon}
              mr="8px"
            />
          )}
          <TextView
            fontSize={18}
            fontFamily="regular"
            color={props.token?.name ? theme.colors.text[0] : '#7d929a'}
            fontStyle={props.token?.name ? 'normal' : 'italic'}
            pt={2}
            pb={2}
          >
            {props.token?.name ?? I18n.t('modals.send.transactionInput.selectToken')}
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

export default TokenField
