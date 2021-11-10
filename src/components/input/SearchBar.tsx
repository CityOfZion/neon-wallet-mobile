import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React from 'react'
import {StyleSheet, View, Image, TextInput} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'

type TSearchBar<P = any> = {
  prevData: P[]
  callbackFilter: (strFilter: string) => void
  dispatchData: React.Dispatch<React.SetStateAction<P[]>>
  marginH?: number
  lighterColor?: boolean
  emptySearchList: React.Dispatch<React.SetStateAction<boolean>>
}

export const SearchBar: React.FC<TSearchBar> = ({
  callbackFilter,
  prevData,
  dispatchData,
  marginH,
  lighterColor,
  emptySearchList,
}) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const handleFilter = (searchText: string) => {
    if (searchText === '') {
      dispatchData(prevData)
      emptySearchList(false)
    } else {
      callbackFilter(searchText)
    }
  }

  const styles = StyleSheet.create({
    design: {
      borderRadius: 21,
      height: 42,
      backgroundColor: lighterColor ? '#273037' : theme.colors.background[12],
      marginHorizontal: marginH ?? 5,
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
        placeholder={i18n.t('persistContact.search')}
        placeholderTextColor="#899fa8"
      />
    </View>
  )
}

SearchBar.propTypes = {
  prevData: PropTypes.any.isRequired,
  callbackFilter: PropTypes.any.isRequired,
  dispatchData: PropTypes.any.isRequired,
  marginH: PropTypes.any.isRequired,
  lighterColor: PropTypes.bool,
  emptySearchList: PropTypes.any.isRequired,
}
