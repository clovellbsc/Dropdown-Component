import { IObjectItem } from '../types/dropdown'
import Item from './DropdownItem'
import React from 'react'
import 'tailwindcss/tailwind.css'

interface IDropdownListProps {
  filterText: string
  minimumSearchQuery?: number
  data: IObjectItem[]
  emptySearchPhrase?: string
  noResultsPhrase?: string
  handleClick: (item: IObjectItem) => void
  dropdownClassnames: string
  loading?: boolean
  highlightedIndex?: number
  handleMouseOver: (index: number) => void
  selected: IObjectItem | null | IObjectItem[]
  highlightColor: string
  highlightTextColor: string
  dropdownItemClassnames?: string
}

export default function DropdownList({
  filterText,
  minimumSearchQuery,
  data,
  emptySearchPhrase,
  noResultsPhrase,
  handleClick,
  dropdownClassnames,
  loading,
  highlightedIndex,
  handleMouseOver,
  selected,
  highlightColor,
  highlightTextColor,
  dropdownItemClassnames,
}: IDropdownListProps) {
  if (loading) {
    return (
      <div className={`p-5 text-gray-400 ${dropdownClassnames}`}>
        <p>Loading results</p>
      </div>
    )
  }

  return (
    <ul className={dropdownClassnames} id="dropdown-list">
      {minimumSearchQuery && filterText.length < minimumSearchQuery && (
        <div className="p-5 text-gray-400">{emptySearchPhrase}</div>
      )}
      {!minimumSearchQuery ||
      (filterText.length >= minimumSearchQuery && data?.length > 0 && !loading)
        ? data.map((item: IObjectItem, index: number) => {
            return (
              <li
                key={index}
                onClick={() => {
                  handleClick(item)
                }}
                onMouseOver={() => handleMouseOver(index)}
                tabIndex={-1}
                id={`dropdown-item-${index}`}
                // className="focus:outline-none"
                onMouseDown={(e) => e.preventDefault()}
                role="option"
                aria-describedby="dropdown-list"
                aria-selected={
                  String(
                    Array.isArray(selected)
                      ? !!selected.find((i) => i.value === item.value)
                      : selected?.value === item.value
                  ) as 'true' | 'false'
                }
                aria-current={
                  String(index === highlightedIndex) as 'true' | 'false'
                }
                className={`${
                  index === highlightedIndex &&
                  highlightColor + ' ' + highlightTextColor
                }`}
              >
                <Item
                  item={item}
                  highlighted={index === highlightedIndex}
                  selected={
                    Array.isArray(selected)
                      ? !!selected.find((i) => i.value === item.value)
                      : selected?.value === item.value
                  }
                  highlightColor={highlightColor}
                  highlightTextColor={highlightTextColor}
                  dropdownItemClassnames={dropdownItemClassnames}
                />
              </li>
            )
          })
        : filterText.length >= minimumSearchQuery &&
          data?.length === 0 && (
            <div className="p-5 text-gray-400">
              <p>{noResultsPhrase}</p>
            </div>
          )}
    </ul>
  )
}
