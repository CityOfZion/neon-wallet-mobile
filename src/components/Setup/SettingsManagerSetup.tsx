import { useEffect } from 'react'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'

import { useAppDispatch } from '@/hooks/useRedux'
import { useSurveyInfoSelector } from '@/hooks/useSettingsSelector'

import { settingsReducerActions } from '@/store/reducers/settings'

const SettingsManagerSetup = () => {
  const dispatch = useAppDispatch()
  const { surveyInfo } = useSurveyInfoSelector()

  useEffect(() => {
    if (
      surveyInfo.status === 'submitted-negative' &&
      Date.now() - surveyInfo.updatedAt > ConstantsHelper.surveyExpiryMs
    ) {
      dispatch(settingsReducerActions.setSurveyInfo('not-submitted'))
    }
  }, [surveyInfo, dispatch])

  return null
}

export default SettingsManagerSetup
