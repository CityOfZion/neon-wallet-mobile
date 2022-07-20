import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { RootState } from '~/src/store/RootStore'

interface Props {
  reference?: string
  onChange: (reference: string) => void
}

export const ReferenceInput = ({ onChange, reference }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <>
      <InputLabel
        title={i18n.t('modals.receiveTransactionModal.reference')}
        color="text.0"
        marginTop={42}
        marginBottom={20}
        capitalize
      />
      <InputWithValidation
        onChangeText={onChange}
        color={theme.colors.text[0]}
        invalidColor={theme.colors.text[10]}
        value={reference ?? ''}
        placeholder={i18n.t('modals.receiveTransactionModal.addReference')}
        validator={() => true}
        separatorColor={theme.colors.background[13]}
        sideMargins={0}
        hidePaste
        hideScan
      />
    </>
  )
}
