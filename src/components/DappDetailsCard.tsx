import { useTranslation } from 'react-i18next'
import type { ViewProps } from 'react-native'

import TbPlug from '@/assets/images/tb-plug.svg'

import { Details } from './Details'

type TProps = {
  chain: string
  methods: string[]
} & ViewProps

export const DappDetailsCard = ({ chain, methods, children, ...props }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'twDappDetailsCard' })

  return (
    <Details.Root {...props}>
      <Details.Header leftElement={<TbPlug aria-hidden />}>{t('connectionDetailsHeaderLabel')}</Details.Header>

      <Details.HeaderSeparator />

      <Details.Body>
        <Details.Panel label={t('chainDetailsLabel')}>
          <Details.Item>{chain}</Details.Item>
        </Details.Panel>

        <Details.Panel label={t('methodsDetailsLabel')}>
          <Details.Item>{methods.join(', ')}</Details.Item>
        </Details.Panel>

        {children}
      </Details.Body>
    </Details.Root>
  )
}
