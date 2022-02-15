import {StackNavigationProp} from '@react-navigation/stack'
import I18n from 'i18n-js'
import React, {Fragment, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import {TokenAsset} from '~/src/models/TokenAsset'
import {Account} from '~/src/models/redux/Account'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {SendModalStackParamList} from '~/src/navigation/SendModalStackNavigation'
import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {
  ButtonView,
  LinearLayout,
  ImageView,
} from '~/src/styles/styled-components'

const TokenField = (props: {
  navigation: StackNavigationProp<
    ModalStackParamList & SendModalStackParamList & WalletStackParamList
  >
  account: Account
  token: TokenAsset | null | undefined
  setToken: React.Dispatch<React.SetStateAction<TokenAsset | null | undefined>>
  tokenFromUri: boolean
}) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <Fragment>
      <InputLabel
        title={I18n.t('modals.send.transactionInput.token')}
        color={'text.0'}
        marginTop={50}
        marginBottom={30}
        capitalize={true}
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
        <LinearLayout position="relative">
          <InputWithValidation
            color={theme.colors.text[0]}
            invalidColor={theme.colors.text[10]}
            fontStyle={'normal'}
            value={props.token?.name ?? ''}
            placeholder={I18n.t('modals.send.transactionInput.selectToken')}
            validator={() => true}
            separatorColor={theme.colors.background[13]}
            sideMargins={0}
            hidePaste={true}
            hideScan={true}
            editable={false}
            srcIcon={props.token?.srcIcon}
          />
          <ImageView
            position="absolute"
            top="10px"
            right="15px"
            resizeMode="contain"
            width="12px"
            source={require('~/src/assets/images/icon-arrow-down-green.png')}
          />
        </LinearLayout>
      </ButtonView>
    </Fragment>
  )
}

export default TokenField
