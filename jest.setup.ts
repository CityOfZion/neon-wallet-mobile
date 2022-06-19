import 'react-native'
import 'reflect-metadata'
import '~src/vendor/window-crypto'

// @ts-ignore
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'

import {Setup} from '~src/app/Setup'

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)

Setup.init()
