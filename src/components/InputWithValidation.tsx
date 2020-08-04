import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TargetedEvent,
  TouchableWithoutFeedback,
} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {NeoURI} from '~src/helpers/UriHelper'
import {RootState} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
  InputTextView,
} from '~src/styles/styled-components'

interface Props {
  onChangeText?: (text: string) => void
  color: string
  placeholderColor?: string
  invalidColor?: string
  fontStyle?: string
  value: string
  validator: (text: string) => boolean
  invalidMessage?: string
  invalidMessageColor?: string
  separatorColor: string
  invalidSeparatorColor?: string
  sideMargins?: number
  hidePaste?: boolean
  hideScan?: boolean
  showContacts?: boolean
  onClearPress?: () => void
  onScan?: (data: NeoURI | string) => void
  placeholder?: string
  secure?: boolean
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void
  editable?: boolean
  keyboardType?: KeyboardTypeOptions
}

const InputWithValidation = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const navigation = useNavigation()
  const sideMargins = props.sideMargins ?? 20
  const fontStyle =
    props.value && props.validator(props.value)
      ? props.fontStyle ?? 'normal'
      : 'italic'
  const fontColor =
    props.validator(props.value) && props.value
      ? props.color
      : props.invalidColor

  const isValid = props.validator(props.value)

  return (
    <LinearLayout orientation="verti" ml={sideMargins} mr={sideMargins}>
      <LinearLayout orientation="horiz">
        <InputTextView
          onChangeText={props.onChangeText}
          color={fontColor}
          placeholderTextColor={props.placeholderColor ?? '#7d929a'}
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
          editable={props.editable ?? true}
          keyboardType={props.keyboardType}
        />
        {!isValid && (
          <ImageView
            resizeMode={'center'}
            alignSelf="center"
            source={require('~/src/assets/images/icon-alert-purple.png')}
          />
        )}
        {props.onClearPress && props.value.length > 0 ? (
          <TouchableWithoutFeedback
            onPress={props.onClearPress}
            disabled={!props.value}
          >
            <ImageView
              opacity={props.value ? 1 : 0}
              width="34px"
              height="34px"
              mb="-6px"
              resizeMode={'center'}
              alignSelf="center"
              source={require('~/src/assets/images/icon-cancel-grey.png')}
            />
          </TouchableWithoutFeedback>
        ) : (
          <LinearLayout height="34px" mb="-6px" />
        )}
      </LinearLayout>
      <LinearLayout
        mt={3}
        bg={
          props.validator(props.value)
            ? props.separatorColor
            : props.invalidSeparatorColor ?? props.separatorColor
        }
        height={1}
        width="100%"
      />

      <LinearLayout height="12px" justifyContent="flex-start">
        <TextView
          fontStyle="italic"
          color={props.invalidMessageColor ?? theme.colors.background[5]}
          fontSize={12}
          fontFamily="regular"
          textAlign="right"
          mt={2}
          opacity={isValid ? 0 : 1}
        >
          {props.invalidMessage ??
            Facade.t('components.inputTextWithValidation.incorrectFormat')}
        </TextView>
      </LinearLayout>

      <LinearLayout
        orientation="horiz"
        mt={5}
        flex={1}
        justifyContent={'space-between'}
      >
        {props.showContacts && (
          <ButtonView onPress={async () => {}}>
            <LinearLayout orientation="horiz">
              <ImageView
                resizeMode="center"
                source={require('~/src/assets/images/icon-contacts-green.png')}
              />

              <TextView
                style={{includeFontPadding: false}}
                ml={3}
                color={theme.colors.primary}
                fontFamily="semibold"
                fontSize={16}
                mr={6}
              >
                {Facade.t('components.inputTextWithValidation.contacts')}
              </TextView>
            </LinearLayout>
          </ButtonView>
        )}
        {!props.showContacts && <LinearLayout weight={1} />}

        {!props.hidePaste && (
          <LinearLayout>
            <ButtonView
              onPress={async () => {
                const valueFromClipboard = await Facade.utils.copyFromClipboard()
                if (props.onChangeText) {
                  props.onChangeText(valueFromClipboard)
                }
              }}
            >
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
          </LinearLayout>
        )}
        {!props.hideScan && (
          <LinearLayout>
            <ButtonView
              onPress={() =>
                navigation.navigate(Facade.route.QRCodeScan.name, {
                  onScan: props.onScan,
                })
              }
            >
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
          </LinearLayout>
        )}
      </LinearLayout>
    </LinearLayout>
  )
}

export default InputWithValidation
