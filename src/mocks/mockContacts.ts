import {Facade} from '~src/app/Facade'
import {Contact} from '~src/models/redux/Contact'

const tyler = {
  id: Facade.utils.uuid(),
  name: 'Tyler',
  address: 'AHBcvTruuyqXwwBYk4FScKF6C4SEeyswpt',
}

const dean = {
  id: Facade.utils.uuid(),
  name: 'Dean',
  address: 'AJdF1hcpPj5snFjDHEQ2DfMwqp1kTsZjkn',
}
const james = {
  id: Facade.utils.uuid(),
  name: 'James',
  address: 'AJep7J7DZJtaS6s6yoeZgGYbCNsDuVuLWo',
}
const max = {
  id: Facade.utils.uuid(),
  name: 'Max',
  address: 'AKXmnk5kozi1Xa74PiZvxsCiLXJbP4FTf6',
}
const joao = {
  id: Facade.utils.uuid(),
  name: 'João',
  address: 'AKx4w5uiZk3PibFvhfGJ2FaSMczS7ZSBUJ',
}
const gibran = {
  id: Facade.utils.uuid(),
  name: 'Felipe Gibran',
  address: 'AMKaryYxG8UFaAufa4nmLbLpyk4uFHyfcR',
}
const meira = {
  id: Facade.utils.uuid(),
  name: 'Ricardo Meira',
  address: 'AMY1GgNq2ea3ffbzV8xKGZedz364gk5bsi',
}
const mirella = {
  id: Facade.utils.uuid(),
  name: 'Mirella',
  address: 'AQL4DQoXK59f1KTD16xGUZuosdZ4UEZnMP',
}
const thais = {
  id: Facade.utils.uuid(),
  name: 'Thais',
  address: 'ARtmDzcTZxHCYydqFxFw31d21CpSArZwi4',
}
const gabriel = {
  id: Facade.utils.uuid(),
  name: 'Gabriel',
  address: 'ASuhS7Jnicn3yGnx3P5z9bmDMYYVmCo3ii',
}

const campos = {
  id: Facade.utils.uuid(),
  name: 'Mr. Fields',
  address: 'ATTsD25x7MNa79tG62Cei9knugEvD4AVNk',
}

export const mockedContacts: Contact[] = [
  tyler,
  dean,
  james,
  max,
  joao,
  gibran,
  meira,
  mirella,
  thais,
  gabriel,
  campos,
]
