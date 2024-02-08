import debounce from '../helpers/debouncer'
import { IAsyncState, IObjectItem } from '../types/dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'

function useAsyncDropdown({
  asyncFunction,
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

  const setLoading = (loading: boolean) => {
    setAsyncState((prev: IAsyncState) => ({
      ...prev,
      loading,
    }))
  }

  const setAsyncData = (data: IObjectItem[]) => {
    setAsyncState((prev: IAsyncState) => ({
      ...prev,
      data,
    }))
  }

  // create a debounced getDropdownData function
  const handleFetch = useCallback(
    async (query: string) => {
      setLoading(true)
      const { data, error } = await asyncFunction(query)

      if (error) {
        console.error('error', error)
      }
      if (data) {
        setAsyncData(data)
      }

      setLoading(false)
    },
    [asyncFunction]
  )

  const memoisedDebouncedFetch = useMemo(
    () => debounce(handleFetch, debounceTime),
    [handleFetch, debounceTime]
  )

  return {
    asyncState,
    handleAsyncSelect,
    handleAsyncRemoveSingle,
    memoisedDebouncedFetch,
  }
}

export default useAsyncDropdown
