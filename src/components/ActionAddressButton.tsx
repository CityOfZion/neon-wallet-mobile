import type { TBSServiceName } from '@cityofzion/bs-multichain'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import type { TTwButtonProps } from '@/components/TwButton'
import { TwButton } from '@/components/TwButton'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = Omit<TTwButtonProps, 'leftElement'> & {
  label: string
  address?: string | null
  blockchain?: TBSServiceName | null
  error?: boolean
}

export const ActionAddressButton = ({ label, className, address, blockchain, error, ...props }: TProps) => (
  <TwButton
    label={address || label}
    variant="contained-darker"
    className={StyleHelper.mergeStyles('h-11 w-32', { 'bg-gray-300/15': !!address }, className)}
    style={{ boxShadow: undefined }}
    contentProps={address ? { className: 'px-2 gap-2' } : undefined}
    labelProps={
      address
        ? { className: StyleHelper.mergeStyles('text-white', { 'text-pink': error }), ellipsizeMode: 'middle' }
        : undefined
    }
    leftElement={
      blockchain ? <TwBlockchainIcon blockchain={blockchain} className="ml-2 size-3.5 text-gray-300" /> : undefined
    }
    {...props}
  />
)
