import { useAppSelector } from './useRedux'

export const useContactsSelector = () => {
  const { value, ref } = useAppSelector(state => state.contact.data)

  return {
    contacts: value,
    contactsRef: ref,
  }
}

export const useContactByIdSelector = (id: string) => {
  const { value, ref } = useAppSelector(state => state.contact.data.find(contact => contact.id === id))

  return {
    contactById: value,
    contactByIdRef: ref,
  }
}
