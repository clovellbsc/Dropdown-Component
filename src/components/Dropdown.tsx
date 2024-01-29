import { IDropdownProps, IObjectItem } from '../types/dropdown'
import React from 'react'
import useDropdown from '../hooks/useDropdown'
import MultiDropdownToggle from './MultiDropdownToggle'
import { ChevronDownIcon, ChevronUpIcon, XIcon } from './icons'
import mergeArraysAndRemoveDuplicates from '../helpers/mergeArraysWithoutDuplicate'

/**
 *
 * @param items - { icon?: {alt: string, url: string}, value: string, label: string} - do not use with async dropdown
 * @param value - current value of the dropdown - not to be used with async dropdown
 * @param placeholder - A string that is displayed as the placeholder for the dropdown
 * @param name - A string that is used as the name for the dropdown - optional if not passed the name returned will be the label of the selected item
 * @param onChange - A function that handles the click event of a dropdown item and returns an HTMLSelectElement change event
 * @param searchable - A boolean that determines whether the dropdown is searchable - optional - defaults to false
 * @param alternate - A boolean that determines whether the dropdown displays the emptySearchPhrase or noResultsPhrase and utilises the minimumSearchQuery - optional - defaults to false
 * @param emptySearchPhrase - A string that is displayed when the search input is empty - optional - defaults to "Start typing to search"
 * @param noResultsPhrase - A string that is displayed when the search input returns no results - optional - defaults to "No items match your search"
 * @param minimumSearchQuery - A number that determines the minimum number of characters required to trigger the search - optional - defaults to 1
 * @param stylingClassnames - An object that contains the classnames for the dropdown container, input, dropdown, iconColour, rounded and shadow - optional
 * @param asyncFunction - A function to handle the async call to get the dropdown data, takes the search query as an argument, should return an array of objects {label: string, value: string} - optional
 * @param asyncValue - An array of objects {label: string, value: string} that is used to display the selected items in the dropdown - optional
 * @param clearable - A boolean that determines whether the dropdown can be cleared - optional - defaults to true
 * @param isMulti - A boolean that determines whether the dropdown is a multi select - optional - defaults to false
 * @returns The dropdown component
 */

export default function Dropdown({
  items,
  value,
  placeholder,
  name,
  onChange,
  searchable = false,
  alternate = false,
  emptySearchPhrase = 'Start typing to search',
  noResultsPhrase = 'No items match your search',
  minimumSearchQuery = 1,
  stylingClassnames,
  asyncFunction,
  asyncValue,
  clearable = true,
  isMulti = false,
}: IDropdownProps) {
  const {
    isOpen,
    setIsOpen,
    handleToggle,
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
    searchable,
    alternate,
    emptySearchPhrase,
    noResultsPhrase,
    minimumSearchQuery,
    asyncFunction,
    stylingClassnames,
    isMulti,
    value,
    asyncValue,
  })

  const label = Array.isArray(value)
    ? value?.length > 0
      ? value
      : placeholder
    : asyncFunction
    ? asyncState.selectedItems.find((item) => item.value === value)?.label ??
      placeholder
    : items?.find((item) => item.value === value)?.label ?? placeholder

  const calculateMultiLabel = () => {
    if (
      (asyncValue && asyncValue.length > 0) ||
      asyncState.selectedItems.length > 0
    ) {
      return asyncState.selectedItems
    } else if (value && value.length > 0) {
      return (
        items?.filter(
          (item) => Array.isArray(value) && value.some((v) => v === item.value)
        ) ?? placeholder
      )
    } else {
      return placeholder
    }
  }

  const iconClassnames =
    'w-5 h-5 transition-all cursor-pointer duration-300 ease-in-out'

  const getLabelFromValue = () => {
    if (Array.isArray(value) || Array.isArray(asyncValue)) {
      return placeholder
    }

    if (asyncFunction) {
      const selectedItem = asyncState.selectedItems.find(
        (item) => JSON.stringify(item) === JSON.stringify(asyncValue)
      )
      return selectedItem?.label ?? placeholder
    }

    const selectedLabel = items?.find((item) => item?.value === value)?.label
    return selectedLabel || placeholder
  }

  const input = (
    <input
      id="dropdown-search"
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      className={`${classnames.input} ${classnames.rounded}`}
      type="search"
      placeholder={getLabelFromValue()}
      value={filterText}
      onChange={handleInputChange}
      onClick={(e) => e.stopPropagation()}
      ref={inputRef}
      autoComplete="off"
      tabIndex={searchable ? 0 : undefined}
      key={'input-key'}
    />
  )

  return (
    <div
      className={`w-full text-black relative`}
      ref={dropdownRef}
      role="listbox"
      aria-label={placeholder}
      tabIndex={searchable ? undefined : 0}
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
            asyncFunction
              ? asyncValue?.map((value: IObjectItem) => value.value)
              : value
          }
          className="opacity-0 sr-only"
          onChange={onChange}
          multiple={isMulti}
        >
          {items
            ? items?.map((item) => {
                return (
                  <option
                    key={`${item.value}-sr-only`}
                    value={item.value}
                    className="opacity-0"
                  >
                    {item.label}
                  </option>
                )
              })
            : mergeArraysAndRemoveDuplicates(
                [...asyncState.data, ...asyncState.selectedItems],
                'value'
              ).map((item) => {
                return (
                  <option
                    key={`${item.value}-sr-only`}
                    value={item.value}
                    className="opacity-0"
                  >
                    {item.label}
                  </option>
                )
              })}
        </select>
        {isMulti && (Array.isArray(asyncValue) || Array.isArray(value)) ? (
          <MultiDropdownToggle
            label={calculateMultiLabel()}
            iconColour={classnames.iconColour}
            handleRemoveSingle={handleRemoveSingle}
            stylingClassnames={classnames}
            searchable={searchable}
            input={input}
          />
        ) : (
          !searchable && (
            <div className="p-1.5 flex justify-between items-center select-none bg-transparent w-full">
              <p>
                {items?.find((item) => item.value === value)?.label ??
                  placeholder}
              </p>
            </div>
          )
        )}
        {searchable && !isMulti && <div className="w-full">{input}</div>}
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
