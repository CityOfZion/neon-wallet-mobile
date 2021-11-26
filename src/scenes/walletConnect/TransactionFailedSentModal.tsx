import {RouteProp} from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import {useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface TransactionFailedSentModalParams {
  errorMessage?: string
}

interface Props {
  route: RouteProp<ModalStackParamList, 'TransactionFailedSentModal'>
}

const TransactionFailedSentModal = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const controller = useSwiperController(true)

  return (
    <SwiperPanel
      controller={controller}
      padding={20}
      fullSize={true}
      title={i18n.t('modals.transactionSuccessfullySent.title')}
      rightButton={<CloseButton mr={'20px'} />}
      onRightPress={controller.close}
      onClose={controller.close}
    >
      <LinearLayout
        orientation={'verti'}
        justifyContent={'center'}
        width={'100%'}
      >
        <LinearLayout
          orientation={'verti'}
          alignItems={'center'}
          width={'100%'}
          height={'80%'}
        >
          <ImageView
            alignSelf={'center'}
            resizeMode={'contain'}
            width={Normalize.scale(150)}
            height={Normalize.scale(150)}
            mb={30}
            source={require('~src/assets/images/ion-ios-close-outline_-_Ionicons_Copy_2.png')}
          />

          <TextView
            color={theme.colors.text[0]}
            fontSize={18}
            fontFamily="medium"
            textAlign={'center'}
            mb={15}
          >
            {i18n.t('modals.TransactionFailedSentModal.transactionFailed')}
          </TextView>

          <TextView
            color={theme.colors.text[2]}
            fontSize={16}
            fontFamily="medium"
            textAlign={'center'}
            mx={35}
            mb={30}
          >
            {i18n.t('modals.TransactionFailedSentModal.transactionText')}
          </TextView>

          <TextView
            color={theme.colors.text[2]}
            fontSize={14}
            fontFamily="medium"
            textAlign={'center'}
            mb={5}
          >
            {i18n
              .t('modals.TransactionFailedSentModal.transactionError')
              .toUpperCase()}
          </TextView>

          <TextView
            color={theme.colors.text[8]}
            fontSize={13}
            fontFamily="medium"
            width={'100%'}
            height={'15%'}
            bg={theme.colors.background[7]}
            px={5}
            py={2}
          >
            {props.route.params?.errorMessage ?? '4564564'}
          </TextView>
        </LinearLayout>

        <LinearLayout
          orientation={'verti'}
          justifyContent={'space-evenly'}
          alignItems={'center'}
          width={'100%'}
          height={'20%'}
        >
          <ThemedButton
            disabled={true}
            width={'90%'}
            label={'View transaction'}
          />
          <ThemedButton disabled={true} width={'90%'} label={'View on dora'} />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default TransactionFailedSentModal
