import {RouteProp} from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {UtilsHelper} from '~src/helpers/UtilsHelper'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface TransactionSuccessfullySentModalParams {
  transactionHash?: string
}

interface Props {
  route: RouteProp<ModalStackParamList, 'TransactionSuccessfullySentModal'>
}

const TransactionSuccessfullySentModal = (props: Props) => {
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
            source={require('~src/assets/images/icon-circle-check-green.png')}
          />

          <TextView
            color={theme.colors.text[0]}
            fontSize={18}
            fontFamily="medium"
            textAlign={'center'}
            mb={15}
          >
            {i18n.t('modals.transactionSuccessfullySent.transactionSent')}
          </TextView>

          <TextView
            color={theme.colors.text[2]}
            fontSize={16}
            fontFamily="medium"
            textAlign={'center'}
            mb={30}
          >
            {i18n.t('modals.transactionSuccessfullySent.transactionText')}
          </TextView>

          <TextView
            color={theme.colors.text[2]}
            fontSize={18}
            fontFamily="medium"
            textAlign={'center'}
          >
            {i18n
              .t('modals.transactionSuccessfullySent.transactionId')
              .toUpperCase()}
          </TextView>

          <ButtonView
            orientation="horiz"
            alignItems="center"
            mb="24px"
            onPress={() => {
              UtilsHelper.copyToClipboard(props.route.params?.transactionHash)
              showMessage({
                message: i18n.t('toast.copiedToClipboard'),
                type: 'success',
              })
            }}
          >
            <TextView
              maxWidth="80%"
              color="primary"
              fontSize="14px"
              fontFamily="medium"
              mr="16px"
              textAlign="center"
            >
              {props.route.params?.transactionHash}
            </TextView>
            <ImageView
              width="16px"
              resizeMode="contain"
              source={require('~src/assets/images/icon-copy-green.png')}
            />
          </ButtonView>
        </LinearLayout>

        <LinearLayout
          orientation={'verti'}
          justifyContent={'space-evenly'}
          alignItems={'center'}
          width={'100%'}
          height={'20%'}
        >
          <ThemedButton
            width={'90%'}
            label={'View transaction'}
            onPress={() => 1}
          />
          <ThemedButton
            width={'90%'}
            label={'View on dora'}
            onPress={() => 1}
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default TransactionSuccessfullySentModal
