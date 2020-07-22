import React from 'react'
import {NativeSyntheticEvent, TargetedEvent} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {RootState} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
  InputTextView,
} from '~src/styles/styled-components'

interface Props {
  onChangeText: (text: string) => void
  color: string
  invalidColor?: string
  fontStyle?: string
  value: string
  validator: (text: string) => boolean
  invalidMessage?: string
  separatorColor: string
  invalidSeparatorColor?: string
  sideMargins?: number
  hidePaste?: boolean
  hideScan?: boolean
  placeholder?: string
  secure?: boolean
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void
}

const InputWithValidation = (props: Props) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const sideMargins = props.sideMargins ?? 20
  const fontStyle =
    props.value && props.validator(props.value)
      ? props.fontStyle ?? 'normal'
      : 'italic'

  const isValid = props.validator(props.value) || !props.value

  return (
    <LinearLayout orientation="verti" ml={sideMargins} mr={sideMargins}>
      <LinearLayout orientation="horiz">
        <InputTextView
          onChangeText={props.onChangeText}
          color={
            props.validator(props.value) ? props.color : props.invalidColor
          }
          placeholderTextColor={theme.colors.background[3]}
          underlineColorAndroid="transparent"
          placeholder={
            props.placeholder ??
            Facade.t('components.inputTextWithValidation.inputPlaceholder')
          }
          fontFamily="regular"
          fontStyle={fontStyle}
          fontSize={18}
          value={props.value}
          weight={1}
          autoCompleteType={props.secure ? 'password' : undefined}
          secureTextEntry={props.secure ?? false}
          onFocus={props.onFocus}
        />
        {!isValid && (
          <ImageView
            resizeMode={'center'}
            alignSelf="center"
            source={require('~/src/assets/images/icon-alert-purple.png')}
          />
        )}
      </LinearLayout>
      <LinearLayout
        mt={3}
        bg={
          props.validator(props.value)
            ? props.separatorColor
            : props.invalidSeparatorColor
        }
        height={1}
        width="100%"
      />
      {!isValid && (
        <TextView
          fontStyle="italic"
          color={theme.colors.background[5]}
          fontSize={12}
          fontFamily="regular"
          textAlign="right"
          mt={2}
        >
          {props.invalidMessage ??
            Facade.t('components.inputTextWithValidation.incorrectFormat')}
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
                {Facade.t('components.inputTextWithValidation.paste')}
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
                {Facade.t('components.inputTextWithValidation.scan')}
              </TextView>
            </LinearLayout>
          </ButtonView>
        )}
      </LinearLayout>
    </LinearLayout>
  )
}

export default InputWithValidation
