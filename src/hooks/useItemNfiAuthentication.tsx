import { useEffect, useState } from 'react'

import { Item, Utils } from '@item-systems/item'
import { useNavigation } from '@react-navigation/native'
import { Trans, useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import RNNfcManager, { Ndef, NfcTech, type TagEvent } from 'react-native-nfc-manager'

import { activatedNfcModal } from '@/components/NfcModal'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import TbDialpad from '@/assets/images/tb-dialpad.svg'

import { useAppDispatch } from './useRedux'
import { useSecuritySelector } from './useSettingsSelector'

import { settingsReducerActions } from '@/store/reducers/settings'

const MIN_MESSAGE_READ_POINTER = 10

export const useItemNfiAuthentication = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useItemNfiAuthentication' })
  const { t: tCommon } = useTranslation('common')

  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const { security } = useSecuritySelector()

  const [isNfiAuthenticationAvailable, setIsNfiAuthenticationAvailable] = useState<boolean>()

  const getItemTag = async (message?: string) => {
    const isNfcEnabled = await RNNfcManager.isEnabled()

    if (!isNfcEnabled) {
      throw new AppError(t('nfcNotEnabledError'))
    }

    try {
      activatedNfcModal?.show({
        message,
        onForceHide: async () => {
          await RNNfcManager.cancelTechnologyRequest()
        },
      })

      await RNNfcManager.requestTechnology(NfcTech.Ndef, { alertMessage: message })
    } catch (error) {
      activatedNfcModal?.hide()
      await RNNfcManager.cancelTechnologyRequest()
      throw new AppError(t('nfcRequestNotFoundError'), error)
    }

    let tag: TagEvent | undefined | null
    try {
      tag = await RNNfcManager.getTag()
    } catch {
      // Empty block
    }

    if (!tag) throw new AppError(t('noNfiObjectError'))

    activatedNfcModal?.success()
    await RNNfcManager.cancelTechnologyRequest()

    // Wait for the nfc modal to close to avoid error when we call two times
    await UtilsHelper.sleep(3000)

    try {
      const uri = Ndef.uri.decodePayload(Uint8Array.from(tag.ndefMessage[0].payload))
      const decoded = Utils.decodeNDEF(uri)

      const itemSdk = await Item.init({
        node: BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3.defaultNetwork.url,
      })

      const item = await itemSdk.tokenProperties({ pubKey: decoded.pubKey })

      const { nfid, ...itemProps } = item

      return {
        item: { ...itemProps, tokenId: nfid.toString() },
        decoded,
        uri,
      }
    } catch (error) {
      throw new AppError(t('twinNfiError'), error)
    }
  }

  const linkNfi = async () => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        navigation.navigate('CreatePasswordModal', {
          title: t('createPassword.title'),
          description: t('createPassword.description'),
          formDescription: t('createPassword.formDescription'),
          passwordInputProps: {
            label: t('createPassword.passwordInputLabel'),
            placeholder: t('createPassword.passwordInputPlaceholder'),
          },
          confirmPasswordInputProps: {
            label: t('createPassword.confirmPasswordInputLabel'),
            placeholder: t('createPassword.confirmPasswordInputPlaceholder'),
          },
          bannerProps: {
            type: 'warningOrange',
            text: (
              <Text className="flex-shrink px-5 py-3.5 font-sans-regular text-lg text-white">
                <Trans t={t} i18nKey="createPassword.keepSafeAlertMessage">
                  start
                  <Text className="text-orange">middle</Text>
                </Trans>
              </Text>
            ),
          },
          buttonProps: {
            label: t('createPassword.submitButtonLabel'),
            leftElement: <TbDialpad aria-hidden />,
          },
          async onCreate(password) {
            await UtilsHelper.sleep(500)
            const firstTag = await getItemTag(t('linkMessage'))
            const firstTagPointer = parseInt(firstTag.decoded.message, 16)
            if (!firstTag.decoded.validSignature || firstTagPointer < MIN_MESSAGE_READ_POINTER) {
              throw new AppError(t('invalidSignatureError'))
            }

            const secondTag = await getItemTag(t('confirmLinkMessage'))
            const secondTagPointer = parseInt(secondTag.decoded.message, 16)
            if (!secondTag.decoded.validSignature || secondTagPointer <= firstTagPointer) {
              throw new AppError(t('invalidSignatureError'))
            }

            await SecureStoreHelper.saveNfiPasscode(password)
            dispatch(
              settingsReducerActions.setSecurity({
                type: 'nfi',
                tagPointer: secondTagPointer,
                tokenId: secondTag.item.tokenId,
                pubKey: secondTag.decoded.pubKey,
              })
            )
          },
          onSuccess() {
            resolve()
          },
          onError(error) {
            reject(error)
          },
          onRequestClose() {
            reject()
          },
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  const removeNfiByNfi = async () => {
    await authenticateNfi()
    await SecureStoreHelper.deleteNfiPasscode()
    dispatch(settingsReducerActions.setSecurity({ type: 'disabled' }))
  }

  const removeNfiByPassword = async () => {
    return new Promise<void>(async (resolve, reject) => {
      navigation.navigate('PasswordModal', {
        title: t('password.title'),
        description: t('password.description'),
        inputProps: {
          label: t('password.inputLabel'),
          placeholder: t('password.inputPlaceholder'),
        },
        bannerProps: {
          type: 'warningOrange',
          text: t('password.alert'),
        },
        buttonProps: {
          leftElement: <TbDialpad aria-hidden />,
          label: t('password.submitButtonLabel'),
        },
        async onConfirm(password) {
          const currentPasscode = await SecureStoreHelper.getNfiPasscode()

          if (currentPasscode !== password) {
            throw new AppError(t('wrongNfiPasscodeError'))
          }

          dispatch(settingsReducerActions.setSecurity({ type: 'disabled' }))
        },
        onSuccess() {
          resolve()
        },
        onError(error) {
          reject(error)
        },
      })
    })
  }

  const removeNfi = async () => {
    return new Promise<void>(async (resolve, reject) => {
      navigation.navigate('RemoveNfiModal', {
        onError(error) {
          reject(error)
        },
        onSuccess() {
          resolve()
        },
      })
    })
  }

  const authenticateNfi = async () => {
    if (security.type !== 'nfi') return

    const tag = await getItemTag(t('authenticateMessage'))
    const tagPointer = parseInt(tag.decoded.message, 16)

    if (
      !tag.decoded.validSignature ||
      tagPointer < security.tagPointer ||
      tag.item.tokenId !== security.tokenId ||
      tag.decoded.pubKey !== security.pubKey
    ) {
      throw new AppError(tCommon('errors.unauthorized'))
    }
  }

  useEffect(() => {
    RNNfcManager.isSupported().then(setIsNfiAuthenticationAvailable)
  }, [])

  return {
    linkNfi,
    authenticateNfi,
    isNfiAuthenticationAvailable,
    removeNfi,
    removeNfiByNfi,
    removeNfiByPassword,
  }
}
