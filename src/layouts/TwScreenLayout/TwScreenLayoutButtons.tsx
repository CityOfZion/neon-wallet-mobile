import type { TTwButtonProps } from '@/components/TwButton'
import { TwButton } from '@/components/TwButton'

import { StyleHelper } from '@/helpers/StyleHelper'

export const TwScreenLayoutButton = ({ contentProps, labelProps, ...props }: TTwButtonProps) => {
  return (
    <TwButton
      labelProps={{ ...labelProps, className: StyleHelper.mergeStyles('text-base', labelProps?.className) }}
      contentProps={{ ...contentProps, className: StyleHelper.mergeStyles('px-5', contentProps?.className) }}
      variant="text"
      animation="opacity"
      {...props}
    />
  )
}
