import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TargetedEvent, TextInputFocusEventData,
  TouchableWithoutFeedback,
} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {ContactsButton} from '~src/components/input/ContactsButton'
import {InputClearButton} from '~src/components/input/InputClearButton'
import {PasteButton} from '~src/components/input/PasteButton'
import {ScanButton} from '~src/components/input/ScanButton'
import {SelectedContactView} from '~src/components/input/SelectedContactView'
import {NeoURI} from '~src/helpers/UriHelper'
import {Contact} from '~src/models/redux/Contact'
import {RootState} from '~src/store/RootStore'
import {
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
  onContactSelected?: (contact: Contact) => void
  placeholder?: string
  secure?: boolean
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  editable?: boolean
  keyboardType?: KeyboardTypeOptions
  selectedContact?: Contact
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
      {!props.selectedContact ? (
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
            onBlur={props.onBlur}
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
            <InputClearButton
              onPress={props.onClearPress}
              value={props.value}
            />
          ) : (
            <LinearLayout height="34px" mb="-6px" />
          )}
        </LinearLayout>
      ) : (
        <SelectedContactView selectedContact={props.selectedContact} />
      )}

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
        {props.showContacts ? (
          <ContactsButton
            onPress={() => {
              navigation.navigate(Facade.route.ContactsModal.name, {
                onContactSelected: (contact: Contact) => {
                  if (props.onContactSelected) {
                    props.onContactSelected(contact)
                    navigation.goBack()
                  }
                },
              })
            }}
          />
        ) : (
          <LinearLayout weight={1} />
        )}

        {!props.hidePaste && (
          <PasteButton
            onPress={async () => {
              const valueFromClipboard = await Facade.utils.copyFromClipboard()
              if (props.onChangeText) {
                props.onChangeText(valueFromClipboard)
              }
            }}
          />
        )}
        {!props.hideScan && (
          <ScanButton
            onPress={() =>
              navigation.navigate(Facade.route.QRCodeScan.name, {
                onScan: props.onScan,
              })
            }
          />
        )}
      </LinearLayout>
    </LinearLayout>
  )
}

export default InputWithValidation
