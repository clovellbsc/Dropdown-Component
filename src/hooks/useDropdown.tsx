import { IUseDropdownProps, IObjectItem } from '../types/dropdown'
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useClickOutside from './useClickOutside'
import DropdownList from '../components/DropdownList'
import useMultiDropdown from './useMultiDropdown'
import useAsyncDropdown from './useAsyncDropdown'
import useStyling from './useStyling'

function useDropdown({
  items,
  initialValue,
  searchable = false,
  alternate = false,
  emptySearchPhrase = 'Start typing to search',
  noResultsPhrase = 'No items match your search',
  minimumSearchQuery = 1,
  asyncFunction,
  stylingClassnames,
  isMulti,
}: IUseDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleToggle = (e: any) => {
    e.stopPropagation()
    if (isOpen) dropdownRef.current?.blur()
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
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0)

  const {
    selectedItems,
    handleSelection,
    handleDeselection,
    handleRemoveAllSelected,
  } = useMultiDropdown({
    selectRef,
    dropdownRef,
    inputRef,
    setFilterText,
  })

  const { asyncState } = useAsyncDropdown({
    asyncFunction,
    filterText,
    minimumSearchQuery,
  })

  const { combinedClasses } = useStyling({
    stylingClassnames,
  })

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        handleArrowDown()
      } else if (e.key === 'ArrowUp') {
        handleArrowUp()
      } else if (e.key === 'Enter') {
        handleEnter()
      }
    }

    const handleArrowDown = () => {
      setHighlightedIndex((prevIndex) => {
        const maxIndex = getMaxIndex()
        const newIndex = prevIndex < maxIndex ? prevIndex + 1 : prevIndex
        // focusOnItem(newIndex)
        return newIndex
      })
    }

    const handleArrowUp = () => {
      setHighlightedIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : 0
        if (prevIndex === 0 && searchable) {
          focusOnInput()
        } else {
          // focusOnItem(newIndex)
        }
        return newIndex
      })
    }

    const handleEnter = () => {
      const maxIndex = getMaxIndex()
      if (highlightedIndex >= 0 && highlightedIndex <= maxIndex) {
        const selectedItem = getSelectedItem()
        handleSelect(selectedItem)
        setFilterText('')
      }
      setIsOpen(false)
    }

    const handleSelect = (item: IObjectItem) => {
      isMulti ? handleSelection(item) : handleItemClick(item)
      setIsOpen(false)
    }

    const getMaxIndex = () => {
      return items ? filteredItems.length - 1 : asyncState.data.length - 1
    }

    const getSelectedItem = () => {
      return items
        ? filteredItems[highlightedIndex]
        : asyncState.data[highlightedIndex]
    }

    // const focusOnItem = (index: number) => {
    //   document.getElementById(`dropdown-item-${index}`)?.focus()
    // }

    const focusOnInput = () => {
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
    isMulti,
    handleSelection,
  ])

  let dropdownList: ReactNode

  if (asyncFunction) {
    dropdownList = (
      <DropdownList
        filterText={filterText}
        minimumSearchQuery={minimumSearchQuery}
        data={asyncState.data}
        emptySearchPhrase={emptySearchPhrase}
        noResultsPhrase={noResultsPhrase}
        handleClick={handleItemClick}
        dropdownClassnames={combinedClasses.dropdown}
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
        dropdownClassnames={combinedClasses.dropdown}
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
        dropdownClassnames={combinedClasses.dropdown}
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
        dropdownClassnames={combinedClasses.dropdown}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={selectedItem}
        highlightColor={stylingClassnames?.highlightColor ?? '#0000FF'}
        highlightTextColor={stylingClassnames?.highlightTextColor ?? '#fff'}
      />
    )
  }

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
