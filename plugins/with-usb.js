const { withAndroidManifest } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

function addUsbAttachedIntent(modResults) {
  const { manifest } = modResults

  if (!Array.isArray(manifest['application'])) {
    console.warn('withWordlLineIntentActivity: No application array in manifest?')
    return modResults
  }

  const application = manifest['application'].find(item => item.$['android:name'] === '.MainApplication')
  if (!application) {
    console.warn('withWordlLineIntentActivity: No .MainApplication?')
    return modResults
  }

  if (!Array.isArray(application['activity'])) {
    console.warn('withWordlLineIntentActivity: No activity array in .MainApplication?')
    return modResults
  }

  const activity = application['activity'].find(item => item.$['android:name'] === '.MainActivity')
  if (!activity) {
    console.warn('withWordlLineIntentActivity: No .MainActivity?')
    return modResults
  }

  if (!Array.isArray(activity['intent-filter'])) {
    console.warn('withWordlLineIntentActivity: No intent-filter array in .MainActivity?')
    return modResults
  }

  // Remove existing USB_DEVICE_ATTACHED intent-filter
  activity['intent-filter'] = activity['intent-filter'].filter(
    item => item.action[0].$['android:name'] !== 'android.hardware.usb.action.USB_DEVICE_ATTACHED'
  )

  const action = {}
  action.$ = {
    ...action.$,
    ...{
      'android:name': 'android.hardware.usb.action.USB_DEVICE_ATTACHED',
    },
  }

  const intent = { action }
  activity['intent-filter'].push(intent)

  const metadata = {}
  metadata.$ = {
    ...metadata.$,
    ...{
      'android:name': 'android.hardware.usb.action.USB_DEVICE_ATTACHED',
      'android:resource': '@xml/usb_device_filter',
    },
  }

  // Add metadata to activity if it doesn't exist
  activity['meta-data'] = activity['meta-data'] || []

  // Remove existing USB_DEVICE_ATTACHED metadata
  activity['meta-data'] = activity['meta-data'].filter(
    item => item.$['android:name'] !== 'android.hardware.usb.action.USB_DEVICE_ATTACHED'
  )

  activity['meta-data'].push(metadata)

  return modResults
}

function createUsbFilterXml(config) {
  const rootPath = path.resolve(config.modRequest.projectRoot, 'android')
  const resourcePath = path.resolve(rootPath, 'app/src/main/res/xml')

  if (!fs.existsSync(resourcePath)) {
    fs.mkdirSync(resourcePath, { recursive: true })
  }

  const xmlPath = path.resolve(resourcePath, 'usb_device_filter.xml')
  if (fs.existsSync(xmlPath)) {
    fs.rmSync(xmlPath)
  }

  fs.writeFileSync(
    xmlPath,
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <usb-device vendor-id="11415" />
</resources>`
  )
}

module.exports = function withIntentActivity(config) {
  return withAndroidManifest(config, config => {
    config.modResults = addUsbAttachedIntent(config.modResults)

    createUsbFilterXml(config)

    return config
  })
}
