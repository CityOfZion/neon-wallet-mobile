import i18n from 'i18n-js'
import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {Param} from '../modal/WCInvocationDetailsModal'
import WalletConnectBox from './WalletConnectBox'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {DoraTypeColors, doraTypeColors} from '~/src/assets/doraTypeColors'
import {UtilsHelper} from '~/src/helpers/UtilsHelper'
import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'

export type Props = {
  data: Param
  count: number
}

const typesToConvert: Record<string, string> = {
  Address: 'Hash160',
}

const CopyButton = ({onPress}: {onPress: () => void}) => {
  return (
    <LinearLayout pr={18}>
      <TouchableWithoutFeedback onPress={onPress}>
        <ImageView
          resizeMode={'contain'}
          source={require('~/src/assets/images/icon-copy-green.png')}
          height={20}
          width={20}
        />
      </TouchableWithoutFeedback>
    </LinearLayout>
  )
}

const InvocationDetailsParametersBox = ({data, count}: Props) => {
  const type = typesToConvert[data.type] || data.type

  const typeColor = doraTypeColors[type as DoraTypeColors]

  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const handleRightButtonPress = () => {
    UtilsHelper.copyToClipboard(String(data.value))
    showMessage({
      message: i18n.t('toast.copiedToClipboard'),
      type: 'success',
    })
  }

  return (
    <WalletConnectBox
      title={data.name}
      count={count}
      rightButton={
        data.value && <CopyButton onPress={handleRightButtonPress} />
      }
    >
      <LinearLayout
        orientation={'horiz'}
        padding={18}
        backgroundColor={theme.colors.background[20]}
      >
        <LinearLayout
          padding={12}
          borderRadius={4}
          backgroundColor={typeColor.color}
        >
          <TextView
            fontFamily={'medium'}
            fontSize={'16px'}
            fontWeight={'500'}
            color={
              typeColor.textColor === 'light'
                ? theme.colors.text[0]
                : theme.colors.text[13]
            }
          >
            {type}
          </TextView>
        </LinearLayout>
      </LinearLayout>
      <LinearLayout
        padding={18}
        borderBottomLeftRadius={8}
        borderBottomRightRadius={8}
        backgroundColor={theme.colors.background[15]}
      >
        <TextView
          fontFamily={'light'}
          fontSize={'16px'}
          fontWeight={'300'}
          lineHeight={'20px'}
          color={theme.colors.text[0]}
        >
          {data.value ?? 'null'}
        </TextView>
      </LinearLayout>
    </WalletConnectBox>
  )
}

export default InvocationDetailsParametersBox
