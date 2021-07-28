import * as Random from 'expo-random';

// eslint-disable-next-line no-undef
if (typeof window.crypto == 'undefined') {
  // eslint-disable-next-line no-undef
  window.crypto = {
    getRandomValues(typedArray) {
      for (let i = 0; i < typedArray.length; i++) {
        typedArray[i] = Random.getRandomBytes(typedArray.BYTES_PER_ELEMENT)
      }
    },
  }
}
