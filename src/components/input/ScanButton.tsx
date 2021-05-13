import React from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export const ScanButton = (props: {onPress: () => any; disabled?: boolean}) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  return (
    <LinearLayout>
      <ButtonView onPress={props.onPress}>
        <LinearLayout orientation="horiz">
          {!props.disabled ? (
            <ImageView
              resizeMode="center"
              source={require('~/src/assets/images/icon-qrcode-green.png')}
            />
          ) : (
            <LinearLayout mt={-2}>
              <ImageView
                resizeMode="center"
                source={require('~/src/assets/images/qrcode-anticon.png')}
              />
            </LinearLayout>
          )}

          <TextView
            style={{includeFontPadding: false}}
            ml={3}
            color={props.disabled ? '#444c4a' : theme.colors.primary}
            fontFamily="semibold"
            fontSize={16}
          >
            {Facade.t('components.inputTextWithValidation.scan')}
          </TextView>
        </LinearLayout>
      </ButtonView>
    </LinearLayout>
  )
}
