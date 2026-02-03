import { useTranslation } from 'react-i18next'
import type { ViewProps } from 'react-native'
import { Text } from 'react-native'

import TbPlug from '@/assets/images/tb-plug.svg'

import { TwDetailsCard } from './TwDetailsCard'

type TProps = {
  chain: string
  methods: string[]
} & ViewProps

export const TwDappDetailsCard = ({ chain, methods, children, ...props }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'twDappDetailsCard' })

  return (
    <TwDetailsCard.Root {...props}>
      <TwDetailsCard.Header
        leftElement={<TbPlug aria-hidden />}
        rightElement={<Text className="text-right font-sans-regular text-sm text-gray-300">{chain}</Text>}
      >
        {t('connectionDetailsHeaderLabel')}
      </TwDetailsCard.Header>

      <TwDetailsCard.HeaderSeparator />

      <TwDetailsCard.Row>
        <TwDetailsCard.ItemPanel label={t('methodsDetailsLabel')}>
          <Text className="font-sans-medium text-sm text-white">{methods.join(', ')}</Text>
        </TwDetailsCard.ItemPanel>
      </TwDetailsCard.Row>

      {children}
    </TwDetailsCard.Root>
  )
}
