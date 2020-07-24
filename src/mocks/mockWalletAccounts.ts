import {Currency} from '~src/enums/Currency'
import {AccountMock} from '~src/models/AccountMock'

export const mockWalletAccounts: AccountMock[] = [
  new AccountMock(),
  new AccountMock(),
  new AccountMock(),
]

mockWalletAccounts[0].srcIcon = require('~src/assets/images/card-neo.png')
mockWalletAccounts[0].name = 'My First Account'
mockWalletAccounts[0].currency = Currency.USD
mockWalletAccounts[0].balance = 24985
mockWalletAccounts[0].address = 'AN8iLVt18CKoATdexztCQj923hw5gkc41A'
mockWalletAccounts[0].backgroundColor = '#0DD5B3'

mockWalletAccounts[1].srcIcon = require('~src/assets/images/card-neo.png')
mockWalletAccounts[1].name = 'My Second Account'
mockWalletAccounts[1].currency = Currency.USD
mockWalletAccounts[1].balance = 38211
mockWalletAccounts[1].address = '8tYaX4j3cTjjIAjbOjunNnPIds1Hgnnfce'
mockWalletAccounts[1].backgroundColor = '#1085C4'

mockWalletAccounts[2].srcIcon = require('~src/assets/images/card-neo.png')
mockWalletAccounts[2].name = 'My Third Account'
mockWalletAccounts[2].currency = Currency.USD
mockWalletAccounts[2].balance = 88206
mockWalletAccounts[2].address = 'PbiI8k3RxiQm44xOKJ1Zs9mpBDrH0C0Mre'
mockWalletAccounts[2].backgroundColor = '#5525C5'
