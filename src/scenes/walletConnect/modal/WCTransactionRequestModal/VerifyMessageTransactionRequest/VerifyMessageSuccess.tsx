import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import ThemedButton from '~/src/components/themed/ThemedButton'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

export const VerifyMessageSuccess = () => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const navigation = useNavigation()

  function handleOnPress() {
    navigation.goBack()
  }

  return (
    <LinearLayout orientation="verti" justfyContent="center">
      <LinearLayout height="100%" justifyContent="space-between">
        <LinearLayout justifyContent="center" height="90%">
          <ImageView
            alignSelf="center"
            resizeMode="contain"
            width={Normalize.scale(115)}
            height={Normalize.scale(110)}
            mb={22}
            mt="5%"
            source={require('~src/assets/images/icon-circle-check-green.png')}
          />

          <TextView
            color={theme.colors.text[0]}
            fontSize={22}
            fontWeight={500}
            lineHeight="22px"
            fontFamily="medium"
            textAlign="center"
            mb={15}
          >
            {i18n.t('modals.verifyMessage.authenticateSuccess')}
          </TextView>
        </LinearLayout>
        <ThemedButton label="Done" onPress={handleOnPress} />
      </LinearLayout>
    </LinearLayout>
  )
}
