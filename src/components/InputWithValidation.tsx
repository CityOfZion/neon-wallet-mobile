import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useState, useEffect } from 'react'
import {
  ImageLoadEventData,
  Keyboard,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TargetedEvent,
  TextInputFocusEventData,
  Platform,
  Dimensions,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Normalize } from '~src/app/Normalize'
import { ContactsButton } from '~src/components/input/ContactsButton'
import { InputClearButton } from '~src/components/input/InputClearButton'
import { PasteButton } from '~src/components/input/PasteButton'
import { ScanButton } from '~src/components/input/ScanButton'
import { SelectedContactView } from '~src/components/input/SelectedContactView'
import { IURI } from '~src/helpers/UriHelper'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { SendModalStackParamList } from '~src/navigation/SendModalStackNavigation'
import { RootState, RootStore } from '~src/store/RootStore'
import { ImageView, LinearLayout, TextView, InputTextView } from '~src/styles/styled-components'

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
  onScan?: (data: IURI | string) => void
  onSelected?: (item: Contact | Account, addressSelected?: string) => void
  placeholder?: string
  secure?: boolean
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  editable?: boolean
  keyboardType?: KeyboardTypeOptions
  selectedContact?: Contact
  srcIcon?: ImageLoadEventData
  iconSize?: [number, number]
  isMultiline?: boolean
  fromImportKey?: boolean
  addressSelected?: string
  forceClearButton?: boolean
  autoCapitalize?: string
}

const InputWithValidation = (props: Props) => {
  const dispatchAccount = useDispatch<SyncDispatch<Account>>()
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const width = Normalize.scale(props.iconSize ? props.iconSize[0] : 25)
  const height = Normalize.scale(props.iconSize ? props.iconSize[1] : 25)
  const account = dispatchAccount(RootStore.account.actions.getFromSelection())
  const navigation = useNavigation<StackNavigationProp<ModalStackParamList & SendModalStackParamList>>()
  const navigationScan = useNavigation<StackNavigationProp<RootStackParamList>>()
  const sideMargins = props.sideMargins ?? 20

  const isInvalid = props.value ? !props.validator(props.value) : undefined

  const fontStyle = isInvalid ? 'italic' : props.fontStyle ?? 'normal'

  const fontColor = isInvalid ? props.invalidColor : props.color

  const [contact, setContact] = useState<Contact | undefined>(props.selectedContact)

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setContact(props.selectedContact)
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  const handleChangeText = (text: string) => {
    if (props.onChangeText) props.onChangeText(UtilsHelper.clearText(text))
  }

  useEffect(() => {
    setContact(props.selectedContact)
  }, [props.selectedContact])

  return (
    <LinearLayout orientation="verti" ml={sideMargins} mr={sideMargins} flex={1}>
      {!contact ? (
        <LinearLayout orientation="horiz">
          {props.srcIcon && (
            <ImageView
              width={width as number}
              height={height as number}
              mr={props.value ? 3 : undefined}
              resizeMode="contain"
              source={props.srcIcon}
              alignSelf="center"
            />
          )}
          <LinearLayout
            bg={props.fromImportKey ? theme.colors.background[12] : undefined}
            borderColor={isInvalid ? theme.colors.quinary : theme.colors.background[12]}
            borderRadius={10}
            borderWidth={props.fromImportKey ? 1 : 0}
            width="100%"
            orientation="horiz"
            p={props.fromImportKey ? '2%' : undefined}
          >
            <InputTextView
              autoCapitalize={props.autoCapitalize ?? 'none'}
              onChangeText={handleChangeText}
              color={fontColor}
              placeholderTextColor={props.placeholderColor ?? '#7d929a'}
              underlineColorAndroid="transparent"
              placeholder={props.placeholder ?? i18n.t('components.inputTextWithValidation.inputPlaceholder')}
              fontFamily="regular"
              fontStyle={fontStyle}
              fontSize={18}
              value={props.value}
              weight={props.isMultiline ? 4 : 1}
              autoCompleteType={props.secure ? 'password' : undefined}
              secureTextEntry={props.secure ?? false}
              onFocus={props.onFocus}
              onBlur={handleBlur}
              editable={props.editable ?? true}
              keyboardType={props.keyboardType}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              multiline={Platform.OS === 'ios' ? true : props.isMultiline}
              numberOfLines={props.isMultiline ? 10 : 1}
              style={props.isMultiline ? { textAlignVertical: 'top' } : undefined}
              clearTextOnFocus={false}
              height={props.isMultiline && Platform.OS === 'ios' ? Dimensions.get('screen').height * 0.25 : undefined}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {!props.isMultiline && isInvalid && (
                <ImageView
                  resizeMode="center"
                  alignSelf="center"
                  source={require('~/src/assets/images/icon-alert-purple.png')}
                />
              )}
              {(props.onClearPress && props.value.length > 0) ||
                (props.onClearPress && props.forceClearButton && <InputClearButton onPress={props.onClearPress} />)}
            </View>
          </LinearLayout>
        </LinearLayout>
      ) : (
        <SelectedContactView
          selectedContact={contact}
          onClick={() => setContact(undefined)}
          addressSelected={props.addressSelected}
        />
      )}

      {!props.fromImportKey && (
        <LinearLayout
          mt={1}
          bg={isInvalid ? props.invalidSeparatorColor ?? props.separatorColor : props.separatorColor}
          height={1}
          width="100%"
        />
      )}
      {!props.isMultiline && (
        <LinearLayout height="12px" justifyContent="flex-start">
          <TextView
            fontStyle="italic"
            color={props.invalidMessageColor ?? theme.colors.background[5]}
            fontSize={12}
            fontFamily="regular"
            textAlign="right"
            mt={2}
            opacity={isInvalid ? 1 : 0}
            height={Platform.OS === 'ios' ? '15px' : undefined}
          >
            {props.invalidMessage ?? i18n.t('components.inputTextWithValidation.incorrectFormat')}
          </TextView>
        </LinearLayout>
      )}

      <LinearLayout orientation="horiz" mt={5} flex={1} justifyContent="space-between">
        {props.showContacts ? (
          <ContactsButton
            onPress={() => {
              navigation.navigate(wrapper.route.ContactsModal.name, {
                onSelected: (item: Contact | Account, addressSelected?: string) => {
                  if (props.onSelected) {
                    props.onSelected(item, addressSelected)
                    navigation.navigate(wrapper.route.SendTransactionInputModal.name, {
                      account,
                      walletTitle: '',
                    })
                  }
                },
                filterByBlockchain: account.blockchain,
              })
            }}
          />
        ) : (
          <LinearLayout weight={1} />
        )}
        {!props.hidePaste && (
          <PasteButton
            onPress={async () => {
              const valueFromClipboard = await UtilsHelper.copyFromClipboard()
              if (props.onChangeText) {
                props.onChangeText(valueFromClipboard.trim())
              }
            }}
          />
        )}
        {!props.hideScan && (
          <ScanButton
            disabled={props.isMultiline}
            onPress={() =>
              props.isMultiline
                ? undefined
                : navigationScan.navigate(wrapper.route.QRCodeScan.name, {
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
