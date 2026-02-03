import { TwButton } from '@/components/TwButton'

type TLinkButtonProps = {
  label: string
  onPress: () => void
}

export const SwapDetailsModalLinkButton = ({ label, onPress }: TLinkButtonProps) => {
  return (
    <TwButton
      label={label}
      variant="text-slim"
      className="h-auto max-w-[80%] items-start justify-start"
      contentProps={{ className: 'py-0 px-0 justify-start items-start grow-0' }}
      labelProps={{
        className: 'text-blue underline text-lg font-sans-regular text-left leading-none',
        numberOfLines: 1,
        ellipsizeMode: 'middle',
      }}
      onPress={onPress}
    />
  )
}
