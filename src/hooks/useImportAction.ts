import { BSKeychainHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'

import { useActions } from './useActions'

import type { TUseImportActionInputType } from '@/types/hooks'

type TFormData = {
  text: string
  inputType?: TUseImportActionInputType
}

export const useImportAction = (
  submitByInputType: Record<
    TUseImportActionInputType,
    (value: string, inputType: TUseImportActionInputType) => Promise<void>
  >
) => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useImportAction' })

  const { handleAct, actionDataRef, setError, actionState, actionStateRef, actionData, setData, clearErrors, reset } =
    useActions<TFormData>({
      text: '',
    })

  const validateMnemonic = (value: string) => {
    const isValid = BSKeychainHelper.isValidMnemonic(value)
    if (!isValid) throw new AppError(t('errors.mnemonicIncomplete'))
  }

  const handleChange = (value: string) => {
    setData({ text: value, inputType: undefined })

    try {
      const checkFunctionsByInputType: Record<TUseImportActionInputType, (value: string) => boolean> = {
        key: BlockchainServiceHelper.bsAggregator.validateKeyAllBlockchains.bind(BlockchainServiceHelper.bsAggregator),
        mnemonic: BSKeychainHelper.isMnemonic,
        encrypted: BlockchainServiceHelper.bsAggregator.validateEncryptedAllBlockchains.bind(
          BlockchainServiceHelper.bsAggregator
        ),
        address: BlockchainServiceHelper.bsAggregator.validateAddressAllBlockchains.bind(
          BlockchainServiceHelper.bsAggregator
        ),
      }

      const functionsByInputType = Object.entries(checkFunctionsByInputType).find(([, checkFunc]) => {
        try {
          return checkFunc(value)
        } catch {
          return false
        }
      })

      if (!functionsByInputType) throw new AppError(t('errors.invalid'))
      const inputType = functionsByInputType[0] as TUseImportActionInputType

      setData({ inputType })

      const validationByInputType: Partial<Record<TUseImportActionInputType, (value: string) => void>> = {
        mnemonic: validateMnemonic,
      }
      const validateFunc = validationByInputType[inputType]
      validateFunc?.(value)

      clearErrors()
    } catch (error) {
      setError('text', AppError.wrap(error, t('errors.invalid')).message)
    }
  }

  const handleSubmit = async (data: TFormData, canReset = true) => {
    try {
      if (!data.text.length) {
        throw new AppError(t('errors.empty'))
      }

      if (!data.inputType) {
        throw new AppError(t('errors.invalid'))
      }

      const trimmedText = data.text.trim()

      await submitByInputType[data.inputType](trimmedText, data.inputType)
    } catch (error) {
      setError('text', AppError.wrap(error).message)
    } finally {
      if (canReset) reset()
    }
  }

  return { actionData, actionDataRef, actionState, actionStateRef, handleAct, handleChange, handleSubmit, reset }
}
