import debounce from '../helpers/debouncer'
import { IAsyncState, IObjectItem } from '../types/dropdown'
import { useEffect, useState } from 'react'

function useAsyncDropdown({
  asyncFunction,
  filterText,
  minimumSearchQuery,
  asyncValue,
  debounceTime,
}: {
  asyncFunction: any
  filterText: string
  minimumSearchQuery: number
  asyncValue: IObjectItem | IObjectItem[] | undefined
  debounceTime: number
}) {
  const [asyncState, setAsyncState] = useState<IAsyncState>({
    loading: false,
    error: null,
    data: [],
    selectedItems: [],
  })

  useEffect(() => {
    if (Array.isArray(asyncValue)) {
      setAsyncState((prev: IAsyncState) => ({
        ...prev,
        selectedItems: asyncValue,
      }))
    }
    if (!Array.isArray(asyncValue) && asyncValue) {
      setAsyncState((prev: IAsyncState) => ({
        ...prev,
        selectedItems: [asyncValue],
      }))
    }
  }, [asyncValue])

  const handleAsyncSelect = (item: IObjectItem) => {
    setAsyncState((prev) => {
      if (prev.selectedItems.some((prevItem) => prevItem.value === item.value))
        return prev

      const newState = { ...prev, selectedItems: [...prev.selectedItems, item] }

      return newState
    })
  }

  const handleAsyncRemoveSingle = (item: IObjectItem) => {
    setAsyncState((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter(
        (prevItem) => prevItem.value !== item.value
      ),
    }))
  }

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
    }, debounceTime) // set a delay time in milliseconds

    // If an async function has been passed to the dropdown and if the filterText is greater than the minimumSearchQuery, then set the loading state to true and call the debouncedGetDropdownData function
    if (asyncFunction && filterText.length >= minimumSearchQuery) {
      setAsyncState((prev: IAsyncState) => ({
        ...prev,
        loading: true,
      }))

      debouncedGetDropdownData()
    }
  }, [filterText, asyncFunction, minimumSearchQuery])

  return { asyncState, handleAsyncSelect, handleAsyncRemoveSingle }
}

export default useAsyncDropdown
