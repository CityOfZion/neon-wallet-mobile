import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import {
  Keyboard,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TargetedEvent,
  TextInputFocusEventData,
  Platform,
  Dimensions,
  View,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey } from '../blockchain'
import { ContactAddresses } from '../types/reducers/contact'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Normalize } from '~src/app/Normalize'
import { ContactsButton } from '~src/components/input/ContactsButton'
import { InputClearButton } from '~src/components/input/InputClearButton'
import { PasteButton } from '~src/components/input/PasteButton'
import { ScanButton } from '~src/components/input/ScanButton'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { Account } from '~src/models/redux/Account'
import { Contact } from '~src/models/redux/Contact'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootState } from '~src/store/RootStore'
import { ImageView, LinearLayout, TextView, InputTextView } from '~src/styles/styled-components'

interface Props {
  onChangeText?: (text: string) => void
  color: string
  placeholderColor?: string
  invalidColor?: string
  fontStyle?: string
  value: string
  validator?: (text: string) => boolean | Promise<boolean>
  isValid?: boolean
  invalidMessage?: string
  invalidMessageColor?: string
  separatorColor: string
  invalidSeparatorColor?: string
  sideMargins?: number
  hidePaste?: boolean
  hideScan?: boolean
  showContacts?: boolean
  filterBlockchain?: BlockchainServiceKey
  onClearPress?: () => void
  onScan?: (data: string) => void
  onSelectContact?: (contact: Contact, address: ContactAddresses) => void
  onSelectAccount?: (account: Account) => void
  placeholder?: string
  secure?: boolean
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  editable?: boolean
  keyboardType?: KeyboardTypeOptions
  title?: string
  srcIcon?: ImageSourcePropType
  iconSize?: [number, number]
  isMultiline?: boolean
  fromImportKey?: boolean
  addressSelected?: string
  forceClearButton?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  loading?: boolean
}

const InputWithValidation = (props: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const [isValid, setIsValid] = useState(true)

  const width = Normalize.scale(props.iconSize ? props.iconSize[0] : 25)
  const height = Normalize.scale(props.iconSize ? props.iconSize[1] : 25)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()
  const sideMargins = props.sideMargins ?? 20

  const fontStyle = !isValid ? 'italic' : props.fontStyle ?? 'normal'

  const fontColor = !isValid ? props.invalidColor : props.color

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (props.onBlur) {
      props.onBlur(e)
    }
  }

  const handleChangeText = (text: string) => {
    if (props.onChangeText) {
      props.onChangeText(UtilsHelper.clearText(text))
    }
  }

  useEffect(() => {
    ;(async () => {
      if (!props.validator || !props.value) return

      const valid = await props.validator(props.value)
      setIsValid(valid)
    })()
  }, [props.value, props.validator])

  useEffect(() => {
    if (typeof props.isValid === 'undefined') return
    setIsValid(props.isValid)
  }, [props.isValid])

  return (
    <LinearLayout orientation="verti" ml={sideMargins} mr={sideMargins}>
      {!!props.title && (
        <LinearLayout width="100%">
          <TextView width="100%" fontFamily="regular" color="primary" fontSize="18px">
            {props.title}
          </TextView>
        </LinearLayout>
      )}
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
          borderColor={!isValid ? theme.colors.quinary : theme.colors.background[12]}
          borderRadius={10}
          borderWidth={props.fromImportKey ? 1 : 0}
          orientation="horiz"
          flex={1}
          p={props.fromImportKey ? '2%' : undefined}
        >
          <InputTextView
            autoCapitalize={props.autoCapitalize ?? 'none'}
            onChangeText={handleChangeText}
            color={fontColor}
            placeholderTextColor={props.placeholderColor ?? theme.colors.text[10]}
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
            multiline={UtilsHelper.isIos ? true : props.isMultiline}
            numberOfLines={props.isMultiline ? 10 : 1}
            style={{ textAlignVertical: props.isMultiline ? 'top' : 'auto' }}
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
            {!props.isMultiline && !isValid && (
              <ImageView
                alignSelf="center"
                source={require('~/src/assets/images/icon-alert-purple.png')}
                resizeMode="contain"
              />
            )}
            {(props.onClearPress && props.value.length > 0) ||
              (props.onClearPress && props.forceClearButton && <InputClearButton onPress={props.onClearPress} />)}

            {props.loading && <ActivityIndicator size="small" color={theme.colors.text[10]} />}
          </View>
        </LinearLayout>
      </LinearLayout>

      {!props.fromImportKey && (
        <LinearLayout
          mt={1}
          bg={!isValid ? props.invalidSeparatorColor ?? props.separatorColor : props.separatorColor}
          height={1}
          width="100%"
        />
      )}
      {!props.isMultiline && (
        <TextView
          fontStyle="italic"
          color={props.invalidMessageColor ?? theme.colors.background[5]}
          fontSize="xs"
          fontFamily="regular"
          opacity={!isValid ? 1 : 0}
          textAlign="right"
        >
          {props.invalidMessage ?? i18n.t('components.inputTextWithValidation.incorrectFormat')}
        </TextView>
      )}

      {(props.showContacts || !props.hidePaste || !props.hideScan) && (
        <LinearLayout
          my="3%"
          orientation="horiz"
          justifyContent={props.showContacts && !props.hidePaste && !props.hideScan ? 'space-between' : 'flex-end'}
        >
          {props.showContacts && (
            <ContactsButton
              onPress={() => {
                navigation.navigate(wrapper.route.ContactsModal.name, {
                  onContactSelected: props.onSelectContact,
                  onAccountSelected: props.onSelectAccount,
                  filterByBlockchain: props.filterBlockchain,
                })
              }}
            />
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
                  : navigation.navigate(wrapper.route.QRCodeScan.name, {
                      onScan: props.onScan,
                    })
              }
            />
          )}
        </LinearLayout>
      )}
    </LinearLayout>
  )
}

export default InputWithValidation
