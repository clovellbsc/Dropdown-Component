import debounce from '../helpers/debouncer'
import { IAsyncState } from '../types/dropdown'
import { useEffect, useState } from 'react'

function useAsyncDropdown({
  asyncFunction,
  filterText,
  minimumSearchQuery,
}: any) {
  const [asyncState, setAsyncState] = useState<IAsyncState>({
    loading: false,
    error: null,
    data: [],
  })

  useEffect(() => {
    // create a debounced getDropdownData function
    const debouncedGetDropdownData = debounce(async () => {
      const { data, error } = await asyncFunction(filterText)

      setAsyncState((prev: IAsyncState) => ({
        ...prev,
        loading: false,
        error,
        data: data ?? [],
      }))
    }, 250) // set a delay time in milliseconds

    // If an async function has been passed to the dropdown and if the filterText is greater than the minimumSearchQuery, then set the loading state to true and call the debouncedGetDropdownData function
    if (asyncFunction && filterText.length >= minimumSearchQuery) {
      setAsyncState((prev: IAsyncState) => ({
        ...prev,
        loading: true,
      }))

      debouncedGetDropdownData()
    }
  }, [filterText, asyncFunction, minimumSearchQuery])

  return { asyncState }
}

export default useAsyncDropdown
