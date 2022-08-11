import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import { Alert } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { Security } from '../enums/Security'
import { RootState } from '../store/RootStore'

import * as LocalAuthentication from '~/node_modules/expo-local-authentication'
import { SecurityHelper } from '~/src/helpers/SecurityHelper'

export const useLocalAuthentication = () => {
  const navigation = useNavigation()
  const security = useSelector((state: RootState) => state.settings.security)

  const alertDialog = () => {
    return new Promise<void>((resolve, reject) => {
      Alert.alert(
        i18n.t('hooks.useLocalAuthentication.dialog.title'),
        i18n.t('hooks.useLocalAuthentication.dialog.subtitle'),
        [
          {
            text: i18n.t('hooks.useLocalAuthentication.dialog.confirm'),
            onPress: () => resolve(),
          },
          {
            text: i18n.t('hooks.useLocalAuthentication.dialog.cancel'),
            style: 'cancel',
            onPress: () => reject(new Error(i18n.t('hooks.useLocalAuthentication.errorDismiss'))),
          },
        ],
        {
          cancelable: true,
          onDismiss: () => reject(new Error(i18n.t('hooks.useLocalAuthentication.errorDismiss'))),
        }
      )
    })
  }

  const authenticate = async () => {
    return new Promise<void>(async (resolve, reject) => {
      if (security === Security.password) {
        const passcode = await SecurityHelper.loadPasscode()

        if (!passcode) {
          reject(new Error(i18n.t('hooks.useLocalAuthentication.errorToGetPasscode')))
          return
        }

        navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.VerifyPasscode.name,
          params: {
            onValidate: (isValid: boolean) => {
              if (!isValid) {
                reject(new Error())
              }

              resolve()
            },
          },
        })
        return
      }

      if (security === Security.hardware) {
        try {
          await tryAuth()

          resolve()
        } catch (error) {
          reject(error)
        } finally {
          return
        }
      }

      resolve()
    })
  }

  const tryAuth = () => {
    return new Promise<void>(async (resolve, reject) => {
      const canUseHardware = await LocalAuthentication.hasHardwareAsync()

      if (!canUseHardware) {
        return
      }

      const result = await LocalAuthentication.authenticateAsync()

      if (!result.success) {
        try {
          await alertDialog()

          await tryAuth()

          resolve()
        } catch (error) {
          reject(error)
        }
      }

      resolve()
    })
  }

  return {
    authenticate,
  }
}
