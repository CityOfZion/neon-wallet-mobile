# @simpli/react-native-storage

Deserialize your async-storage

## Installation

```sh
npm install @simpli/react-native-storage
```

## Usage

### ~/src/User.ts
```tsx
import {DataStorage} from '@simpli/react-native-storage'

export class User {
  name?: string
  surname?: string

  async save() {
    // Associate the key '@user' as User class then save this content
    return await DataStorage.bind('@user').as(User).save(this)
  }

  async load() {
    // Associate the key '@user' as this instance them populate in it
    return await DataStorage.bind('@user').as(this).load()
    // Note: alternatively, you can replace this to User, but it won't populate.
    // The response will be in the return.
  }
}
```

### ~/src/App.tsx
```tsx
import * as React from 'react'
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native'
import {User} from './User'
import {useState} from 'react'

export default function App() {
  const [name, setName] = useState<string>()
  const [surname, setSurname] = useState<string>()

  const user = new User()

  const persist = async () => {
    user.name = name
    user.surname = surname
    await user.save()
    Alert.alert('Restart the app')
  }

  const populate = async () => {
    await user.load()
    setName(user.name)
    setSurname(user.surname)
  }

  return (
    <View onLayout={() => populate()}>
      <Text>Your profile: </Text>

      <TextInput
        placeholder={'Name'}
        value={name}
        onChangeText={(val) => setName(val)}
      />

      <TextInput
        placeholder={'Surname'}
        value={surname}
        onChangeText={(val) => setSurname(val)}
      />

      <Button title={'Update your profile'} onPress={() => persist()} />
    </View>
  )
}
````

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
