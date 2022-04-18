import i18n from 'i18n-js'
import React from 'react'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {ResponseModalProps} from '../TransactionRequestModal'
import {ThemedButtonViewOnDora} from './ThemedButtonViewOnDora'
import {ThemedButtonViewTransaction} from './ThemedButtonViewTransaction'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import {UtilsHelper} from '~src/helpers/UtilsHelper'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

const TransactionSuccess = (props: ResponseModalProps) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <LinearLayout
      orientation={'verti'}
      alignItems={'center'}
      width={'100%'}
      height={'100%'}
    >
      <ImageView
        alignSelf={'center'}
        resizeMode={'contain'}
        width={Normalize.scale(115)}
        height={Normalize.scale(110)}
        mb={22}
        mt={'5%'}
        source={require('~src/assets/images/icon-circle-check-green.png')}
      />

      <TextView
        color={theme.colors.text[0]}
        fontSize={22}
        fontWeight={500}
        lineHeight="22px"
        fontFamily="medium"
        textAlign={'center'}
        mb={15}
      >
        {i18n.t('modals.transactionSent.transactionSent')}
      </TextView>

      <TextView
        color={theme.colors.text[6]}
        fontSize={18}
        fontWeight={400}
        fontFamily="regular"
        textAlign="center"
        lineHeight="22px"
        mx={48}
        mb={45}
      >
        {i18n.t('modals.transactionSent.transactionSuccessText')}
      </TextView>

      <TextView
        color={theme.colors.text[6]}
        fontSize={14}
        fontFamily="medium"
        fontWeight={500}
        textAlign="left"
        mb={3}
      >
        {i18n.t('modals.transactionSent.transactionId').toUpperCase()}
      </TextView>

      {props?.transactionHash && (
        <ButtonView
          orientation="horiz"
          alignItems="center"
          mb="auto"
          onPress={() => {
            UtilsHelper.copyToClipboard(props.transactionHash)
            showMessage({
              message: i18n.t('toast.copiedToClipboard'),
              type: 'success',
            })
          }}
        >
          <TextView
            maxWidth="80%"
            color="primary"
            fontSize="16px"
            fontWeight={500}
            fontFamily="medium"
            mr="16px"
            textAlign="center"
          >
            {props.transactionHash}
          </TextView>
          <ImageView
            width="16px"
            resizeMode="contain"
            source={require('~src/assets/images/icon-copy-green.png')}
          />
        </ButtonView>
      )}
      <ThemedButtonViewTransaction />
      {props.transactionHash && (
        <ThemedButtonViewOnDora txid={props.transactionHash} mt="10px" />
      )}
    </LinearLayout>
  )
}

export default TransactionSuccess
