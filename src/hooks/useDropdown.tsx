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
  searchable = false,
  alternate = false,
  emptySearchPhrase = 'Start typing to search',
  noResultsPhrase = 'No items match your search',
  minimumSearchQuery = 1,
  asyncFunction,
  stylingClassnames,
  isMulti,
  value,
  asyncValue,
  debounceTime,
  disabled,
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
  const [filterText, setFilterText] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)
  const dropdownRef = useRef<HTMLInputElement>(null)
  useClickOutside(dropdownRef, () => setIsOpen(false))
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0)

  useEffect(() => {
    setFilteredItems(items || [])
  }, [items])

  useEffect(() => {
    const disableElements = (element: HTMLElement) => {
      // Remove hover styles
      element.style.pointerEvents = disabled ? 'none' : ''

      // Disable form controls
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLButtonElement ||
        element instanceof HTMLSelectElement
      ) {
        element.disabled = !!disabled
      }

      // Recursively disable children
      Array.from(element.children).forEach((child) => {
        disableElements(child as HTMLElement)
      })
    }

    // Start disabling from the container
    if (dropdownRef.current) {
      disableElements(dropdownRef.current)
    }
  }, [disabled])

  const { handleSelection, handleDeselection, handleRemoveAllSelected } =
    useMultiDropdown({
      selectRef,
      dropdownRef,
      inputRef,
      setFilterText,
    })

  const {
    asyncState,
    handleAsyncSelect,
    handleAsyncRemoveSingle,
    memoisedDebouncedFetch,
  } = useAsyncDropdown({
    asyncFunction,
    filterText,
    minimumSearchQuery,
    asyncValue,
    debounceTime,
  })

  const { combinedClasses } = useStyling({
    stylingClassnames,
  })

  const handleItemClick = useCallback((item: IObjectItem | null) => {
    if (selectRef.current) {
      selectRef.current.value = item?.value ? item?.value : ''
      selectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
    dropdownRef.current?.blur()
    inputRef.current?.blur()
    setFilterText('')
    setFilteredItems(items || [])
  }, [])

  const handleRemoveSelected = () => {
    handleItemClick(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value)
    items && e.target.value.length > 0
      ? setFilteredItems(
          items?.filter((item: IObjectItem) => {
            return item.label
              ?.toLowerCase()
              .includes(e.target.value?.toLowerCase())
          })
        )
      : items && setFilteredItems(items)
    if (asyncFunction && e.target.value.length >= minimumSearchQuery) {
      memoisedDebouncedFetch(e.target.value)
    }
  }

  const handleMouseOver = (index: number) => {
    setHighlightedIndex(index)
  }

  const handleAsyncClick = (item: IObjectItem) => {
    handleAsyncSelect(item)
    handleItemClick(item)
    setFilterText('')
    setFilteredItems(items || [])
  }

  const handleAsyncMultiClick = (item: IObjectItem) => {
    handleAsyncSelect(item)
    handleSelection(item)
  }

  const handleAsyncDeselection = (item: IObjectItem) => {
    handleDeselection(item)
    handleAsyncRemoveSingle(item)
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
        !isMulti && handleItemClick(selectedItem)
        isMulti && handleSelect(selectedItem)
        asyncFunction && handleAsyncSelect(selectedItem)

        setFilterText('')
        setFilteredItems(items || [])
      }
      setIsOpen(false)
    }

    const handleSelect = (item: IObjectItem) => {
      isMulti ? handleSelection(item) : handleItemClick(item)
      setIsOpen(false)
      setFilterText('')
      setFilteredItems(items || [])
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
        handleClick={isMulti ? handleAsyncMultiClick : handleAsyncClick}
        dropdownClassnames={combinedClasses.dropdown}
        dropdownItemClassnames={combinedClasses.dropdownItem}
        loading={asyncState.loading}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={items?.find((item) => item?.value === value) ?? null}
        highlightColor={combinedClasses.highlightColor}
        highlightTextColor={combinedClasses.highlightTextColor}
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
        dropdownItemClassnames={combinedClasses.dropdownItem}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={items?.find((item) => item?.value === value) ?? null}
        highlightColor={combinedClasses.highlightColor}
        highlightTextColor={combinedClasses.highlightTextColor}
      />
    )
  } else if (isMulti) {
    dropdownList = (
      <DropdownList
        filterText={filterText}
        data={filteredItems}
        handleClick={(item) => {
          handleSelection(item)
          setFilterText('')
          setFilteredItems(items || [])
          asyncFunction && handleAsyncSelect(item)
        }}
        dropdownClassnames={combinedClasses.dropdown}
        dropdownItemClassnames={combinedClasses.dropdownItem}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={items?.filter((item) => value?.includes(item?.value)) ?? null}
        highlightColor={combinedClasses.highlightColor}
        highlightTextColor={combinedClasses.highlightTextColor}
      />
    )
  } else {
    dropdownList = (
      <DropdownList
        filterText={filterText}
        data={filteredItems}
        handleClick={handleItemClick}
        dropdownClassnames={combinedClasses.dropdown}
        dropdownItemClassnames={combinedClasses.dropdownItem}
        highlightedIndex={highlightedIndex}
        handleMouseOver={handleMouseOver}
        selected={items?.find((item) => item?.value === value) ?? null}
        highlightColor={combinedClasses.highlightColor}
        highlightTextColor={combinedClasses.highlightTextColor}
      />
    )
  }

  return {
    isOpen,
    setIsOpen,
    handleToggle,
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
    handleRemoveSingle: asyncFunction
      ? handleAsyncDeselection
      : handleDeselection,
  }
}

export default useDropdown
