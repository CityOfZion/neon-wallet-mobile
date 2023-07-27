import PropTypes from 'prop-types'
import React from 'react'

import { InputTextViewProps } from '~/src/types/styled-components'
import { InputTextView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props extends InputTextViewProps {
  label?: string
}

const ThemedInputText: React.FC<Props> = props => {
  return (
    <LinearLayout>
      {props.label && (
        <TextView color="text.0" fontSize="sm" fontFamily="bold" style={{ textTransform: 'uppercase' }}>
          {props.label}
        </TextView>
      )}

      <InputTextView
        {...props}
        fontSize="lg"
        color="text.0"
        height={40}
        borderBottomColor="text.2"
        borderBottomWidth={1}
        placeholderTextColor="background.3"
      />
    </LinearLayout>
  )
}

ThemedInputText.propTypes = {
  label: PropTypes.string,
}

export default ThemedInputText
