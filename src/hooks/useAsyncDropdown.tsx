import debounce from '../helpers/debouncer'
import { IAsyncState } from '../types/dropdown'
import { useEffect, useState } from 'react'
import useDropdownData from './useDropdownData'

function useAsyncDropdown({
  asyncConfig,
  filterText,
  minimumSearchQuery,
}: any) {
  const { getDropdownData } = useDropdownData()
  const [asyncState, setAsyncState] = useState<IAsyncState>({
    loading: false,
    error: null,
    data: [],
  })

  useEffect(() => {
    if (asyncConfig && filterText.length >= minimumSearchQuery) {
      setAsyncState((currentState: IAsyncState) => ({
        ...currentState,
        loading: true,
      }))

      // create a config object to pass to the getDropdownData from the useDropdownData hook
      const dropdownConfig = {
        label: asyncConfig?.label,
        value: asyncConfig?.value,
        config: {
          url: asyncConfig?.url,
          query: {
            ...asyncConfig?.query,
            search: filterText,
          },
        },
      }

      // create a debounced getDropdownData function
      const debouncedGetDropdownData = debounce(async () => {
        const { data, error } = await getDropdownData(dropdownConfig)

        setAsyncState((currentState: IAsyncState) => ({
          ...currentState,
          loading: false,
          error,
          data,
        }))
      }, 250) // set a delay time in milliseconds

      debouncedGetDropdownData()
    }
  }, [filterText, asyncConfig, minimumSearchQuery])

  return { asyncState }
}

export default useAsyncDropdown
