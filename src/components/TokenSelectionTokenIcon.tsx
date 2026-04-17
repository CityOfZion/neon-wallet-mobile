import { Image } from 'expo-image'
import { View } from 'react-native'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'

import { useImageError } from '@/hooks/useImageError'

import type { TTokenSelectionModalToken } from '@/types/modals'

type TProps = {
  token?: TTokenSelectionModalToken | null
}

const errorSource = { uri: `${ConstantsHelper.neonIconsUrl}/tokens/default-token.png` }

export const TokenSelectionTokenIcon = ({ token }: TProps) => {
  const { handleError, imageSource } = useImageError({
    source: {
      uri: token
        ? `${ConstantsHelper.neonIconsUrl}/tokens/${token.blockchain || token.network}/${token.hash}.png`
        : errorSource.uri,
    },
    defaultSource: { uri: token?.imageUrl || errorSource.uri },
    errorSource,
  })

  return (
    <View className="h-6 overflow-hidden rounded-full bg-asphalt p-0.5 min-size-6 max-size-6">
      <Image
        className="size-full"
        source={imageSource}
        contentFit="contain"
        placeholder={errorSource}
        placeholderContentFit="contain"
        onError={handleError}
      />
    </View>
  )
}
