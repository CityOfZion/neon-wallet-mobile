import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import type { TTwButtonProps } from '@/components/TwButton'
import { TwButton } from '@/components/TwButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import { TokenSelectionTokenIcon } from './TokenSelectionTokenIcon'

import type { TTokenSelectionModalToken } from '@/types/modals'

type TProps = Omit<TTwButtonProps, 'leftElement'> & {
  label: string
  token?: TTokenSelectionModalToken | null
  tokenClassName?: string
  blockchainClassName?: string
}

export const ActionTokenButton = ({
  label,
  token,
  isLoading,
  className,
  tokenClassName,
  blockchainClassName,
  ...props
}: TProps) => {
  const { t: tCommonBlockchain } = useTranslation('common', { keyPrefix: 'blockchain' })
  const network = token?.network
  const blockchainName = token?.blockchain ? tCommonBlockchain(token.blockchain) : network

  return (
    <TwButton
      variant="contained-darker"
      className={StyleHelper.mergeStyles('h-11 w-32', { 'bg-gray-300/15': token }, className)}
      isLoading={isLoading}
      style={{ boxShadow: undefined }}
      contentProps={token ? { className: 'px-2 gap-2' } : undefined}
      label={
        token ? (
          <View className="flex-shrink flex-row">
            <Text
              className={StyleHelper.mergeStyles(
                'font-sans-medium text-lg uppercase leading-6 text-white',
                tokenClassName
              )}
            >
              {token.symbol}
            </Text>
            {blockchainName && (
              <Text
                className={StyleHelper.mergeStyles(
                  'flex-shrink font-sans-regular text-lg uppercase leading-6 text-gray-100',
                  blockchainClassName
                )}
                numberOfLines={1}
              >
                {` | ${blockchainName}`}
              </Text>
            )}
          </View>
        ) : (
          label
        )
      }
      leftElement={token ? <TokenSelectionTokenIcon token={token} /> : undefined}
      {...props}
    />
  )
}
