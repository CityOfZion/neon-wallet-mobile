import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwIconButton } from '@/components/TwIconButton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import TbCopy from '@/assets/images/tb-copy.svg'

type TProps = {
  response?: any
}

export const DappPermissionSuccessContent = ({ response }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermissionModal.successContent' })
  const { t: commonT } = useTranslation('common')

  const stringifiedResponse = typeof response === 'string' ? response : JSON.stringify(response, null, 2)

  return (
    <View className="w-full items-center">
      <Text className="px-10 text-center font-sans-medium text-xl text-white">{t('subtitle')}</Text>

      {response && (
        <Fragment>
          <View className="mt-4 w-full flex-row items-center justify-between">
            <Text className="font-sans-bold uppercase text-gray-300">{t('resultBoxLabel')}</Text>

            <TwIconButton
              aria-label={commonT('general.copy')}
              icon={<TbCopy className="text-neon" aria-hidden />}
              onPress={() => ClipboardHelper.write(stringifiedResponse)}
            />
          </View>

          <Text className="w-full whitespace-pre-wrap break-words rounded bg-asphalt p-2 font-sans-medium text-white">
            {stringifiedResponse}
          </Text>
        </Fragment>
      )}
    </View>
  )
}
