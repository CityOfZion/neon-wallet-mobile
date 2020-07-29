import {
  TransactionModel,
  Transaction,
  Receiver,
  Asset,
} from '~src/models/TransactionModel'

export const mockAccountAssetDetails: TransactionModel[] = [
  new TransactionModel(),
  new TransactionModel(),
]

const assetNeo = new Asset()
assetNeo.nameSymbol = 'NEO'
assetNeo.srcIcon = require('~src/assets/logos/logo-neo.png')
assetNeo.value = 34534

const assetDbc = new Asset()
assetDbc.nameSymbol = 'DBC'
assetDbc.srcIcon = require('~src/assets/images/icon_DBC.png')
assetDbc.value = 532

const assetOnt = new Asset()
assetOnt.nameSymbol = 'ONT'
assetOnt.srcIcon = require('~src/assets/images/icon_ONT.png')
assetOnt.value = 34534

const receiverWithNameOne = new Receiver()
receiverWithNameOne.isAddress = false
receiverWithNameOne.nameOrAdress = 'Tyler'
receiverWithNameOne.assets = [assetNeo, assetDbc, assetOnt]

const receiverWithNameTwo = new Receiver()
receiverWithNameTwo.isAddress = false
receiverWithNameTwo.nameOrAdress = 'Jack Wallets'
receiverWithNameTwo.assets = [assetOnt, assetDbc]

const receiverWithNameThree = new Receiver()
receiverWithNameThree.isAddress = false
receiverWithNameThree.nameOrAdress = 'Mr fields'
receiverWithNameThree.assets = [assetNeo, assetDbc]

const receiverAddressOne = new Receiver()
receiverAddressOne.isAddress = true
receiverAddressOne.nameOrAdress = 'AN8iLVt18CKoATdexztCQj923hw5gkc41A'
receiverAddressOne.assets = [assetNeo, assetDbc, assetOnt]

const receiverAddressTwo = new Receiver()
receiverAddressTwo.isAddress = true
receiverAddressTwo.nameOrAdress = 'BN8iLVt18CKoATdexztCQj923hw5gkc41A'
receiverAddressTwo.assets = [assetDbc, assetOnt]

const receiverAddressThree = new Receiver()
receiverAddressThree.isAddress = true
receiverAddressThree.nameOrAdress = 'CN8iLVt18CKoATdexztCQj923hw5gkc41A'
receiverAddressThree.assets = [assetNeo, assetOnt]

const transactionToday = new Transaction()
transactionToday.receiver = [receiverWithNameOne, receiverAddressOne]

const transactionToday2 = new Transaction()
transactionToday2.receiver = [
  receiverWithNameTwo,
  receiverAddressTwo,
  receiverAddressThree,
]

const transactionYesterday = new Transaction()
transactionYesterday.receiver = [receiverWithNameThree]

mockAccountAssetDetails[0].date = new Date()
mockAccountAssetDetails[0].srcIcon = require('~src/assets/images/arrow.png')
mockAccountAssetDetails[0].transactions = [transactionToday, transactionToday2]

mockAccountAssetDetails[1].date = new Date(
  mockAccountAssetDetails[0].date.getDate() - 1
)
mockAccountAssetDetails[1].srcIcon = require('~src/assets/images/arrow.png')
mockAccountAssetDetails[1].transactions = [transactionYesterday]
