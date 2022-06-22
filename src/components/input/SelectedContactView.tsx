import PropTypes from 'prop-types'
import React from 'react'

import { Contact } from '~src/models/redux/Contact'
import { LinearLayout, TextView } from '~src/styles/styled-components'

interface ISelectedContactView {
  selectedContact: Contact
  onClick?: () => void
  addressSelected?: string
}

export const SelectedContactView: React.FC<ISelectedContactView> = props => {
  return (
    <LinearLayout width="100%">
      <TextView width="100%" fontFamily="regular" color="text.0" fontSize="18px" onPress={props.onClick}>
        {props.selectedContact?.name}
      </TextView>
      <TextView width="100%" fontFamily="medium" color="text.10" fontSize="16px" onPress={props.onClick}>
        {props.addressSelected}
      </TextView>
    </LinearLayout>
  )
}

SelectedContactView.propTypes = {
  onClick: PropTypes.func.isRequired,
  selectedContact: PropTypes.any,
  addressSelected: PropTypes.any,
}
