import * as Updates from 'expo-updates'
import i18n from 'i18n-js'

import { hideAlert, showAlert } from '../components/Alert'
class OTAHelper {
  async handleOTAUpdates() {
    const { isAvailable } = await Updates.checkForUpdateAsync()
    if (!isAvailable) return
    const haveUpdate = await Updates.fetchUpdateAsync()
    if (!haveUpdate) return
    showAlert({
      title: i18n.t('OTA.alertUpdate'),
      buttons: [
        {
          label: i18n.t('OTA.alertButton'),
          onPress: hideAlert,
        },
      ],
    })
  }
}

export default new OTAHelper()
