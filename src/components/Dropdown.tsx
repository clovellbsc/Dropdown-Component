import { useState, useRef, useEffect, useCallback } from 'react'
import Item from './DropdownItem'
import DropdownList from './DropdownList'
import { ObjectClickHandler, IObjectItem } from '../types/dropdown'
import DropdownToggle from './DropdownToggle'
import useDropdownData from '../hooks/useDropdownData'
// import { useClientData } from '@/context/clientContext'
import debounce from '../helpers/debouncer'
import useClickOutside from '../hooks/useClickOutside'
import { twMerge } from 'tailwind-merge'
import React from 'react'
import '../style.css'
import 'tailwindcss/tailwind.css'

interface IAsyncConfig {
  label: string | Array<string>
  url: string
  value?: string
  query?: {
    [key: string]: any
  }
}

interface IAsyncState {
  loading: boolean
  error: null | Error
  data: IObjectItem[]
}
interface IDropdownProps {
  placeholder: string
  items?: IObjectItem[]
  onChange: ObjectClickHandler
  searchable?: boolean
  emptySearchPhrase?: string
  noResultsPhrase?: string
  minimumSearchQuery?: number
  alternate?: boolean
  name?: string
  initialValue?: string

  asyncConfig?: IAsyncConfig

  clearable?: boolean

  roundedClass?: string
  stylingClassnames?: {
    container?: string
    input?: string
    dropdown?: string
    iconColour?: string
    rounded?: string
    shadow?: string
    highlightColor?: string
    highlightTextColor?: string
  }

  isMulti?: boolean
}

interface IAsyncState {
  loading: boolean
  error: null | Error
  data: IObjectItem[]
}

/**
 *
 * @param items - { icon?: {alt: string, url: string}, value: string, label: string, [key: string]: any} - not needed if asyncConfig is provided
 * @param initialValue - initial value from the dropdown options
 * @param placeholder - A string that is displayed as the placeholder for the dropdown
 * @param name - A string that is used as the name for the dropdown - optional if not passed the name returned will be the label of the selected item
 * @param onChange - A function that handles the click event of a dropdown item and returns the item object selected
 * @param searchable - A boolean that determines whether the dropdown is searchable - optional - defaults to false
 * @param alternate - A boolean that determines whether the dropdown displays the emptySearchPhrase or noResultsPhrase and utilises the minimumSearchQuery - optional - defaults to false
 * @param emptySearchPhrase - A string that is displayed when the search input is empty - optional - defaults to "Start typing to search"
 * @param noResultsPhrase - A string that is displayed when the search input returns no results - optional - defaults to "No items match your search"
 * @param minimumSearchQuery - A number that determines the minimum number of characters required to trigger the search - optional - defaults to 1
 * @param stylingClassnames - An object that contains the classnames for the dropdown container, input, dropdown, iconColour, rounded and shadow - optional
 * @param asyncConfig - An object that contains the label, url, value and query for the async dropdown uses the http helper - optional
 * @param clearable - A boolean that determines whether the dropdown can be cleared - optional - defaults to true
 * @returns The dropdown component
 */

export default function Dropdown({
  items,
  initialValue,
  placeholder,
  name,
  onChange,
  searchable = false,
  alternate = false,
  emptySearchPhrase = 'Start typing to search',
  noResultsPhrase = 'No items match your search',
  minimumSearchQuery = 1,
  asyncConfig,
  stylingClassnames,
  clearable = true,
  isMulti = false,
}: IDropdownProps) {
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
  // const {
  //   data: { client },
  // } = useClientData()
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
    container = 'inline-block w-full text-left bg-white rounded cursor-pointer max-w-screen table-border',
    input = 'absolute top-0 left-0 w-[90%] max-h-full px-5 py-2 text-sm bg-white outline-none',
    dropdown = 'absolute bottom-0 left-0 z-10 w-full translate-y-full h-fit dropdown-border bg-white',
    iconColour = 'black',
    rounded = 'rounded',
    shadow = '',
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
            // clientId: client.id,
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

  const renderAsyncDropdown = () => {
    return (
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
  }

  const renderDropdownList = () => {
    if (alternate) {
      return (
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
      return (
        <ul className={`${dropdown} ${shadow}`} id="dropdown-list">
          {filteredItems?.map((item: IObjectItem, index: number) => {
            return (
              <li
                key={index}
                onClick={() => handleItemClick(item)}
                onMouseDown={(e) => e.preventDefault()}
                onMouseOver={() => handleMouseOver(index)}
                tabIndex={-1}
                id={`dropdown-item-${index}`}
                className="focus:outline-none"
              >
                <Item
                  item={item}
                  highlighted={highlightedIndex === index}
                  selected={selectedItem?.value === item.value}
                  highlightColor={
                    stylingClassnames?.highlightColor ?? '#0000FF'
                  }
                  highlightTextColor={
                    stylingClassnames?.highlightTextColor ?? '#fff'
                  }
                />
              </li>
            )
          })}
        </ul>
      )
    }
  }

  useEffect(() => {
    if (inputRef.current && isOpen) {
      inputRef.current.focus()
    } else {
      inputRef.current && inputRef.current.blur()
    }
  }, [isOpen])

  return (
    <div
      className={`w-full text-black`}
      ref={dropdownRef}
      role="listbox"
      aria-label={placeholder}
      tabIndex={0}
      onFocus={() => setIsOpen(true)}
      onBlur={() => !searchable && setIsOpen(false)}
    >
      <div className={`relative ${container} ${rounded}`}>
        <select
          ref={selectRef}
          tabIndex={-1}
          aria-hidden="true"
          id="shadow-select"
          name={name ?? selectedItem?.label}
          value={selectedItem?.value}
          className="opacity-0 sr-only"
          onChange={onChange}
          multiple={isMulti}
        >
          {items
            ? items?.map((item) => {
                return (
                  <option
                    key={item.value}
                    value={item.value}
                    className="opacity-0"
                  >
                    {item.label}
                  </option>
                )
              })
            : asyncState.data.map((item) => {
                return (
                  <option
                    key={item.value}
                    value={item.value}
                    className="opacity-0"
                  >
                    {item.label}
                  </option>
                )
              })}
        </select>
        <DropdownToggle
          clearable={clearable}
          label={selectedItem?.label ?? placeholder}
          placeholder={placeholder}
          handleRemoveSelected={handleRemoveSelected}
          removeSearchText={() => {
            setFilterText('')
          }}
          isOpen={isOpen}
          iconColour={iconColour}
          handleToggle={handleToggle}
        />
        {searchable && (
          <input
            id="dropdown-search"
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            className={`${input} ${rounded} bg-red-500`}
            type="search"
            placeholder={selectedItem?.label || placeholder}
            value={filterText}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            ref={inputRef}
            autoComplete="off"
          />
        )}
        {isOpen && (asyncConfig ? renderAsyncDropdown() : renderDropdownList())}
      </div>
    </div>
  )
}
