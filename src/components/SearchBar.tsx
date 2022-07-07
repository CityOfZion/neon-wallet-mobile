import i18n from 'i18n-js'
import React from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { RootState } from '../store/RootStore'

import { Normalize } from '~/src/app/Normalize'
import { ImageView, InputTextView, LinearLayout } from '~/src/styles/styled-components'
import { LinearLayoutProps } from '~/src/types/styled-components'

type Props = {
  onFilter: (text: string) => void
  lighterColor?: boolean
} & LinearLayoutProps

export const SearchBar = ({ onFilter, lighterColor, ...props }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const handleFilter = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (onFilter) onFilter(event.nativeEvent.text)
  }

  return (
    <LinearLayout
      borderRadius={21}
      height={42}
      backgroundColor={lighterColor ? 'background.16' : 'background.12'}
      marginY={20}
      orientation="horiz"
      alignItems="center"
      paddingX={20}
      {...props}
    >
      <LinearLayout>
        <ImageView
          source={require('~/src/assets/images/icon-search-gray.png')}
          width={Normalize.scale(21)}
          height={Normalize.scale(21)}
          marginRight="10px"
        />
      </LinearLayout>
      <InputTextView
        onChange={handleFilter}
        placeholder={i18n.t('persistContact.search')}
        flex={1}
        height="100%"
        color="text.6"
        fontFamily="light"
        fontWeight="300"
        textAlignVertical="center"
        fontSize={20}
        placeholderTextColor={theme.colors.text[6]}
      />
    </LinearLayout>
  )
}
