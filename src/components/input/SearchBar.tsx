import PropTypes from 'prop-types'
import React from 'react'
import {StyleSheet, View, Image, TextInput} from 'react-native'

import {Facade} from '~src/app/Facade'
type TSearchBar<P = any> = {
  prevData: P[]
  callbackFilter: (strFilter: string) => void
  dispatchData: React.Dispatch<React.SetStateAction<P[]>>
}

export const SearchBar: React.FC<TSearchBar> = ({
  callbackFilter,
  prevData,
  dispatchData,
}) => {
  const handleFilter = (searchText: string) => {
    if (searchText === '') {
      dispatchData(prevData)
    } else {
      callbackFilter(searchText)
    }
  }

  const styles = StyleSheet.create({
    design: {
      borderRadius: 21,
      height: 42,
      borderColor: '#f00',
      backgroundColor: '#191f23',
      marginHorizontal: 10,
      marginVertical: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    input: {
      flex: 1,
      color: '#899fa8',
      fontFamily: 'light',
      fontWeight: '300',
      textAlignVertical: 'center',
      fontSize: 20, 
    },
    icon: {
      marginRight: 10,
    },
  })
  return (
    <View style={styles.design}>
      <Image
        source={require('~/src/assets/images/icon-search-gray.png')}
        style={styles.icon}
      />
      <TextInput
        onChange={(e) => handleFilter(e.nativeEvent.text)}
        style={styles.input}
        placeholder={Facade.t('persistContact.search')}
        placeholderTextColor="#899fa8"
      />
    </View>
  )
}

SearchBar.propTypes = {
  prevData: PropTypes.any.isRequired,
  callbackFilter: PropTypes.any.isRequired,
  dispatchData: PropTypes.any.isRequired,
}
