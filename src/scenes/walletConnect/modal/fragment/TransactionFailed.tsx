import i18n from 'i18n-js'
import React from 'react'
import {useSelector} from 'react-redux'

import {ThemedButtonViewOnDora} from './ThemedButtonViewOnDora'
import {ThemedButtonViewTransaction} from './ThemedButtonViewTransaction'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  errorMessage: string
}

const TransactionFailed = (props: Props) => {
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
        {i18n.t('modals.transactionSent.transactionFailed')}
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
        {i18n.t('modals.transactionSent.transactionFailText')}
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
      <ThemedButtonViewTransaction disable />
      <ThemedButtonViewOnDora txid={props.errorMessage} disable mt="10px" />
    </LinearLayout>
  )
}

export default TransactionFailed
