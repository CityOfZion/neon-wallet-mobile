import { createNativeStackNavigator } from '@react-navigation/native-stack'

import type { TSearchStackParamList } from '@/types/stacks'

const SearchNavigator = createNativeStackNavigator<TSearchStackParamList>()

export const SearchStack = () => {
  return (
    <SearchNavigator.Navigator screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
      <SearchNavigator.Screen
        name="SearchScreen"
        getComponent={() => require('@/routes/screens/SearchScreen').SearchScreen}
      />
    </SearchNavigator.Navigator>
  )
}
