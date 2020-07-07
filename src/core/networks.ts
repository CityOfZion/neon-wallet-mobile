import {Facade} from '~src/app/Facade'

export const isMainNetwork = (networkId: string) =>
  networkId === Facade.app.mainNetworkId
export const isTestNetwork = (networkId: string) =>
  networkId === Facade.app.testNetworkId

export const getNetworks = () => [
  {
    id: Facade.app.mainNetworkId,
    value: Facade.app.mainNetworkId,
    label: Facade.app.mainNetworkLabel,
    deprecatedLabel: Facade.app.mainNetworkDeprecatedLabel,
    network: Facade.app.mainNetworkDeprecatedLabel,
  },
  {
    id: Facade.app.testNetworkId,
    value: Facade.app.testNetworkId,
    label: Facade.app.testNetworkLabel,
    deprecatedLabel: Facade.app.testNetworkDeprecatedLabel,
    network: Facade.app.testNetworkDeprecatedLabel,
  },
]

type NetworkType = string

type NetworkItemType = {
  value: string
  id: string
  label: string
  network: NetworkType
  deprecatedLabel: string
}

export const findNetwork = (networkId: string): NetworkItemType => {
  const networks = getNetworks()
  return networks.find(({id}) => id === networkId) ?? networks[0]
}

export const findNetworkByLabel = (networkLabel: string): NetworkItemType => {
  const networks = getNetworks()
  return networks.find(({label}) => networkLabel === label) ?? networks[0]
}

export const findNetworkByDeprecatedLabel = (
  deprecatedLabel: string
): NetworkItemType => {
  const networks = getNetworks()
  return (
    networks.find((network) => network.deprecatedLabel === deprecatedLabel) ??
    networks[0]
  )
}
