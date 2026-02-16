import { Text, type TextProps } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

type TProps = TextProps

export const VoteNeo3ConfirmationDetailsLabel = ({ className, ...props }: TProps) => {
  return (
    <Text className={StyleHelper.mergeStyles('font-sans-bold text-sm uppercase text-blue', className)} {...props} />
  )
}
