import {$} from '~/facade'

export const isMainNetwork = (networkId: string) =>
  networkId === $.app.mainNetworkId
export const isTestNetwork = (networkId: string) =>
  networkId === $.app.testNetworkId

export const getNetworks = () => [
  {
    id: $.app.mainNetworkId,
    value: $.app.mainNetworkId,
    label: $.app.mainNetworkLabel,
    deprecatedLabel: $.app.mainNetworkDeprecatedLabel,
    network: $.app.mainNetworkDeprecatedLabel,
  },
  {
    id: $.app.testNetworkId,
    value: $.app.testNetworkId,
    label: $.app.testNetworkLabel,
    deprecatedLabel: $.app.testNetworkDeprecatedLabel,
    network: $.app.testNetworkDeprecatedLabel,
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
