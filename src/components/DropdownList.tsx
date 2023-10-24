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
  selected: IObjectItem | null
  highlightColor: string
  highlightTextColor: string
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
                className="focus:outline-none"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Item
                  item={item}
                  highlighted={index === highlightedIndex}
                  selected={selected?.value === item.value}
                  highlightColor={highlightColor}
                  highlightTextColor={highlightTextColor}
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
