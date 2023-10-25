import { IUseDropdownProps, IObjectItem } from '../types/dropdown'
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
import debounce from '../helpers/debouncer'
import DropdownList from '../components/DropdownList'
import useMultiDropdown from './useMultiDropdown'

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
  isMulti,
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
    multi: {
      selectedItemContainer:
        'relative flex items-center justify-center px-2 py-1 mr-2 text-sm text-black bg-gray-100 rounded-md shadow-md hover:text-[#F00] group hover:bg-gray-200 transition-all duration-300',
      selectedItemIconBox:
        'absolute right-0 top-0 translate-x-1/2 bg-gray-100 w-fit h-fit shadow-md group p-0.5 rounded-md flex justify-center items-center z-10 group-hover:bg-gray-200 transition-all duration-300',
      selectedItemIcon: 'w-3 h-3 cursor-pointer',
    },
  }

  const combinedClasses = {
    container: twMerge(defaultClasses.container, stylingClassnames?.container),
    input: twMerge(defaultClasses.input, stylingClassnames?.input),
    dropdown: twMerge(defaultClasses.dropdown, stylingClassnames?.dropdown),
    iconColour: stylingClassnames?.iconColour ?? defaultClasses.iconColour,
    rounded: twMerge(defaultClasses.rounded, stylingClassnames?.rounded),
    shadow: twMerge(defaultClasses.shadow, stylingClassnames?.shadow),
    multi: {
      selectedItemContainer: twMerge(
        defaultClasses.multi.selectedItemContainer,
        stylingClassnames?.multi?.selectedItemContainer
      ),
      selectedItemIconBox: twMerge(
        defaultClasses.multi.selectedItemIconBox,
        stylingClassnames?.multi?.selectedItemIconBox
      ),
      selectedItemIcon: twMerge(
        defaultClasses.multi.selectedItemIcon,
        stylingClassnames?.multi?.selectedItemIcon
      ),
    },
  }

  const {
    dropdown = 'absolute bottom-0 left-0 z-10 w-full translate-y-full h-fit dropdown-border bg-white',
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

  const {
    selectedItems,
    handleSelection,
    handleDeselection,
    handleRemoveAllSelected,
  } = useMultiDropdown({
    selectRef,
    dropdownRef,
    inputRef,
  })

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        handleArrowDown()
      } else if (e.key === 'ArrowUp') {
        handleArrowUp()
      } else if (e.key === 'Enter') {
        handleEnter()
      }
    }

    function handleArrowDown() {
      setHighlightedIndex((prevIndex) => {
        const maxIndex = getMaxIndex()
        const newIndex = prevIndex < maxIndex ? prevIndex + 1 : prevIndex
        focusOnItem(newIndex)
        return newIndex
      })
    }

    function handleArrowUp() {
      setHighlightedIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : 0
        if (prevIndex === 0 && searchable) {
          focusOnInput()
        } else {
          focusOnItem(newIndex)
        }
        return newIndex
      })
    }

    function handleEnter() {
      const maxIndex = getMaxIndex()
      console.log('maxIndex', maxIndex)
      if (highlightedIndex >= 0 && highlightedIndex <= maxIndex) {
        console.log('passed')
        const selectedItem = getSelectedItem()
        handleSelect(selectedItem)
      }
      setIsOpen(false)
    }

    const handleSelect = (item: IObjectItem) => {
      isMulti ? handleSelection(item) : handleItemClick(item)
      setIsOpen(false)
    }

    function getMaxIndex() {
      return items ? filteredItems.length - 1 : asyncState.data.length - 1
    }

    function getSelectedItem() {
      return items
        ? filteredItems[highlightedIndex]
        : asyncState.data[highlightedIndex]
    }

    function focusOnItem(index: number) {
      document.getElementById(`dropdown-item-${index}`)?.focus()
    }

    function focusOnInput() {
      inputRef.current?.focus()
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
  } else if (isMulti) {
    dropdownList = (
      <DropdownList
        filterText={filterText}
        data={filteredItems}
        handleClick={handleSelection}
        dropdownClassnames={dropdown}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={selectedItems}
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
    selectedItem: isMulti ? selectedItems : selectedItem,
    filterText,
    setFilterText,
    inputRef,
    selectRef,
    dropdownRef,
    asyncState,
    handleRemoveSelected: isMulti
      ? handleRemoveAllSelected
      : handleRemoveSelected,
    classnames: combinedClasses,
    handleInputChange,
    dropdownList,
    handleRemoveSingle: handleDeselection,
  }
}

export default useDropdown
