import { IDropdownProps, IObjectItem } from '../types/dropdown'
import React, { forwardRef } from 'react'
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
 * @param debounceTime - A number that determines the time in milliseconds to debounce the asyncFunction - optional - defaults to 300
 * @returns The dropdown component
 */

export default function Dropdown({
  items,
  value,
  placeholder = 'Select an item',
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
  debounceTime = 300,
  disabled = false,
  ...selectProps
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
    debounceTime,
    disabled: disabled,
  })

  const calculateLabel = () => {
    if (Array.isArray(value) || Array.isArray(asyncValue)) {
      return calculateMultiLabel()
    }

    const selectedAsyncItem = asyncState.selectedItems.find(
      (item) => item.value === asyncValue?.value
    )

    if (asyncFunction && selectedAsyncItem) {
      return selectedAsyncItem?.label
    }

    const selectedItem = items?.find((item) => item.value === value)

    if (items && selectedItem) {
      return selectedItem?.label
    }

    return placeholder
  }

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
      return ''
    }

    if (asyncFunction) {
      const selectedItem = asyncState.selectedItems.find(
        (item) => JSON.stringify(item) === JSON.stringify(asyncValue)
      )
      return selectedItem?.label || ''
    }

    const selectedLabel = items?.find((item) => item?.value === value)?.label
    return selectedLabel || ''
  }

  const getSelectValue = () => {
    if (!asyncFunction) return value

    if (isMulti)
      return asyncState.selectedItems.map((value: IObjectItem) => value.value)

    return asyncState.selectedItems[0]?.value ?? ''
  }

  return (
    <div
      className={`w-full text-black relative ${disabled ? 'opacity-50' : ''}`}
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
          value={getSelectValue()}
          className="opacity-0 sr-only"
          onChange={onChange}
          multiple={isMulti}
          {...selectProps}
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
        {isMulti && (Array.isArray(asyncValue) || Array.isArray(value)) && (
          <MultiDropdownToggle
            label={calculateMultiLabel()}
            iconColour={classnames.iconColour}
            handleRemoveSingle={handleRemoveSingle}
            stylingClassnames={classnames}
            searchable={searchable}
            input={
              <SearchableInput
                setIsOpen={setIsOpen}
                filterText={filterText}
                handleInputChange={handleInputChange}
                getLabelFromValue={getLabelFromValue}
                inputRef={inputRef}
                searchable={searchable}
                classnames={classnames}
                disabled={disabled}
                placeholder={placeholder}
              />
            }
          />
        )}
        {!isMulti && (
          <div className="w-full">
            <SearchableInput
              setIsOpen={setIsOpen}
              filterText={filterText}
              handleInputChange={handleInputChange}
              getLabelFromValue={getLabelFromValue}
              inputRef={inputRef}
              searchable={searchable}
              classnames={classnames}
              disabled={disabled}
              placeholder={placeholder}
            />
          </div>
        )}
        <div className="flex h-full ml-auto">
          {calculateLabel() !== placeholder && clearable && (
            <button className={iconClassnames} type="button">
              <XIcon
                fill={classnames?.iconColour ?? '#000'}
                onClick={() => {
                  handleRemoveSelected && handleRemoveSelected()
                  setFilterText('')
                }}
              />
            </button>
          )}
          {!isOpen ? (
            <button className={iconClassnames + 'rotate'} type="button">
              <ChevronDownIcon
                fill={classnames?.iconColour ?? '#000'}
                onClick={handleToggle}
              />
            </button>
          ) : (
            <button className={iconClassnames + 'rotate'} type="button">
              <ChevronUpIcon
                fill={classnames?.iconColour ?? '#000'}
                onClick={handleToggle}
              />
            </button>
          )}
        </div>
        {isOpen && !disabled && dropdownList}
      </div>
    </div>
  )
}

const SearchableInput = forwardRef(
  (
    {
      setIsOpen,
      filterText,
      handleInputChange,
      getLabelFromValue,
      searchable,
      classnames,
      disabled,
      placeholder,
    }: {
      setIsOpen: (value: boolean) => void
      filterText: string
      handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
      getLabelFromValue: () => string | undefined
      inputRef: React.RefObject<HTMLInputElement>
      searchable: boolean
      classnames: { input: string; rounded: string }
      disabled: boolean
      placeholder: string
    },
    inputRef: React.ForwardedRef<HTMLInputElement>
  ) => {
    const [isDisabled, setIsDisabled] = React.useState(false)
    const [value, setValue] = React.useState<string | undefined>(undefined)

    React.useEffect(() => {
      const isDisabled = disabled || !searchable
      setIsDisabled(isDisabled)
    }, [disabled, searchable])

    React.useEffect(() => {
      setValue(filterText ? filterText : getLabelFromValue())
    }, [filterText, getLabelFromValue])

    return (
      <input
        id="dropdown-search"
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className={`${classnames.input} ${classnames.rounded} ${
          disabled ? '' : 'cursor-pointer'
        } ${searchable ? 'cursor-text' : ''}`}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onClick={(e) => e.stopPropagation()}
        ref={inputRef}
        autoComplete="off"
        tabIndex={searchable ? 0 : undefined}
        key={'input-key'}
        disabled={isDisabled}
      />
    )
  }
)
