import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {TouchableOpacity, View} from 'react-native'

import {Facade} from '~src/app/Facade'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  onClick?: (number: number) => void
  disabled?: boolean
}

export interface Key {
  number: number
  text?: string
}

const Keypad = (props: Props) => {
  const keyArray = [
    {
      number: 1,
      text: '',
    },
    {
      number: 2,
      text: 'ABC',
    },
    {
      number: 3,
      text: 'DEF',
    },
    {
      number: 4,
      text: 'GHI',
    },
    {
      number: 5,
      text: 'JLK',
    },
    {
      number: 6,
      text: 'MNO',
    },
    {
      number: 7,
      text: 'PQRS',
    },
    {
      number: 8,
      text: 'TUV',
    },
    {
      number: 9,
      text: 'WXYZ',
    },
    {
      number: 0,
      text: undefined,
    },
  ]
  const keypad = Facade.lodash.chunk(keyArray, 3)

  const KeyRowComponent = (row: Key[]) => {
    return (
      <LinearLayout width="100%" justifyContent="center" orientation="horiz">
        {row.map((key) => KeyComponent(key))}
      </LinearLayout>
    )
  }

  const KeyComponent = (key: Key) => {
    return (
      <TouchableOpacity
        disabled={props.disabled}
        onPress={() => props.onClick?.(key.number)}
      >
        <LinearLayout
          justifyContent="center"
          alignItems="center"
          mx="14px"
          my="8px"
        >
          <LinearLayout
            width="75px"
            height="75px"
            bg="background.10"
            opacity={0.28}
            borderRadius="9999px"
            position="relative"
          />

          <LinearLayout position="absolute">
            <TextView color="text.0" textAlign="center" fontSize="36px">
              {key.number}
            </TextView>
            {key.text !== undefined ? (
              <TextView
                color="text.0"
                textAlign="center"
                fontSize="10px"
                letterSpacing={3}
              >
                {key.text}
              </TextView>
            ) : undefined}
          </LinearLayout>
        </LinearLayout>
      </TouchableOpacity>
    )
  }

  return <Fragment>{keypad.map((row) => KeyRowComponent(row))}</Fragment>
}

Keypad.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default Keypad
