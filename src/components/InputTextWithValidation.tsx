import React from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {RootState} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
  InputTextView
} from '~src/styles/styled-components'

function InputWithValidation(props: {
  onChangeText: (text: string) => void
  color: string
  fontStyle: string
  value: string
  inputIsValid: boolean
  separatorColor: string
  sideMargins?: number
  hidePaste?: boolean
  hideScan?: boolean
}) {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const sideMargins = props.sideMargins ? props.sideMargins : 20
  return (
    <LinearLayout orientation="verti" ml={sideMargins} mr={sideMargins}>
      <LinearLayout orientation="horiz">
        <InputTextView
          onChangeText={props.onChangeText}
          color={props.color}
          placeholderTextColor={theme.colors.background[3]}
          underlineColorAndroid="transparent"
          placeholder={Facade.t('importKey.inputPlaceholder')}
          fontFamily="regular"
          fontStyle={props.fontStyle}
          fontSize={18}
          value={props.value}
          weight={1}
        />
        {props.value.length > 0 && !props.inputIsValid && (
          <ImageView
            resizeMode={'center'}
            alignSelf="center"
            source={require('~/src/assets/images/icon-alert-purple.png')}
          />
        )}
      </LinearLayout>
      <LinearLayout mt={3} bg={props.separatorColor} height={1} width="100%" />
      {props.value.length > 0 && !props.inputIsValid && (
        <TextView
          fontStyle="italic"
          color={theme.colors.background[5]}
          fontSize={12}
          fontFamily="regular"
          textAlign="right"
          mt={2}
        >
          {Facade.t('importKey.incorrectFormat')}
        </TextView>
      )}
      <LinearLayout orientation="horiz" mt={5}>
        <LinearLayout weight={1} />
        {!props.hidePaste && (
          <ButtonView>
            <LinearLayout orientation="horiz">
              <ImageView
                resizeMode="center"
                source={require('~/src/assets/images/icon-paste-green.png')}
              />

              <TextView
                style={{includeFontPadding: false}}
                ml={3}
                color={theme.colors.primary}
                fontFamily="semibold"
                fontSize={16}
                mr={6}
              >
                {Facade.t('importKey.paste')}
              </TextView>
            </LinearLayout>
          </ButtonView>
        )}
        {!props.hideScan && (
          <ButtonView>
            <LinearLayout orientation="horiz">
              <ImageView
                resizeMode="center"
                source={require('~/src/assets/images/icon-qrcode-green.png')}
              />

              <TextView
                style={{includeFontPadding: false}}
                ml={3}
                color={theme.colors.primary}
                fontFamily="semibold"
                fontSize={16}
              >
                {Facade.t('importKey.scan')}
              </TextView>
            </LinearLayout>
          </ButtonView>
        )}
      </LinearLayout>
    </LinearLayout>
  )
}

export default InputWithValidation
