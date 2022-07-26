import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootState } from '~/src/store/RootStore'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export const ScanButton = (props: { onPress: () => any; disabled?: boolean }) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  return (
    <LinearLayout>
      <ButtonView onPress={props.onPress}>
        <LinearLayout orientation="horiz">
          {!props.disabled ? (
            <ImageView source={require('~/src/assets/images/icon-qrcode-green.png')} />
          ) : (
            <LinearLayout mt={-2}>
              <ImageView source={require('~/src/assets/images/qrcode-anticon.png')} />
            </LinearLayout>
          )}

          <TextView
            style={{ includeFontPadding: false }}
            ml={3}
            color={props.disabled ? '#444c4a' : theme.colors.primary}
            fontFamily="semibold"
            fontSize={16}
          >
            {i18n.t('components.inputTextWithValidation.scan')}
          </TextView>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}
