import { useNavigation } from '@react-navigation/native'
import { Trans, useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { AppError } from '@/helpers/ErrorHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'

import TbDialpad from '@/assets/images/tb-dialpad.svg'

import { useAppDispatch } from './useRedux'

import { settingsReducerActions } from '@/store/reducers/settings'

export const usePasswordAuthentication = () => {
  const { t } = useTranslation('hooks', { keyPrefix: 'usePasswordAuthentication' })
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const linkPassword = async () => {
    return new Promise<void>(async (resolve, reject) => {
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
        onRequestClose() {
          reject()
        },
        async onCreate(password) {
          await SecureStoreHelper.savePassword(password)
          dispatch(settingsReducerActions.setSecurity({ type: 'password' }))
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

  const removePassword = async () => {
    await authenticatePassword()
    await SecureStoreHelper.deletePassword()
    dispatch(settingsReducerActions.setSecurity({ type: 'disabled' }))
  }

  const authenticatePassword = async () => {
    return new Promise<void>(async (resolve, reject) => {
      const currentPassword = await SecureStoreHelper.getPassword()
      if (!currentPassword) {
        reject(new Error(t('getPasswordError')))
        return
      }

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
        onRequestClose() {
          reject()
        },
        onConfirm(password) {
          if (currentPassword !== password) {
            throw new AppError(t('wrongPasswordError'))
          }
        },
        onSuccess() {
          resolve()
        },
      })
    })
  }

  return {
    linkPassword,
    authenticatePassword,
    removePassword,
  }
}
