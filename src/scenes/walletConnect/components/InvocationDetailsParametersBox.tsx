import i18n from 'i18n-js'
import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { Param } from '../modal/WCInvocationDetailsModal'
import WalletConnectBox from './WalletConnectBox'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

export type Props = {
  data: Param
  count: number
}

type ColorsByType = { color: string; textColor: 'dark' | 'light' }

const colorsByType: Record<string, ColorsByType> = {
  Signature: {
    color: '#E9265C',
    textColor: 'dark',
  },
  Boolean: {
    color: '#D355E7',
    textColor: 'dark',
  },
  Integer: {
    color: '#B167F2',
    textColor: 'dark',
  },
  Hash160: {
    color: '#008529',
    textColor: 'light',
  },
  Null: {
    color: 'rgba(255, 255, 255, 0.08)',
    textColor: 'dark',
  },
  Hash256: {
    color: '#1DB5FF',
    textColor: 'dark',
  },
  ByteArray: {
    color: '#0DCDFF',
    textColor: 'dark',
  },
  PublicKey: {
    color: '#00D69D',
    textColor: 'dark',
  },
  String: {
    color: '#67DD8B',
    textColor: 'dark',
  },
  ByteString: {
    color: '#67DD8B',
    textColor: 'dark',
  },
  Array: {
    color: '#F28F00',
    textColor: 'dark',
  },
  Buffer: {
    color: '#F28F00',
    textColor: 'dark',
  },
  InteropInterface: {
    color: '#A50000',
    textColor: 'light',
  },
  Void: {
    color: '#528D93',
    textColor: 'dark',
  },
  Any: {
    color: '#00D69D',
    textColor: 'dark',
  },
}

const CopyButton = ({ onPress, disabled }: { onPress?: () => void; disabled: boolean }) => {
  return (
    <LinearLayout pr={18}>
      <TouchableWithoutFeedback onPress={onPress}>
        <ImageView
          resizeMode="contain"
          source={require('~/src/assets/images/icon-copy-green.png')}
          height={20}
          width={20}
          opacity={disabled ? 0.4 : 1}
        />
      </TouchableWithoutFeedback>
    </LinearLayout>
  )
}

const InvocationDetailsParametersBox = ({ data, count }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const typeColor = data.type ? colorsByType[data.type] : null
  const value = !data.value ? null : typeof data.value === 'string' ? data.value : JSON.stringify(data.value)

  const handleRightButtonPress = (text: string) => {
    UtilsHelper.copyToClipboard(text)
    showMessage({
      message: i18n.t('toast.copiedToClipboard'),
      type: 'success',
    })
  }

  return (
    <WalletConnectBox
      title={data.name ?? ''}
      count={count}
      rightButton={
        <CopyButton
          onPress={value !== null ? () => handleRightButtonPress(value) : undefined}
          disabled={value === null}
        />
      }
    >
      <LinearLayout orientation="horiz" padding={18} backgroundColor={theme.colors.background[20]}>
        {typeColor && (
          <LinearLayout padding={12} borderRadius={4} backgroundColor={typeColor.color}>
            <TextView
              fontFamily="medium"
              fontSize="16px"
              fontWeight="500"
              color={typeColor.textColor === 'light' ? theme.colors.text[0] : theme.colors.text[13]}
            >
              {data.type}
            </TextView>
          </LinearLayout>
        )}
      </LinearLayout>
      <LinearLayout
        padding={18}
        borderBottomLeftRadius={8}
        borderBottomRightRadius={8}
        backgroundColor={theme.colors.background[15]}
      >
        <TextView fontFamily="light" fontSize="16px" fontWeight="300" lineHeight="20px" color={theme.colors.text[0]}>
          {value ?? 'null'}
        </TextView>
      </LinearLayout>
    </WalletConnectBox>
  )
}

export default InvocationDetailsParametersBox
