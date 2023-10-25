import { IDropdownProps } from '../types/dropdown'
import DropdownToggle from './DropdownToggle'
import React from 'react'
import '../style.css'
import 'tailwindcss/tailwind.css'
import useDropdown from '../hooks/useDropdown'
import MultiDropdownToggle from './MultiDropdownToggle'

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
    asyncConfig,
    stylingClassnames,
    isMulti,
  })

  console.log('selectedItem', selectedItem)

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
            clearable={clearable}
            label={selectedItem.length > 0 ? selectedItem : placeholder}
            placeholder={placeholder}
            handleRemoveSelected={handleRemoveSelected}
            removeSearchText={() => {
              setFilterText('')
            }}
            isOpen={isOpen}
            iconColour={classnames.iconColour}
            handleToggle={handleToggle}
            handleRemoveSingle={handleRemoveSingle}
            stylingClassnames={classnames}
          />
        ) : (
          <DropdownToggle
            clearable={clearable}
            label={selectedItem?.label ?? placeholder}
            placeholder={placeholder}
            handleRemoveSelected={handleRemoveSelected}
            removeSearchText={() => {
              setFilterText('')
            }}
            isOpen={isOpen}
            iconColour={classnames.iconColour}
            handleToggle={handleToggle}
          />
        )}
        {searchable && !isMulti && (
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
        {isOpen && dropdownList}
      </div>
    </div>
  )
}
