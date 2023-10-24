import { IUseDropdownProps, IObjectItem } from '@/types/dropdown'
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useClickOutside from './useClickOutside'
import useDropdownData from './useDropdownData'
import { twMerge } from 'tailwind-merge'
import debounce from '@/helpers/debouncer'
import DropdownList from '@/components/DropdownList'

interface IAsyncState {
  loading: boolean
  error: null | Error
  data: IObjectItem[]
}

function useDropdown({
  items,
  initialValue,
  searchable = false,
  alternate = false,
  emptySearchPhrase = 'Start typing to search',
  noResultsPhrase = 'No items match your search',
  minimumSearchQuery = 1,
  asyncConfig,
  stylingClassnames,
}: IUseDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }
  const [filteredItems, setFilteredItems] = useState<Array<IObjectItem>>(
    items || []
  )
  const [selectedItem, setSelectedItem] = useState<IObjectItem | null>(
    filteredItems.find((item) => item.value === initialValue) ?? null
  )
  const [filterText, setFilterText] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)
  const dropdownRef = useRef<HTMLInputElement>(null)
  useClickOutside(dropdownRef, () => setIsOpen(false))
  const [asyncState, setAsyncState] = useState<IAsyncState>({
    loading: false,
    error: null,
    data: [],
  })
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0)
  const { getDropdownData } = useDropdownData()

  const handleItemClick = useCallback((item: IObjectItem | null) => {
    setSelectedItem(item)
    setFilterText('')
    if (selectRef.current) {
      selectRef.current.value = item?.value ? item?.value : ''
      selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
    dropdownRef.current?.blur()
    inputRef.current?.blur()
  }, [])

  const handleRemoveSelected = () => {
    handleItemClick(null)
  }

  const defaultClasses = {
    container:
      'inline-block w-full text-left bg-white rounded cursor-pointer max-w-screen border border-gray-400',
    input:
      'absolute top-0 left-0 w-[90%] max-h-full px-5 py-2 text-sm bg-white outline-none',
    dropdown:
      'absolute bottom-0 left-0 z-10 w-full translate-y-full h-fit dropdown-border bg-white',
    iconColour: 'black',
    rounded: 'rounded',
    shadow: 'shadow-md',
  }

  const combinedClasses = {
    container: twMerge(defaultClasses.container, stylingClassnames?.container),
    input: twMerge(defaultClasses.input, stylingClassnames?.input),
    dropdown: twMerge(defaultClasses.dropdown, stylingClassnames?.dropdown),
    iconColour: stylingClassnames?.iconColour ?? defaultClasses.iconColour,
    rounded: twMerge(defaultClasses.rounded, stylingClassnames?.rounded),
    shadow: twMerge(defaultClasses.shadow, stylingClassnames?.shadow),
  }

  const {
    // container = 'inline-block w-full text-left bg-white rounded cursor-pointer max-w-screen table-border',
    // input = 'absolute top-0 left-0 w-[90%] max-h-full px-5 py-2 text-sm bg-white outline-none',
    dropdown = 'absolute bottom-0 left-0 z-10 w-full translate-y-full h-fit dropdown-border bg-white',
    // iconColour = 'black',
    // rounded = 'rounded',
    // shadow = '',
  } = combinedClasses

  useEffect(() => {
    items && filterText.length > 0
      ? setFilteredItems(
          items?.filter((item: IObjectItem) => {
            return item.label.toLowerCase().includes(filterText.toLowerCase())
          })
        )
      : items && setFilteredItems(items)
  }, [items, filterText])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value)
  }

  const handleMouseOver = (index: number) => {
    setHighlightedIndex(index)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        // Move down the list
        setHighlightedIndex((prevIndex) => {
          if (items) {
            const newIndex =
              prevIndex < filteredItems.length - 1 ? prevIndex + 1 : prevIndex
            document.getElementById(`dropdown-item-${newIndex}`)?.focus()
            return newIndex
          } else {
            const newIndex =
              prevIndex < asyncState.data.length - 1 ? prevIndex + 1 : prevIndex
            document.getElementById(`dropdown-item-${newIndex}`)?.focus()
            return newIndex
          }
        })
      } else if (e.key === 'ArrowUp') {
        // Move up the list
        setHighlightedIndex((prevIndex) => {
          if (prevIndex > 0) {
            const newIndex = prevIndex - 1
            document.getElementById(`dropdown-item-${newIndex}`)?.focus()
            return newIndex
          } else if (prevIndex === 0 && searchable) {
            inputRef.current?.focus()
            return prevIndex
          } else {
            return prevIndex
          }
        })
      } else if (e.key === 'Enter') {
        // Select the highlighted option
        if (
          highlightedIndex >= 0 &&
          (filteredItems
            ? highlightedIndex < filteredItems.length
            : asyncState.data.length)
        ) {
          handleItemClick(
            filteredItems
              ? filteredItems[highlightedIndex]
              : asyncState.data[highlightedIndex]
          )
        }
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    } else {
      setHighlightedIndex(0)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    highlightedIndex,
    isOpen,
    asyncState.data,
    items,
    handleItemClick,
    setIsOpen,
    setHighlightedIndex,
    filteredItems,
    searchable,
  ])

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

  let dropdownList: ReactNode

  if (asyncConfig) {
    dropdownList = (
      <DropdownList
        filterText={filterText}
        minimumSearchQuery={minimumSearchQuery}
        data={asyncState.data}
        emptySearchPhrase={emptySearchPhrase}
        noResultsPhrase={noResultsPhrase}
        handleClick={handleItemClick}
        dropdownClassnames={dropdown}
        loading={asyncState.loading}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={selectedItem}
        highlightColor={stylingClassnames?.highlightColor ?? '#0000FF'}
        highlightTextColor={stylingClassnames?.highlightTextColor ?? '#fff'}
      />
    )
  } else if (alternate) {
    dropdownList = (
      <DropdownList
        filterText={filterText}
        minimumSearchQuery={minimumSearchQuery}
        data={filteredItems}
        emptySearchPhrase={emptySearchPhrase}
        noResultsPhrase={noResultsPhrase}
        handleClick={handleItemClick}
        dropdownClassnames={dropdown}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={selectedItem}
        highlightColor={stylingClassnames?.highlightColor ?? '#0000FF'}
        highlightTextColor={stylingClassnames?.highlightTextColor ?? '#fff'}
      />
    )
  } else {
    dropdownList = (
      <DropdownList
        filterText={filterText}
        data={filteredItems}
        handleClick={handleItemClick}
        dropdownClassnames={dropdown}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={selectedItem}
        highlightColor={stylingClassnames?.highlightColor ?? '#0000FF'}
        highlightTextColor={stylingClassnames?.highlightTextColor ?? '#fff'}
      />
    )
  }

  useEffect(() => {
    if (inputRef.current && isOpen) {
      inputRef.current.focus()
    } else {
      inputRef.current && inputRef.current.blur()
    }
  }, [isOpen])

  return {
    isOpen,
    setIsOpen,
    handleToggle,
    selectedItem,
    filterText,
    setFilterText,
    inputRef,
    selectRef,
    dropdownRef,
    asyncState,
    handleRemoveSelected,
    classnames: combinedClasses,
    handleInputChange,
    dropdownList,
  }
}

export default useDropdown
