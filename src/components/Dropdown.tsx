import { IDropdownProps } from '../types/dropdown'
import React from 'react'
import '../style.css'
import 'tailwindcss/tailwind.css'
import useDropdown from '../hooks/useDropdown'
import MultiDropdownToggle from './MultiDropdownToggle'
import { ChevronDownIcon, ChevronUpIcon, XIcon } from './icons'

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
 * @param asyncFunction - A function to handle the async call to get the dropdown data, takes the search query as an argument, should return an array of objects {label: string, value: string} - optional
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
  asyncFunction,
  stylingClassnames,
  clearable = true,
  isMulti = false,
}: IDropdownProps) {
  const {
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
    classnames,
    handleInputChange,
    dropdownList,
    handleRemoveSingle,
  } = useDropdown({
    items,
    initialValue,
    searchable,
    alternate,
    emptySearchPhrase,
    noResultsPhrase,
    minimumSearchQuery,
    asyncFunction,
    stylingClassnames,
    isMulti,
  })

  const label = Array.isArray(selectedItem)
    ? selectedItem?.length > 0
      ? selectedItem
      : placeholder
    : selectedItem?.label ?? placeholder

  const iconClassnames =
    'w-5 h-5 transition-all cursor-pointer duration-300 ease-in-out'

  return (
    <div
      className={`w-full text-black relative`}
      ref={dropdownRef}
      role="listbox"
      aria-label={placeholder}
      tabIndex={0}
      onFocus={() => setIsOpen(true)}
      onBlur={() => !searchable && setIsOpen(false)}
    >
      <div className={`relative ${classnames.container} ${classnames.rounded}`}>
        <select
          ref={selectRef}
          tabIndex={-1}
          aria-hidden="true"
          id="shadow-select"
          name={name}
          value={
            Array.isArray(selectedItem)
              ? selectedItem.map((item) => item.value)
              : selectedItem?.value
          }
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
        {Array.isArray(selectedItem) ? (
          <MultiDropdownToggle
            label={selectedItem.length > 0 ? selectedItem : placeholder}
            iconColour={classnames.iconColour}
            handleRemoveSingle={handleRemoveSingle}
            stylingClassnames={classnames}
            searchable={searchable}
          />
        ) : (
          <div className="p-1.5 flex justify-between items-center select-none bg-transparent w-full">
            <p>{selectedItem?.label ?? placeholder}</p>
          </div>
        )}
        {searchable && (
          <input
            id="dropdown-search"
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            className={`${classnames.input} ${classnames.rounded} bg-red-500`}
            type="search"
            placeholder={
              Array.isArray(selectedItem)
                ? placeholder
                : selectedItem?.label || placeholder
            }
            value={filterText}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            ref={inputRef}
            autoComplete="off"
          />
        )}
        <div className="flex h-full ml-auto">
          {label !== placeholder && clearable && (
            <XIcon
              fill={classnames?.iconColour ?? '#000'}
              className={iconClassnames}
              onClick={() => {
                handleRemoveSelected && handleRemoveSelected()
                setFilterText('')
              }}
            />
          )}
          {isOpen ? (
            <ChevronUpIcon
              fill={classnames?.iconColour ?? '#000'}
              className={iconClassnames + 'rotate'}
              onClick={handleToggle}
            />
          ) : (
            <ChevronDownIcon
              fill={classnames?.iconColour ?? '#000'}
              className={iconClassnames + 'rotate-back'}
              onClick={handleToggle}
            />
          )}
        </div>
        {isOpen && dropdownList}
      </div>
    </div>
  )
}
