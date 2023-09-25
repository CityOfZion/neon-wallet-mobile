import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

export type TDecryptPayload = {
  cipherText: string
  dataTag: string
  ephemPublicKey: string
  randomVector: string
}
export const DecryptPayload = (payload: TDecryptPayload) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  return (
    <>
      {Object.entries(payload).map(([title, value]) => (
        <LinearLayout width="100%" pb="5%">
          <TextView
            color={theme.colors.text[6]}
            fontSize={16}
            fontWeight={300}
            lineHeight="20px"
            fontFamily="light"
            pb="1%"
          >
            {title}
          </TextView>
          <TextView
            width="90%"
            minHeight="73px"
            bg={theme.colors.background[7]}
            px={5}
            py={2}
            mb="auto"
            borderRadius={5}
            color={theme.colors.text[0]}
            fontSize={16}
            fontWeight={300}
            lineHeight="20px"
            fontFamily="light"
          >
            {value}
          </TextView>
        </LinearLayout>
      ))}
    </>
  )
}
