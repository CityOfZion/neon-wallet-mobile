import i18n from 'i18n-js'
import React from 'react'
import {useSelector} from 'react-redux'

import {ResponseModalProps} from '../TransactionRequestModal'

import ThemedButton from '~/src/components/themed/ThemedButton'
import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export const SignMessageFailed = (props: ResponseModalProps) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <LinearLayout
      orientation={'verti'}
      alignItems={'center'}
      width={'100%'}
      paddingBottom={50}
      height="100%"
    >
      <LinearLayout height="100%" width="100%" justifyContent="space-between">
        <LinearLayout height="100%" justifyContent="center">
          <LinearLayout alignItems={'center'} width="100%">
            <ImageView
              alignSelf={'center'}
              resizeMode={'contain'}
              width={Normalize.scale(115)}
              height={Normalize.scale(110)}
              mb={22}
              mt={'5%'}
              source={require('~src/assets/images/ion-ios-close-outline_-_Ionicons_Copy_2.png')}
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
              {i18n.t('modals.signMessage.signMessageFailed')}
            </TextView>

            <TextView
              color={theme.colors.text[6]}
              fontSize={14}
              fontWeight={500}
              fontFamily="medium"
              textAlign={'center'}
              mb={4}
            >
              {i18n.t('modals.transactionSent.transactionError').toUpperCase()}
            </TextView>

            <TextView
              color={theme.colors.text[0]}
              fontSize={16}
              fontWeight={300}
              lineHeight="20px"
              fontFamily="light"
              width={'90%'}
              minHeight={'73px'}
              bg={theme.colors.background[7]}
              px={5}
              py={2}
              mb={'auto'}
            >
              {props.errorMessage}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
      <LinearLayout width="100%">
        <ThemedButton label="Done" onPress={props.onClose} />
      </LinearLayout>
    </LinearLayout>
  )
}
