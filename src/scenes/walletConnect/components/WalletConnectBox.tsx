import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  children: React.ReactNode
  rightButton?: React.ReactNode
  count?: number
  title: string
}

const WalletConnectBox = ({ children, title, rightButton, count }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <LinearLayout mb="13px">
      <LinearLayout
        bg={theme.colors.background[14]}
        borderTopLeftRadius={6}
        borderTopRightRadius={6}
        pl="18px"
        orientation="horiz"
        justifyContent="space-between"
        alignItems="center"
      >
        <LinearLayout orientation="horiz" alignItems="center" justifyContent="center">
          {typeof count !== 'undefined' && (
            <LinearLayout
              height={22}
              width={22}
              mr={12}
              borderRadius={11}
              backgroundColor={theme.colors.background[19]}
              alignItems="center"
              justifyContent="center"
            >
              <TextView fontFamily="regular" fontSize="12px" fontWeight="400" color={theme.colors.primary}>
                {count}
              </TextView>
            </LinearLayout>
          )}
          <TextView color="white" fontFamily="bold" fontSize="16px" pt="14px" pb="20px">
            {title}
          </TextView>
        </LinearLayout>
        {!!rightButton && rightButton}
      </LinearLayout>
      <LinearLayout
        bg={theme.colors.background[1]}
        orientation="verti"
        borderBottomLeftRadius={6}
        borderBottomRightRadius={6}
      >
        {children}
      </LinearLayout>
    </LinearLayout>
  )
}

export default WalletConnectBox
