import React from 'react'

import ScreenLayout from '~/src/components/layout/ScreenLayout'
import {Account} from '~/src/models/redux/Account'

export interface AccountNFTSScreenParams {
  account: Account
}

const AccountNFTSScreen = () => {
  return <ScreenLayout darkerSolidColorBG={true} />
}

export default AccountNFTSScreen
